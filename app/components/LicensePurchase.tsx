"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWalletClient,
  useBalance,
  usePublicClient,
} from "wagmi";
import {
  executeRoyaltyPayment,
  getDeBridgeTransactionData,
  getLicenseTokenId,
  type RoyaltyPaymentParams,
} from "../lib/debridge";
import { parseEther, formatEther } from "viem";

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
  const publicClient = usePublicClient();
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
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Purchase Commercial License
        </h3>

        {/* Story Address Input */}
        <div className="mb-4">
          <label
            htmlFor="storyAddress"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Story Address (to receive license)
          </label>
          <input
            type="text"
            id="storyAddress"
            value={storyAddress}
            onChange={(e) => setStoryAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your Story address where you want to receive the commercial
            license
          </p>
        </div>

        {/* Cost Estimation Display */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Estimated Cost:</span>
            <span className="font-medium">
              {isLoadingCost ? (
                <span className="animate-pulse text-gray-500">Loading...</span>
              ) : ethCost === "ERROR" ? (
                <span className="text-red-600">Error loading price</span>
              ) : ethCost ? (
                <span
                  className={
                    hasInsufficientBalance ? "text-red-600" : "text-gray-900"
                  }
                >
                  {ethCost} ETH
                </span>
              ) : (
                <span className="text-gray-500">
                  {commercialLicensePriceWip} WIP
                </span>
              )}
            </span>
          </div>
          {balance && (
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
              <span>Your Balance:</span>
              <span>
                {parseFloat(formatEther(balance.value)).toFixed(6)} ETH
              </span>
            </div>
          )}
        </div>

        {/* Error Messages - Show only one error at a time, balance takes precedence */}
        {hasInsufficientBalance ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ❌ Insufficient balance. You need {ethCost} ETH but only have{" "}
              {balance
                ? parseFloat(formatEther(balance.value)).toFixed(6)
                : "0"}{" "}
              ETH.
            </p>
          </div>
        ) : !storyAddress ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ❌ Please enter your Story address to receive the license.
            </p>
          </div>
        ) : null}

        <button
          onClick={handleCommercialLicense}
          disabled={
            licenseStatus === "minting" ||
            !storyAddress ||
            hasInsufficientBalance ||
            ethCost === "ERROR" ||
            isLoadingCost
          }
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg mb-4"
        >
          {licenseStatus === "minting" && "Processing Payment..."}
          {licenseStatus === "success" && "✅ License Purchased!"}
          {licenseStatus === "error" && "❌ Try Again"}
          {licenseStatus === "idle" && "Buy License"}
        </button>

        {/* Status */}
        {licenseStatus === "minting" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-yellow-800">
              Processing cross-chain payment to Story...
            </p>
          </div>
        )}

        {licenseStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm text-green-800 mb-3">
              License purchased successfully! You can now use this music
              commercially.
            </p>
            <div className="space-y-2">
              {baseTxHash && (
                <div>
                  <p className="text-xs text-green-700 font-medium">
                    Base Payment:
                  </p>
                  <a
                    href={`https://basescan.org/tx/${baseTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline block"
                  >
                    {baseTxHash.slice(0, 10)}...{baseTxHash.slice(-8)} →
                  </a>
                </div>
              )}
              {storyTxHash && (
                <div>
                  <p className="text-xs text-green-700 font-medium">
                    Story License:
                  </p>
                  <a
                    href={`https://www.storyscan.io/tx/${storyTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline block"
                  >
                    {storyTxHash.slice(0, 10)}...{storyTxHash.slice(-8)} →
                  </a>
                </div>
              )}
              {licenseTokenId && (
                <div>
                  <p className="text-xs text-green-700 font-medium">
                    License Token ID:
                  </p>
                  <a
                    href={`https://explorer.story.foundation/transactions/${storyTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline block"
                  >
                    #{licenseTokenId}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {licenseStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-800">
              Payment failed. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-bold text-xs">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Connect Base Wallet</p>
              <p className="text-gray-600">
                Use your Base wallet to pay for the license
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 font-bold text-xs">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Cross-Chain Payment</p>
              <p className="text-gray-600">
                deBridge converts ETH to WIP tokens for Story
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-xs">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">License Granted</p>
              <p className="text-gray-600">
                Story mints you a license to use the music commercially
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
