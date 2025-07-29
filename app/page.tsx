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
import BaseImage from "./svg/BaseImage";

const STORY_IP_ASSET_ID = "0xcb6B9CCae4108A103097B30cFc25e1E257D4b5Fe";
const COMMERCIAL_LICENSE_PRICE_WIP = "0.00001";
const IP_ASSET_LICENSE_TERMS_ID = "27910";

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen">
      {/* Cyberpunk Header */}
      <header className="glass border-b border-[var(--border-primary)] px-6 py-3">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <BaseImage />
              </div>
              <span className="font-semibold gradient-text">BASE</span>
            </div>
            <div className="w-1 h-1 bg-[var(--accent-cyan)] rounded-full animate-pulse"></div>
            <div className="flex items-center space-x-3">
              <img
                src="/assets/story-logo.jpg"
                alt="Story Protocol"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold gradient-text">STORY</span>
            </div>
          </div>

          <Wallet>
            <ConnectWallet className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] hover:from-[var(--accent-cyan)] hover:to-[var(--accent-purple)] btn-glow rounded-lg px-4 py-2 text-sm font-medium">
              <Avatar className="h-5 w-5" />
              <Name className="text-white" />
            </ConnectWallet>
            <WalletDropdown className="glass border border-[var(--border-primary)]">
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name className="text-[var(--text-primary)]" />
                <Address className="text-[var(--text-secondary)]" />
                <EthBalance className="text-[var(--text-secondary)]" />
              </Identity>
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)]"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect className="text-[var(--text-secondary)] hover:text-[var(--accent-pink)]" />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Cross-Chain Music Licensing
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Purchase commercial music licenses using Base → Story cross-chain
            payments
          </p>
        </div>

        {/* Mainnet Warning */}
        <div className="glass rounded-2xl p-6 mb-8 border border-[var(--accent-pink)]/50 bg-[var(--accent-pink)]/10">
          <div className="flex items-start space-x-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--accent-pink)] mb-2">
                Mainnet Warning
              </h3>
              <p className="text-[var(--text-secondary)]">
                This demo uses real mainnet transactions because deBridge does
                not work on testnet. If you try the demo, only use wallets you
                don't care about.
              </p>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13z" />
                <path d="M16 8l-5.5 3L16 14v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-[var(--text-secondary)]">
              Start purchasing commercial music licenses
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* How It Works & Example Success - Show when connected */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* How It Works */}
              <div className="glass rounded-2xl p-6 glow-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">?</span>
                  </div>
                  <h3 className="text-lg font-semibold gradient-text">
                    How It Works
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[var(--accent-cyan)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--accent-cyan)] font-bold text-xs">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Connect Base Wallet
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Pay with ETH on Base
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--accent-purple)] font-bold text-xs">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Cross-Chain Bridge
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        deBridge converts ETH → WIP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[var(--accent-pink)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--accent-pink)] font-bold text-xs">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        License Minted
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Receive commercial license on Story
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Example Success */}
              <div className="glass rounded-2xl p-6 glow-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold gradient-text">
                      Real Transaction Example
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Actual cross-chain license purchase that happened
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 glass rounded-lg border border-[var(--border-primary)]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--text-secondary)]">
                        Base Payment:
                      </span>
                      <a
                        href="https://basescan.org/tx/0x8532e90ee671268f578202850a1709a8d512f71b1a81bf3eb4929d6a627eb76a"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
                      >
                        0x8532e90ee6...627eb76a ↗
                      </a>
                    </div>
                  </div>
                  <div className="p-3 glass rounded-lg border border-[var(--border-primary)]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--text-secondary)]">
                        Story License:
                      </span>
                      <a
                        href="https://www.storyscan.io/tx/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
                      >
                        0x5a41060e17...b270fda ↗
                      </a>
                    </div>
                  </div>
                  <div className="p-3 glass rounded-lg border border-[var(--border-primary)]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--text-secondary)]">
                        License Token:
                      </span>
                      <a
                        href="https://explorer.story.foundation/transactions/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
                      >
                        #36896 ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interface */}
            <div className="grid lg:grid-cols-2 gap-8">
              <MusicPlayer
                coverImage="/assets/music-cover.jpeg"
                audioSrc="/assets/music-track.mp3"
                title="Midnight Marriage"
                subtitle="Protected by Story"
              />
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
