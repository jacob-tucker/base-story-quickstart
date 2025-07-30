"use client";

import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { DynamicContextProvider, mergeNetworks } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import type { ReactNode } from "react";

// Story Protocol mainnet configuration
const storyMainnet = {
  chainId: 1514,
  networkId: 1514,
  name: 'Story Protocol',
  rpcUrls: ['https://mainnet.storyrpc.io/'],
  nativeCurrency: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18,
  },
  blockExplorerUrls: ['https://storyscan.io/'],
  iconUrls: ['/assets/story-logo.jpg'],
};

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          name: "Story × Base Cross-Chain Demo",
          logo: "/assets/story-logo.jpg",
        },
      }}
    >
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID as string,
          walletConnectors: [EthereumWalletConnectors],
          overrides: {
            evmNetworks: (networks) => mergeNetworks([storyMainnet], networks),
          },
        }}
      >
        {props.children}
      </DynamicContextProvider>
    </OnchainKitProvider>
  );
}
