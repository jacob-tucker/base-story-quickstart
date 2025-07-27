"use client";

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
import ArrowSvg from "./svg/ArrowSvg";
import ImageSvg from "./svg/Image";
import OnchainkitSvg from "./svg/OnchainKit";
import StoryNFTDemo from "./components/StoryNFTDemo";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gray-900 dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-end">
          <div className="wallet-container">
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
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-1/4 mx-auto mb-4">
              <ImageSvg />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Story × Base Educational Quickstart
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Learn how to integrate cross-chain royalty payments between Base
              and Story Protocol
            </p>
            <div className="flex justify-center mb-4">
              <a target="_blank" rel="_template" href="https://onchainkit.xyz">
                <OnchainkitSvg className="dark:text-white text-black" />
              </a>
            </div>
          </div>

          {/* Main Demo Section */}
          <div className="mb-8">
            <StoryNFTDemo />
          </div>
        </div>
      </main>
    </div>
  );
}
