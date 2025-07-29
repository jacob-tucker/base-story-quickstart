# Cross-Chain Music Licensing Demo

A Next.js application demonstrating cross-chain music licensing using Base and Story. Users can purchase commercial music licenses by paying with ETH on Base, which gets automatically bridged to Story to mint the license NFT.

## Features

- **Cross-Chain Payments**: Pay with ETH on Base, receive license on Story
- **deBridge Integration**: Automatic cross-chain bridging from Base to Story
- **Story Integration**: IP asset licensing
- **Real-Time Cost estimation**: Dynamic pricing based on current bridge rates

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Base-compatible wallet (e.g., Coinbase Wallet, MetaMask)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jacob-tucker/base-story-quickstart
cd base-story-quickstart
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
```

### Getting Your OnchainKit API Key

To get your `NEXT_PUBLIC_ONCHAINKIT_API_KEY`:

1. Visit the [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
2. Sign in with your Coinbase account or create one
3. Create a new project or select an existing one
4. Navigate to the "API Keys" section
5. Generate a new Client API key for OnchainKit
6. Copy the Client API key and paste it into your `.env` file

The OnchainKit API key is required for wallet functionality and Base network interactions.

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the application for production:

```bash
npm run build
```

## How It Works

1. **Connect Base Wallet**: Users connect their wallet to Base mainnet
2. **Cross-Chain Bridge**: deBridge automatically converts ETH to WIP tokens on Story
3. **License Minted**: Commercial license NFT is minted on Story

## Key Components

- `MusicPlayer.tsx` - Audio player with IP asset details
- `LicensePurchase.tsx` - Cross-chain payment interface
- `HowItWorks.tsx` - Process explanation component
- `ExampleSuccess.tsx` - Real transaction example

## Important Notes

⚠️ **Mainnet Warning**: This demo uses real mainnet transactions because deBridge does not work on testnet. Only use wallets you don't care about for testing.

## Example Success

Here's an example of a successful cross-chain license purchase:

- **Base Payment**: [0x8532e90ee6...627eb76a](https://basescan.org/tx/0x8532e90ee671268f578202850a1709a8d512f71b1a81bf3eb4929d6a627eb76a)
- **Story License**: [0x5a41060e17...b270fda](https://www.storyscan.io/tx/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda)
- **License Token**: [#36896](https://explorer.story.foundation/transactions/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda)

## License Terms

The demo showcases licensing with these parameters:

- Commercial Use: ✓ Allowed
- Derivatives: ✓ Allowed
- AI Training: ✗ Not allowed
- Attribution: ✓ Required
- Transferrable: ✓ Yes
- Expiration: Never
- Revenue Share: 0%

## Environment Variables

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - Required for OnchainKit wallet functionality

## Troubleshooting

- Ensure you're connected to Base mainnet
- Make sure you have sufficient ETH for gas + license cost
- Check that your Story address is valid (0x format)
- Transaction times may vary based on cross-chain bridge congestion

## Example deBridge API Call Return

```json
{
  "estimation": {
    "srcChainTokenIn": {
      "address": "0x0000000000000000000000000000000000000000",
      "chainId": 8453,
      "decimals": 18,
      "name": "Ethereum",
      "symbol": "ETH",
      "amount": "3455046679173",
      "approximateOperatingExpense": "3439812023003",
      "mutatedWithOperatingExpense": true,
      "approximateUsdValue": 0.0131191210041439,
      "originApproximateUsdValue": 0.000057847350936108
    },
    "srcChainTokenOut": {
      "address": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      "chainId": 8453,
      "decimals": 6,
      "name": "USD Coin",
      "symbol": "USDC",
      "amount": "13048",
      "maxRefundAmount": "65",
      "approximateUsdValue": 0.013048
    },
    "dstChainTokenOut": {
      "address": "0x0000000000000000000000000000000000000000",
      "chainId": 100000013,
      "decimals": 18,
      "name": "IP",
      "symbol": "IP",
      "amount": "10000000000000",
      "recommendedAmount": "26126146629563",
      "maxTheoreticalAmount": "26336443127938",
      "approximateUsdValue": 0.00005645164,
      "recommendedApproximateUsdValue": 0.00014748638241193,
      "maxTheoreticalApproximateUsdValue": 0.000148673540633883
    }
  },
  "tx": {
    "value": "1003455046679173",
    "data": "0x4d8160ba...",
    "to": "0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251",
    "gasLimit": 541684
  },
  "orderId": "0x5bb128e741ec725bb86c2a7517994d901cb68e07bdb9faa6d4a4af9a72ecd638"
}
```
