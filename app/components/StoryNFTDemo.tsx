"use client";

import { useState } from "react";
import { NFTMintCard } from "@coinbase/onchainkit/nft";
import { useAccount, useWalletClient } from "wagmi";
import {
  getDeBridgeTransactionData,
  type RoyaltyPaymentParams,
} from "../lib/story";
import { parseEther } from "viem";
import type { LifecycleStatus } from "@coinbase/onchainkit/nft";

// Real NFT contract address on Base Sepolia
const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
  "0xb4703a3a73aec16e764cbd210b0fde9efdab8941") as `0x${string}`;

// Story IP Asset to receive commercial license payments
const STORY_IP_ASSET_ID =
  process.env.NEXT_PUBLIC_STORY_IP_ASSET_ID ||
  "0xcb6B9CCae4108A103097B30cFc25e1E257D4b5Fe";

const COMMERCIAL_LICENSE_PRICE_WIP = "0.00001";

const STORY_RECEIVER_ADDRESS = "0x089d75C9b7E441dA3115AF93FF9A855BDdbfe384";

export default function StoryNFTDemo() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [nftMintStatus, setNftMintStatus] = useState<
    "idle" | "minting" | "success" | "error"
  >("idle");
  const [licenseStatus, setLicenseStatus] = useState<
    "idle" | "minting" | "success" | "error"
  >("idle");
  const [nftTxHash, setNftTxHash] = useState<string>("");
  const [licenseTxHash, setLicenseTxHash] = useState<string>("");

  // Handle regular NFT mint status
  const handleNFTStatus = async (status: LifecycleStatus) => {
    console.log("NFT Mint Status:", status);

    if (
      status.statusName === "success" &&
      status.statusData?.transactionReceipts
    ) {
      const receipt = status.statusData.transactionReceipts[0];
      setNftTxHash(receipt.transactionHash);
      setNftMintStatus("success");
    } else if (status.statusName === "error") {
      setNftMintStatus("error");
    } else if (status.statusName === "transactionPending") {
      setNftMintStatus("minting");
    }
  };

  // Handle commercial license cross-chain payment
  const handleCommercialLicense = async () => {
    if (!address || !walletClient) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setLicenseStatus("minting");

      // Calculate payment amount in WIP tokens
      const paymentAmountWei = parseEther(COMMERCIAL_LICENSE_PRICE_WIP);

      // Prepare payment parameters for Story IP Asset
      const paymentParams: RoyaltyPaymentParams = {
        ipAssetId: STORY_IP_ASSET_ID,
        paymentAmount: paymentAmountWei.toString(),
        senderAddress: address,
        licenseTermsId: "27910",
        receiverAddress: STORY_RECEIVER_ADDRESS,
      };

      // Get deBridge transaction data for cross-chain payment
      const deBridgeResponse = await getDeBridgeTransactionData(paymentParams);

      // Execute the cross-chain transaction
      const txHash = await walletClient.sendTransaction({
        to: deBridgeResponse.tx.to as `0x${string}`,
        data: deBridgeResponse.tx.data as `0x${string}`,
        value: BigInt(deBridgeResponse.tx.value),
        account: address as `0x${string}`,
      });

      setLicenseTxHash(txHash);
      setLicenseStatus("success");
    } catch (error) {
      console.error("Error with commercial license payment:", error);
      setLicenseStatus("error");
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Story × Base Educational Demo
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Please connect your wallet to mint NFTs or purchase commercial
          licenses with cross-chain payments to Story Protocol.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Story × Base Educational Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Mint an NFT on Base Sepolia or purchase a commercial license with
          cross-chain payment to Story Protocol
        </p>
      </div>

      {/* Regular NFT Mint */}
      <div className="relative">
        <h3 className="font-semibold mb-3">🎨 Regular NFT Mint</h3>
        <NFTMintCard
          contractAddress={NFT_CONTRACT_ADDRESS}
          onStatus={handleNFTStatus}
        />

        {/* NFT Mint Status */}
        {nftMintStatus !== "idle" && (
          <div className="mt-4 p-3 rounded-lg">
            {nftMintStatus === "minting" && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                <p className="text-sm">🔄 Minting NFT...</p>
              </div>
            )}

            {nftMintStatus === "success" && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                <p className="text-sm mb-2">🎉 NFT minted successfully!</p>
                {nftTxHash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${nftTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline block"
                  >
                    View NFT mint transaction →
                  </a>
                )}
              </div>
            )}

            {nftMintStatus === "error" && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
                <p className="text-sm">
                  ❌ Error minting NFT. Please try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Commercial License */}
      <div className="relative">
        <button
          onClick={handleCommercialLicense}
          disabled={!isConnected || licenseStatus === "minting"}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {licenseStatus === "minting" && "Processing Cross-Chain Payment..."}
          {licenseStatus === "success" && "✅ License Purchased!"}
          {licenseStatus === "error" && "❌ Error - Try Again"}
          {licenseStatus === "idle" &&
            `Purchase Commercial License (${COMMERCIAL_LICENSE_PRICE_WIP} WIP)`}
        </button>

        {/* License Status */}
        {licenseStatus !== "idle" && (
          <div className="mt-4 p-3 rounded-lg">
            {licenseStatus === "minting" && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                <p className="text-sm">
                  🔄 Processing cross-chain payment to Story Protocol...
                </p>
              </div>
            )}

            {licenseStatus === "success" && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                <p className="text-sm mb-2">
                  🎉 Commercial license purchased! Payment sent to Story IP
                  Asset.
                </p>
                {licenseTxHash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${licenseTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline block"
                  >
                    View cross-chain payment transaction →
                  </a>
                )}
              </div>
            )}

            {licenseStatus === "error" && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
                <p className="text-sm">
                  ❌ Error with cross-chain payment. Please try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Educational Info */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">🎓 What&apos;s happening here?</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>
            • <strong>Regular Mint:</strong> Standard NFT minting on Base
            Sepolia
          </li>
          <li>
            • <strong>Commercial License:</strong> Cross-chain payment to Story
            IP Asset
          </li>
          <li>• deBridge facilitates ETH → WIP token swaps</li>
          <li>• Story Protocol receives automatic royalty payments</li>
        </ul>
      </div>
    </div>
  );
}
