// Types for deBridge integration
export interface DeBridgeApiResponse {
  estimation: {
    srcChainTokenIn: {
      amount: string;
      approximateOperatingExpense: string;
    };
    dstChainTokenOut: {
      amount: string;
      maxTheoreticalAmount: string;
    };
  };
  tx: {
    to: string;
    data: string;
    value: string;
  };
  orderId: string;
}

export interface RoyaltyPaymentParams {
  ipAssetId: string;
  licenseTermsId: string;
  paymentAmount: string; // Amount in WIP tokens (wei)
  receiverAddress: string;
  senderAddress: string;
}

// Types for dual wallet management
export interface DualWalletState {
  baseWallet: {
    address: string | undefined;
    isConnected: boolean;
    chainId: number | undefined;
  };
  storyWallet: {
    address: string | undefined;
    isConnected: boolean;
    chainId: number | undefined;
  };
}

export interface DualWalletActions {
  connectStoryWallet: () => void;
  disconnectStoryWallet: () => void;
  getStoryAddress: () => string | undefined;
  getBaseAddress: () => string | undefined;
}
