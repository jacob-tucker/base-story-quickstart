import { Account, encodeFunctionData, WalletClient } from "viem";
import { base } from "viem/chains";

// Story Protocol constants
export const DEBRIDGE_MULTICALL = "0x6429a616f76a8958e918145d64bf7681c3936d6a"; // Story license module

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

// Build the dlnHook for Story royalty payment
export const buildRoyaltyPaymentHook = (
  params: RoyaltyPaymentParams
): string => {
  console.log("params", params);
  // Encode the payRoyaltyOnBehalf function call
  const calldata = encodeFunctionData({
    abi: [
      {
        name: "mintLicenseTokensCrossChain",
        type: "function",
        inputs: [
          { name: "licensorIpId", type: "address" },
          { name: "licenseTermsId", type: "uint256" },
          { name: "tokenAmount", type: "uint256" },
          { name: "receiver", type: "address" },
        ],
      },
    ],
    functionName: "mintLicenseTokensCrossChain",
    args: [
      params.ipAssetId as `0x${string}`,
      BigInt(params.licenseTermsId),
      BigInt(1),
      params.receiverAddress as `0x${string}`,
    ],
  });

  // Build the dlnHook JSON
  const dlnHook = {
    type: "evm_transaction_call",
    data: {
      to: DEBRIDGE_MULTICALL,
      calldata: calldata,
      gas: 0,
    },
  };

  return JSON.stringify(dlnHook);
};

// Build deBridge API URL for cross-chain royalty payment
export const buildDeBridgeApiUrl = (params: RoyaltyPaymentParams): string => {
  const dlnHook = buildRoyaltyPaymentHook(params);
  console.log("dlnHook", dlnHook);
  const encodedHook = encodeURIComponent(dlnHook);
  console.log("encodedHook", encodedHook);
  const url =
    `https://dln.debridge.finance/v1.0/dln/order/create-tx?` +
    `srcChainId=${base.id}` +
    `&srcChainTokenIn=0x0000000000000000000000000000000000000000` +
    `&srcChainTokenInAmount=auto` +
    `&dstChainId=100000013` +
    `&dstChainTokenOut=0x0000000000000000000000000000000000000000` +
    `&dstChainTokenOutAmount=${params.paymentAmount}` +
    `&dstChainTokenOutRecipient=${DEBRIDGE_MULTICALL}` +
    `&senderAddress=${params.senderAddress}` +
    `&srcChainOrderAuthorityAddress=${params.senderAddress}` +
    `&dstChainOrderAuthorityAddress=${params.senderAddress}` +
    `&enableEstimate=true` +
    `&prependOperatingExpenses=true` +
    `&dlnHook=${encodedHook}`;

  return url;
};

// Execute deBridge API call to get transaction data
export const getDeBridgeTransactionData = async (
  params: RoyaltyPaymentParams
): Promise<DeBridgeApiResponse> => {
  try {
    const apiUrl = buildDeBridgeApiUrl(params);
    console.log("deBridge API Request:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `deBridge API error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as DeBridgeApiResponse;
    console.log("deBridge API Response:", data);

    // Validate the response
    if (!data.tx || !data.estimation || !data.orderId) {
      throw new Error("Invalid deBridge API response: missing required fields");
    }

    // Check if the hook is properly integrated
    // if (!data.tx.data.includes("d2577f3b")) {
    //   // payRoyaltyOnBehalf selector
    //   throw new Error(
    //     "Royalty payment hook not properly integrated in transaction"
    //   );
    // }

    return data;
  } catch (error) {
    console.error("Error calling deBridge API:", error);
    throw error;
  }
};

// Execute cross-chain royalty payment using user's wallet
export const executeRoyaltyPayment = async (
  walletClient: WalletClient,
  params: RoyaltyPaymentParams
): Promise<string> => {
  try {
    // Get transaction data from deBridge
    const deBridgeResponse = await getDeBridgeTransactionData(params);

    // Execute the transaction using the user's wallet
    const txHash = await walletClient.sendTransaction({
      to: deBridgeResponse.tx.to as `0x${string}`,
      data: deBridgeResponse.tx.data as `0x${string}`,
      value: BigInt(deBridgeResponse.tx.value),
      account: walletClient.account as Account,
      chain: base,
    });

    console.log("Cross-chain royalty payment transaction sent:", txHash);
    return txHash;
  } catch (error) {
    console.error("Error executing royalty payment:", error);
    throw error;
  }
};
