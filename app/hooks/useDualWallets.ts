"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { mainnet } from "@story-protocol/core-sdk";
import { DualWalletState, DualWalletActions } from "../lib/types";

const STORY_CHAIN_ID = mainnet.id; // Story mainnet

export function useDualWallets(): DualWalletState & DualWalletActions {
  const { primaryWallet } = useDynamicContext();
  
  const [storyAddress, setStoryAddress] = useState<string | undefined>(undefined);

  // Update Story address when Dynamic wallet connects
  useEffect(() => {
    console.log('Dynamic wallet state:', {
      address: primaryWallet?.address,
      chain: primaryWallet?.chain,
      chainType: typeof primaryWallet?.chain,
      storyChainId: STORY_CHAIN_ID,
      primaryWallet: primaryWallet
    });
    
    if (primaryWallet?.address) {
      const walletChainId = Number(primaryWallet.chain);
      console.log('Chain comparison:', {
        walletChainId,
        storyChainId: STORY_CHAIN_ID,
        matches: walletChainId === STORY_CHAIN_ID,
        chainString: String(primaryWallet.chain),
        chainNumber: Number(primaryWallet.chain)
      });
      
      // For now, let's set the Story address if we have any Dynamic wallet connected
      // This will help us debug if the issue is with chain detection or address detection
      console.log('Setting Story address (debug mode):', primaryWallet.address);
      setStoryAddress(primaryWallet.address);
      
      // TODO: Re-enable chain checking once we confirm address detection works
      // if (walletChainId === STORY_CHAIN_ID) {
      //   console.log('Setting Story address:', primaryWallet.address);
      //   setStoryAddress(primaryWallet.address);
      // } else {
      //   console.log('Wallet connected to wrong chain:', walletChainId, 'expected:', STORY_CHAIN_ID);
      // }
    } else {
      console.log('No primary wallet address, clearing Story address');
      setStoryAddress(undefined);
    }
  }, [primaryWallet?.address, primaryWallet?.chain]);

  // Base wallet - OnchainKit will manage this independently
  // We'll detect Base connection state through OnchainKit's built-in state
  const baseWallet = {
    address: undefined, // OnchainKit manages this
    isConnected: false, // OnchainKit manages this
    chainId: undefined,
  };

  // Story wallet from Dynamic
  const storyWallet = {
    address: storyAddress,
    isConnected: !!storyAddress && !!primaryWallet?.address,
    chainId: primaryWallet?.chain ? Number(primaryWallet.chain) : undefined,
  };

  const connectStoryWallet = () => {
    // Dynamic wallet connection is handled by the DynamicWidget
    // This function can be used to trigger programmatic connection if needed
    console.log("Story wallet connection should be handled by DynamicWidget");
  };

  const disconnectStoryWallet = () => {
    if (primaryWallet && 'connector' in primaryWallet && primaryWallet.connector) {
      primaryWallet.connector.endSession?.();
      setStoryAddress(undefined);
    }
  };

  const getStoryAddress = () => storyAddress;
  const getBaseAddress = () => baseWallet.address;

  return {
    baseWallet,
    storyWallet,
    connectStoryWallet,
    disconnectStoryWallet,
    getStoryAddress,
    getBaseAddress,
  };
}