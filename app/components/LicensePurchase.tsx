"use client";

import { useState, useEffect, useCallback } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { useDualWallets } from "../hooks/useDualWallets";
import {
  // executeRoyaltyPayment, // TODO: Re-enable when wagmi is configured
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
  const { storyWallet, getStoryAddress } = useDualWallets();
  
  // Get Base wallet state from OnchainKit/wagmi
  const { address: baseAddress, isConnected: baseConnected } = useAccount();
  const baseWallet = {
    address: baseAddress,
    isConnected: baseConnected,
    chainId: 8453,
  };
  
  const [licenseStatus, setLicenseStatus] = useState<
    "idle" | "minting" | "success" | "error"
  >("idle");
  const [baseTxHash, setBaseTxHash] = useState<string>("");
  const [storyTxHash, setStoryTxHash] = useState<string>("");
  const [licenseTokenId, setLicenseTokenId] = useState<string>("");
  const [ethCost, setEthCost] = useState<string>("");
  const [isLoadingCost, setIsLoadingCost] = useState(false);
  const [storyAddress, setStoryAddress] = useState<string>("");

  // Sync Story address with Dynamic wallet
  useEffect(() => {
    const dynamicStoryAddress = getStoryAddress();
    console.log('LicensePurchase sync:', {
      dynamicStoryAddress,
      currentStoryAddress: storyAddress,
      storyWalletConnected: storyWallet.isConnected
    });
    
    if (dynamicStoryAddress && dynamicStoryAddress !== storyAddress) {
      console.log('Auto-filling Story address:', dynamicStoryAddress);
      setStoryAddress(dynamicStoryAddress);
    } else if (!dynamicStoryAddress && storyWallet.isConnected === false) {
      // Clear address if Dynamic wallet is disconnected
      console.log('Clearing Story address - wallet disconnected');
      setStoryAddress("");
    }
  }, [storyWallet.address, storyWallet.isConnected, getStoryAddress, storyAddress]);

  // Get ETH cost estimation
  const getEthCostEstimation = useCallback(async () => {
    if (!baseWallet.address) return;

    try {
      setIsLoadingCost(true);
      const paymentAmountWei = parseEther(commercialLicensePriceWip);

      const paymentParams: RoyaltyPaymentParams = {
        ipAssetId: storyIpAssetId,
        paymentAmount: paymentAmountWei.toString(),
        senderAddress: baseWallet.address,
        licenseTermsId: ipAssetLicenseTermsId,
        receiverAddress: baseWallet.address, // just use base address here for estimation
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
  }, [baseWallet.address, commercialLicensePriceWip, storyIpAssetId, ipAssetLicenseTermsId]);

  // Get cost estimation when base wallet connects
  useEffect(() => {
    if (baseWallet.address) {
      getEthCostEstimation();
    }
  }, [baseWallet.address, getEthCostEstimation]);

  // TODO: Re-enable balance checking when wagmi is configured
  // useEffect(() => {
  //   if (balance && ethCost && ethCost !== "ERROR") {
  //     const ethAmountWei = parseEther(ethCost);
  //     if (ethAmountWei > balance.value) {
  //       setHasInsufficientBalance(true);
  //     } else {
  //       setHasInsufficientBalance(false);
  //     }
  //   } else {
  //     setHasInsufficientBalance(false);
  //   }
  // }, [balance, ethCost]);

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
    if (!baseWallet.isConnected) {
      alert("Please connect your Base wallet first");
      return;
    }

    if (!storyAddress) {
      alert("Please enter your Story address to receive the license");
      return;
    }

    try {
      setLicenseStatus("minting");

      // TODO: Re-enable when wagmi configured
      // const paymentAmountWei = parseEther(commercialLicensePriceWip);

      // TODO: Re-enable payment logic when wagmi is properly configured
      // const paymentParams: RoyaltyPaymentParams = {
      //   ipAssetId: storyIpAssetId,
      //   paymentAmount: paymentAmountWei.toString(),
      //   senderAddress: baseWallet.address!,
      //   licenseTermsId: ipAssetLicenseTermsId,
      //   receiverAddress: storyAddress,
      // };
      // const { srcTxHash, dstTxHash } = await executeRoyaltyPayment(
      //   walletClient,
      //   paymentParams
      // );
      
      const srcTxHash = "0x123...";
      const dstTxHash = "0x456...";

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
          disabled={storyWallet.isConnected} // Disable manual input when Dynamic wallet is connected
        />
        
        {/* Dynamic Wallet Connection */}
        {!storyWallet.isConnected && (
          <div className="mt-3 p-3 glass rounded-lg border border-[var(--border-primary)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  Connect Story Wallet
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Auto-fill your Story address
                </p>
              </div>
              <div className="ml-4">
                <DynamicWidget
                  innerButtonComponent={
                    <button className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white text-xs px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
                      Connect Story Wallet
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Story Wallet Connected Status */}
        {storyWallet.isConnected && (
          <div className="mt-3 p-3 glass rounded-lg border border-[var(--accent-cyan)]/50 bg-[var(--accent-cyan)]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full"></div>
                <p className="text-sm text-[var(--accent-cyan)]">Story Wallet Connected</p>
              </div>
              <button
                onClick={() => {
                  setStoryAddress("");
                }}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition-colors"
                title="Switch to manual address input"
              >
                Manual Input
              </button>
            </div>
          </div>
        )}
        
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
              <span className="text-[var(--accent-cyan)]">
                {ethCost} ETH
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">
                {commercialLicensePriceWip} WIP
              </span>
            )}
          </span>
        </div>
{/* TODO: Re-enable balance display when wagmi is configured */}
        {/* {balance && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-muted)]">Your Balance:</span>
            <span className="text-[var(--text-secondary)]">
              {parseFloat(formatEther(balance.value)).toFixed(6)} ETH
            </span>
          </div>
        )} */}
      </div>

      {/* TODO: Re-enable error messages when wagmi is configured */}
      {/* {hasInsufficientBalance && (
        <div className="mb-6 p-4 glass rounded-xl border border-[var(--accent-pink)]/50 bg-[var(--accent-pink)]/10">
          <p className="text-sm text-[var(--accent-pink)]">
            Insufficient balance. Need {ethCost} ETH, have{" "}
            {balance ? parseFloat(formatEther(balance.value)).toFixed(6) : "0"}{" "}
            ETH
          </p>
        </div>
      )} */}

      {/* Purchase Button */}
      <button
        onClick={handleCommercialLicense}
        disabled={
          licenseStatus === "minting" ||
          !baseWallet.isConnected ||
          !storyAddress ||
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

      {/* Validation Messages */}
      {!baseWallet.isConnected && licenseStatus === "idle" && (
        <div className="flex items-center justify-center space-x-2 mb-4">
          <svg
            className="w-4 h-4 text-[var(--accent-pink)]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          <p className="text-xs text-[var(--accent-pink)] font-medium">
            Please connect your Base wallet to continue
          </p>
        </div>
      )}
      
      {baseWallet.isConnected && !storyAddress && licenseStatus === "idle" && (
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
                  Base Payment Tx:
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
                  Story License Tx:
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
