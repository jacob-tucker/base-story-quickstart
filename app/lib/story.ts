import { Account, encodeFunctionData, parseEther, WalletClient } from "viem";
import { base } from "viem/chains";

// Story Protocol constants
export const LICENSING_MODULE_ADDRESS =
  "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f"; // Story license module
export const WIP_TOKEN_ADDRESS = "0x1514000000000000000000000000000000000000"; // WIP token on Story

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
        name: "mintLicenseTokens",
        type: "function",
        inputs: [
          { name: "licensorIpId", type: "address" },
          { name: "licenseTemplate", type: "address" },
          { name: "licenseTermsId", type: "uint256" },
          { name: "amount", type: "uint256" },
          { name: "receiver", type: "address" },
          { name: "royaltyContext", type: "bytes" },
          { name: "maxMintingFee", type: "uint256" },
          { name: "maxRevenueShare", type: "uint32" },
        ],
      },
    ],
    functionName: "mintLicenseTokens",
    args: [
      params.ipAssetId as `0x${string}`,
      "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
      BigInt(params.licenseTermsId),
      BigInt(1),
      params.receiverAddress as `0x${string}`,
      "0x0000000000000000000000000000000000000000",
      BigInt(0),
      BigInt(100_000_000),
    ],
  });

  // Build the dlnHook JSON
  const dlnHook = {
    type: "evm_transaction_call",
    data: {
      to: LICENSING_MODULE_ADDRESS,
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
    `&dstChainTokenOut=${WIP_TOKEN_ADDRESS}` +
    `&dstChainTokenOutAmount=${params.paymentAmount}` +
    `&dstChainTokenOutRecipient=${params.receiverAddress}` +
    `&senderAddress=${params.senderAddress}` +
    `&srcChainOrderAuthorityAddress=${params.senderAddress}` +
    `&dstChainOrderAuthorityAddress=${params.receiverAddress}` +
    `&enableEstimate=true` +
    `&prependOperatingExpenses=true` +
    `&dlnHook=${dlnHook}`;

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
    if (!data.tx.data.includes("d2577f3b")) {
      // payRoyaltyOnBehalf selector
      throw new Error(
        "Royalty payment hook not properly integrated in transaction"
      );
    }

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
