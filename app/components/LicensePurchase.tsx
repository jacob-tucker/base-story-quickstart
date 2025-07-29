"use client";

import { useState, useEffect } from "react";
import { useAccount, useWalletClient, useBalance } from "wagmi";
import {
  executeRoyaltyPayment,
  getDeBridgeTransactionData,
  getLicenseTokenId,
} from "../lib/debridge";
import { parseEther, formatEther } from "viem";
import { RoyaltyPaymentParams } from "../lib/types";

interface LicensePurchaseProps {
  storyIpAssetId: string;
  commercialLicensePriceWip: string;
  ipAssetLicenseTermsId: string;
}

export default function LicensePurchase({
  storyIpAssetId,
  commercialLicensePriceWip,
  ipAssetLicenseTermsId,
}: LicensePurchaseProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: balance } = useBalance({ address });
  const [licenseStatus, setLicenseStatus] = useState<
    "idle" | "minting" | "success" | "error"
  >("idle");
  const [baseTxHash, setBaseTxHash] = useState<string>("");
  const [storyTxHash, setStoryTxHash] = useState<string>("");
  const [licenseTokenId, setLicenseTokenId] = useState<string>("");
  const [ethCost, setEthCost] = useState<string>("");
  const [isLoadingCost, setIsLoadingCost] = useState(false);
  const [storyAddress, setStoryAddress] = useState<string>("");
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false);

  // Get ETH cost estimation
  const getEthCostEstimation = async () => {
    if (!address) return;

    try {
      setIsLoadingCost(true);
      const paymentAmountWei = parseEther(commercialLicensePriceWip);

      const paymentParams: RoyaltyPaymentParams = {
        ipAssetId: storyIpAssetId,
        paymentAmount: paymentAmountWei.toString(),
        senderAddress: address,
        licenseTermsId: ipAssetLicenseTermsId,
        receiverAddress: address, // just use `address` here for now because it won't change estimate. in reality this should be `storyAddress`
      };

      const deBridgeResponse = await getDeBridgeTransactionData(
        paymentParams,
        true
      );

      // Extract ETH cost from the transaction value
      const ethAmountWei = BigInt(deBridgeResponse.tx.value);
      const ethAmount = formatEther(ethAmountWei);
      setEthCost(parseFloat(ethAmount).toFixed(6));
    } catch (error) {
      console.error("Error getting cost estimation:", error);
      setEthCost("ERROR"); // Fallback estimate
    } finally {
      setIsLoadingCost(false);
    }
  };

  // Get cost estimation when address or storyAddress changes
  useEffect(() => {
    if (address) {
      getEthCostEstimation();
    }
  }, []);

  // Check balance whenever balance or ethCost changes (since balance loads async)
  useEffect(() => {
    if (balance && ethCost && ethCost !== "ERROR") {
      const ethAmountWei = parseEther(ethCost);
      if (ethAmountWei > balance.value) {
        setHasInsufficientBalance(true);
      } else {
        setHasInsufficientBalance(false);
      }
    } else {
      setHasInsufficientBalance(false);
    }
  }, [balance, ethCost]);

  // Get license token ID when Story transaction hash becomes available
  useEffect(() => {
    const fetchLicenseTokenId = async () => {
      if (storyTxHash) {
        try {
          const tokenId = await getLicenseTokenId(storyTxHash as `0x${string}`);
          if (tokenId) {
            setLicenseTokenId(tokenId.toString());
          }
        } catch (error) {
          console.error("Error getting license token ID:", error);
        }
      }
    };

    fetchLicenseTokenId();
  }, [storyTxHash]);

  // Handle commercial license cross-chain payment
  const handleCommercialLicense = async () => {
    if (!address || !walletClient) {
      alert("Please connect your wallet first");
      return;
    }

    if (!storyAddress) {
      alert("Please enter your Story address to receive the license");
      return;
    }

    try {
      setLicenseStatus("minting");

      // Calculate payment amount in WIP tokens
      const paymentAmountWei = parseEther(commercialLicensePriceWip);

      // Prepare payment parameters for Story IP Asset
      const paymentParams: RoyaltyPaymentParams = {
        ipAssetId: storyIpAssetId,
        paymentAmount: paymentAmountWei.toString(),
        senderAddress: address,
        licenseTermsId: ipAssetLicenseTermsId,
        receiverAddress: storyAddress,
      };

      const { srcTxHash, dstTxHash } = await executeRoyaltyPayment(
        walletClient,
        paymentParams
      );

      setBaseTxHash(srcTxHash);
      setStoryTxHash(dstTxHash || "");
      setLicenseStatus("success");
    } catch (error) {
      console.error("Error with commercial license payment:", error);
      setLicenseStatus("error");
    }
  };

  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">
            License Purchase
          </h3>
          <p className="text-[var(--text-secondary)]">
            Cross-chain payment via deBridge
          </p>
        </div>
      </div>

      {/* Story Address Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
          Story Address (recipient)
        </label>
        <input
          type="text"
          value={storyAddress}
          onChange={(e) => setStoryAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-3 glass rounded-lg border border-[var(--border-primary)] focus:border-[var(--accent-cyan)] focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors"
        />
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Where you&apos;ll receive the commercial license NFT
        </p>
      </div>

      {/* Cost Display */}
      <div className="mb-6 p-4 glass rounded-xl border border-[var(--border-primary)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[var(--text-secondary)]">Estimated Cost:</span>
          <span className="font-semibold">
            {isLoadingCost ? (
              <span className="animate-pulse text-[var(--accent-cyan)]">
                Loading...
              </span>
            ) : ethCost === "ERROR" ? (
              <span className="text-[var(--accent-pink)]">
                Error loading price
              </span>
            ) : ethCost ? (
              <span
                className={
                  hasInsufficientBalance
                    ? "text-[var(--accent-pink)]"
                    : "text-[var(--accent-cyan)]"
                }
              >
                {ethCost} ETH
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">
                {commercialLicensePriceWip} WIP
              </span>
            )}
          </span>
        </div>
        {balance && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-muted)]">Your Balance:</span>
            <span className="text-[var(--text-secondary)]">
              {parseFloat(formatEther(balance.value)).toFixed(6)} ETH
            </span>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {hasInsufficientBalance && (
        <div className="mb-6 p-4 glass rounded-xl border border-[var(--accent-pink)]/50 bg-[var(--accent-pink)]/10">
          <p className="text-sm text-[var(--accent-pink)]">
            Insufficient balance. Need {ethCost} ETH, have{" "}
            {balance ? parseFloat(formatEther(balance.value)).toFixed(6) : "0"}{" "}
            ETH
          </p>
        </div>
      )}

      {/* Purchase Button */}
      <button
        onClick={handleCommercialLicense}
        disabled={
          licenseStatus === "minting" ||
          !storyAddress ||
          hasInsufficientBalance ||
          ethCost === "ERROR" ||
          isLoadingCost
        }
        className="w-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] hover:from-[var(--accent-cyan)] hover:to-[var(--accent-purple)] disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl btn-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-2"
      >
        {licenseStatus === "minting" && "Processing Payment..."}
        {licenseStatus === "success" && "License Purchased!"}
        {licenseStatus === "error" && "Try Again"}
        {licenseStatus === "idle" && "Buy License"}
      </button>

      {!storyAddress && !hasInsufficientBalance && licenseStatus === "idle" && (
        <div className="flex items-center justify-center space-x-2 mb-4">
          <svg
            className="w-4 h-4 text-[var(--accent-pink)]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          <p className="text-xs text-[var(--accent-pink)] font-medium">
            Please enter your Story address to continue
          </p>
        </div>
      )}

      {/* Status Messages */}
      {licenseStatus === "minting" && (
        <div className="p-4 glass rounded-xl border border-[var(--accent-cyan)]/50 bg-[var(--accent-cyan)]/10">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-[var(--accent-cyan)]">
              Processing cross-chain payment...
            </p>
          </div>
        </div>
      )}

      {licenseStatus === "success" && (
        <div className="p-4 glass rounded-xl border border-[var(--accent-cyan)]/50 bg-[var(--accent-cyan)]/10">
          <p className="text-sm text-[var(--accent-cyan)] mb-4 font-medium">
            License purchased successfully! You can now use this music
            commercially.
          </p>
          <div className="space-y-3">
            {baseTxHash && (
              <div className="flex justify-between items-center p-3 glass rounded-lg">
                <span className="text-xs text-[var(--text-secondary)]">
                  Base Payment:
                </span>
                <a
                  href={`https://basescan.org/tx/${baseTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
                >
                  {baseTxHash.slice(0, 8)}...{baseTxHash.slice(-6)} ↗
                </a>
              </div>
            )}
            {storyTxHash && (
              <div className="flex justify-between items-center p-3 glass rounded-lg">
                <span className="text-xs text-[var(--text-secondary)]">
                  Story License:
                </span>
                <a
                  href={`https://www.storyscan.io/tx/${storyTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
                >
                  {storyTxHash.slice(0, 8)}...{storyTxHash.slice(-6)} ↗
                </a>
              </div>
            )}
            {licenseTokenId && (
              <div className="flex justify-between items-center p-3 glass rounded-lg">
                <span className="text-xs text-[var(--text-secondary)]">
                  License Token:
                </span>
                <a
                  href={`https://explorer.story.foundation/transactions/${storyTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
                >
                  #{licenseTokenId} ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {licenseStatus === "error" && (
        <div className="p-4 glass rounded-xl border border-[var(--accent-pink)]/50 bg-[var(--accent-pink)]/10">
          <p className="text-sm text-[var(--accent-pink)]">
            Payment failed. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
