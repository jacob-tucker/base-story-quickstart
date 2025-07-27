"use client";

import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import type { ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base} // Use Base Sepolia for testing
      config={{
        appearance: {
          mode: "auto",
          name: "Story × Base Educational Demo",
          logo: "/images/logo.png", // You can add a logo later
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
