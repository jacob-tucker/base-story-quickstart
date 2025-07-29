"use client";

import { useAccount } from "wagmi";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import MusicPlayer from "./components/MusicPlayer";
import LicensePurchase from "./components/LicensePurchase";

// Story IP Asset to receive commercial license payments
const STORY_IP_ASSET_ID = "0xcb6B9CCae4108A103097B30cFc25e1E257D4b5Fe";
const COMMERCIAL_LICENSE_PRICE_WIP = "0.00001";
const IP_ASSET_LICENSE_TERMS_ID = "27910";
// const STORY_RECEIVER_ADDRESS = "0x089d75C9b7E441dA3115AF93FF9A855BDdbfe384";

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">B</span>
              </div>
              <span className="font-semibold text-gray-900">Base</span>
            </div>
            <span className="text-gray-400">×</span>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-semibold text-gray-900">Story</span>
            </div>
          </div>

          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Music License Demo
          </h1>
          <p className="text-gray-600 text-sm">
            Purchase commercial licenses using cross-chain payments
          </p>
        </div>

        {/* Mainnet Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="text-amber-600 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800 mb-1">
                Mainnet Only
              </h3>
              <p className="text-xs text-amber-700">
                This demo runs on mainnet because deBridge cross-chain
                functionality is not available on testnets. If you wish to try
                this out live, only use wallets you don't care about.
              </p>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Connect Wallet to Continue
            </h3>
            <p className="text-gray-600 text-sm">
              Connect your wallet to purchase commercial music licenses
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Row: How It Works + Example */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* How It Works */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  🎓 How It Works
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Connect Base Wallet
                      </p>
                      <p className="text-gray-600">
                        Use your Base wallet to pay for the license
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 font-bold text-xs">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Cross-Chain Payment
                      </p>
                      <p className="text-gray-600">
                        deBridge converts ETH to WIP tokens for Story
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-bold text-xs">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        License Granted
                      </p>
                      <p className="text-gray-600">
                        Story mints you a license to use the music commercially
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example Response Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  📋 Example Success
                </h3>
                <p className="text-gray-600 text-xs mb-3">
                  What you'll see after purchasing:
                </p>

                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-xs text-green-800 mb-2">
                    ✅ License purchased successfully!
                  </p>
                  <div className="space-y-1.5">
                    <div>
                      <p className="text-xs text-green-700 font-medium">
                        Base Payment:
                      </p>
                      <a
                        href="https://basescan.org/tx/0x8532e90ee671268f578202850a1709a8d512f71b1a81bf3eb4929d6a627eb76a"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline block"
                      >
                        0x8532e90ee6...627eb76a →
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">
                        Story License:
                      </p>
                      <a
                        href="https://www.storyscan.io/tx/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline block"
                      >
                        0x5a41060e17...bd0ba61b270fda →
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">
                        License Token ID:
                      </p>
                      <a
                        href="https://explorer.story.foundation/transactions/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline block"
                      >
                        #36896 →
                      </a>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  💡 Base → Story → Token ID
                </p>
              </div>
            </div>

            {/* Bottom Row: Music Player + License Purchase */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Music Player */}
              <MusicPlayer
                coverImage="/assets/music-cover.jpeg"
                audioSrc="/assets/music-track.mp3"
                title="Licensed Music Track"
                subtitle="Protected by Story"
              />

              {/* License Purchase */}
              <LicensePurchase
                storyIpAssetId={STORY_IP_ASSET_ID}
                commercialLicensePriceWip={COMMERCIAL_LICENSE_PRICE_WIP}
                ipAssetLicenseTermsId={IP_ASSET_LICENSE_TERMS_ID}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
