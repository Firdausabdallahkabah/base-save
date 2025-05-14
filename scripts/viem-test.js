// Script to test Viem connection to Base Sepolia
import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

// Load environment variables (in a real app, use dotenv)
const ALCHEMY_API_KEY = "anlAQwNBJhhdGsOc1-M2izDa9-8-MJ2h";
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""; // Add your private key here for testing

async function main() {
  try {
    // Create a public client for reading blockchain data
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    });

    console.log("Connected to Base Sepolia testnet");
    
    // Get the latest block
    const latestBlock = await publicClient.getBlockNumber();
    console.log(`Latest block number: ${latestBlock}`);
    
    // Get block details
    const block = await publicClient.getBlock({
      blockNumber: latestBlock,
    });
    
    console.log("Latest block details:");
    console.log(`- Hash: ${block.hash}`);
    console.log(`- Timestamp: ${new Date(Number(block.timestamp) * 1000).toLocaleString()}`);
    console.log(`- Gas used: ${block.gasUsed}`);
    console.log(`- Transactions: ${block.transactions.length}`);

    // If private key is available, create a wallet client for transactions
    if (PRIVATE_KEY) {
      const account = privateKeyToAccount(PRIVATE_KEY);
      
      const walletClient = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
      });
      
      console.log(`\nWallet address: ${account.address}`);
      
      // Get wallet balance
      const balance = await publicClient.getBalance({
        address: account.address,
      });
      
      console.log(`Wallet balance: ${balance} wei (${balance / 10n**18n} ETH)`);
    } else {
      console.log("\nNo private key provided. Skipping wallet operations.");
    }

    // Get gas price
    const gasPrice = await publicClient.getGasPrice();
    console.log(`\nCurrent gas price: ${gasPrice} wei (${Number(gasPrice) / 10**9} gwei)`);
    
    console.log("\nViem connection test completed successfully!");
  } catch (error) {
    console.error("Error connecting to Base Sepolia:", error);
  }
}

main();
