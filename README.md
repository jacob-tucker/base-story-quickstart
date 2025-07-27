# Story × Base Educational Quickstart

An educational demo application that showcases how to integrate cross-chain royalty payments between Base and Story Protocol using OnchainKit and the Story Protocol SDK.

## 🎯 What This Demo Shows

This application demonstrates:

- **NFT Minting on Base Sepolia** using OnchainKit's NFTMintCard
- **Cross-chain Royalty Payments** from Base to Story Protocol
- **Story Protocol IP Asset Integration** for automated royalty distribution
- **Educational UI** that explains each step of the process

## 🏗️ Architecture

```
User mints NFT on Base Sepolia
        ↓
OnchainKit handles the mint transaction
        ↓
App calculates royalty amount (5% of mint price)
        ↓
deBridge facilitates cross-chain payment
        ↓
Story Protocol IP Asset receives royalties
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Base Sepolia ETH** for minting
3. **OnchainKit API Key** from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
4. **Story Protocol IP Asset** (optional - demo uses example)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd base-story-quickstart
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Required: OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Optional: Custom NFT contract (uses demo contract if not provided)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_nft_contract_address_here

# Optional: Story IP Asset ID (uses demo if not provided)
NEXT_PUBLIC_STORY_IP_ASSET_ID=your_story_ip_asset_id_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) and connect your wallet!

## 📚 Learning Resources

### Story Protocol

- [Story Documentation](https://docs.story.foundation)
- [Cross-chain Royalty Payments Tutorial](https://docs.story.foundation/developers/tutorials/cross-chain-royalty-payments)
- [Story Testnet Explorer](https://testnet.storyscan.xyz)

### Base OnchainKit

- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [NFT Mint Card Guide](https://docs.base.org/onchainkit/mint/nft-mint-card)
- [Base Sepolia Explorer](https://sepolia.basescan.org)

## 🔧 Configuration

### Creating Your Own NFT Contract

1. Visit [Coinbase Wallet's Create Flow](https://wallet.coinbase.com/create)
2. Create your NFT collection on Base Sepolia
3. Copy the contract address to your `.env.local`

### Setting Up Story IP Assets

1. Visit the [Story Protocol Documentation](https://docs.story.foundation)
2. Follow the guide to create an IP Asset on Story testnet
3. Copy the IP Asset ID to your `.env.local`

## 🛠️ Technical Details

### Key Components

- **`StoryNFTDemo`** - Main demo component with NFT minting and cross-chain logic
- **`app/lib/story.ts`** - Story Protocol SDK utilities and cross-chain payment functions
- **`app/providers.tsx`** - OnchainKit provider configuration for Base Sepolia

### Cross-chain Flow

1. User mints NFT using OnchainKit's `NFTMintCardDefault`
2. On successful mint, app calculates 5% royalty
3. `payRoyaltyCrossChain` function initiates deBridge transaction
4. Funds are bridged from Base Sepolia to Story testnet
5. Story IP Asset receives automatic royalty payment

### Environment Variables

| Variable                           | Description                             | Required |
| ---------------------------------- | --------------------------------------- | -------- |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY`   | OnchainKit API key for Base integration | ✅       |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | NFT contract address on Base Sepolia    | ❌       |
| `NEXT_PUBLIC_STORY_IP_ASSET_ID`    | Story Protocol IP Asset ID              | ❌       |

## 🧪 Testing

1. **Connect Wallet** - Use any Base-compatible wallet
2. **Get Base Sepolia ETH** - Use the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
3. **Mint NFT** - Click the mint button in the demo
4. **Watch Cross-chain Payment** - Monitor the status indicators

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Node.js.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Story Protocol**: [Discord](https://discord.gg/story) | [Documentation](https://docs.story.foundation)
- **Base**: [Discord](https://discord.gg/base) | [Documentation](https://docs.base.org)
- **OnchainKit**: [GitHub Issues](https://github.com/coinbase/onchainkit/issues)

---

Built with ❤️ using [Story Protocol](https://story.foundation), [Base](https://base.org), and [OnchainKit](https://onchainkit.xyz)
