// Script to interact with deployed BaseSave contracts on Base Sepolia
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { abi as GoalTrackerABI } from "../artifacts/contracts/GoalTracker.sol/GoalTracker.json";
import { abi as GoalNFTABI } from "../artifacts/contracts/GoalNFT.sol/GoalNFT.json";

// Configuration
const ALCHEMY_API_KEY = "anlAQwNBJhhdGsOc1-M2izDa9-8-MJ2h";
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""; // Add your private key here for testing

// Contract addresses (update these after deployment)
const GOAL_TRACKER_ADDRESS = ""; // Update after deployment
const GOAL_NFT_ADDRESS = ""; // Update after deployment

async function main() {
  if (!PRIVATE_KEY) {
    console.error("Private key is required. Please set the PRIVATE_KEY environment variable.");
    process.exit(1);
  }

  if (!GOAL_TRACKER_ADDRESS || !GOAL_NFT_ADDRESS) {
    console.error("Contract addresses are required. Please update the script with your deployed contract addresses.");
    process.exit(1);
  }

  try {
    // Create account from private key
    const account = privateKeyToAccount(PRIVATE_KEY);
    console.log(`Using account: ${account.address}`);

    // Create public client for reading blockchain data
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    });

    // Create wallet client for writing transactions
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    });

    // Get account balance
    const balance = await publicClient.getBalance({ address: account.address });
    console.log(`Account balance: ${formatEther(balance)} ETH`);

    // Interact with GoalTracker contract
    console.log("\n--- GoalTracker Contract Interaction ---");
    
    // 1. Create a new goal
    console.log("Creating a new savings goal...");
    
    const title = "New Laptop";
    const description = "Saving for a MacBook Pro";
    const tokenAddress = "0x0000000000000000000000000000000000000000"; // ETH
    const targetAmount = parseEther("0.1"); // 0.1 ETH
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60); // 30 days from now
    const isPublic = true;
    
    // Prepare transaction
    const { request } = await publicClient.simulateContract({
      address: GOAL_TRACKER_ADDRESS,
      abi: GoalTrackerABI,
      functionName: "createGoal",
      args: [title, description, tokenAddress, targetAmount, deadline, isPublic],
      account,
    });
    
    // Send transaction
    const hash = await walletClient.writeContract(request);
    console.log(`Transaction sent! Hash: ${hash}`);
    
    // Wait for transaction to be mined
    console.log("Waiting for transaction confirmation...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Parse logs to get the goal ID
    const goalCreatedLog = receipt.logs.find(log => {
      try {
        const event = publicClient.decodeEventLog({
          abi: GoalTrackerABI,
          data: log.data,
          topics: log.topics,
        });
        return event.eventName === "GoalCreated";
      } catch (e) {
        return false;
      }
    });
    
    if (!goalCreatedLog) {
      console.log("Could not find GoalCreated event in logs");
      return;
    }
    
    const goalCreatedEvent = publicClient.decodeEventLog({
      abi: GoalTrackerABI,
      data: goalCreatedLog.data,
      topics: goalCreatedLog.topics,
    });
    
    const goalId = goalCreatedEvent.args.goalId;
    console.log(`Goal created with ID: ${goalId}`);
    
    // 2. Get goal details
    console.log("\nFetching goal details...");
    const goalDetails = await publicClient.readContract({
      address: GOAL_TRACKER_ADDRESS,
      abi: GoalTrackerABI,
      functionName: "getGoalDetails",
      args: [goalId],
    });
    
    console.log("Goal Details:");
    console.log(`- Title: ${goalDetails.title}`);
    console.log(`- Description: ${goalDetails.description}`);
    console.log(`- Target Amount: ${formatEther(goalDetails.targetAmount)} ETH`);
    console.log(`- Current Amount: ${formatEther(goalDetails.currentAmount)} ETH`);
    console.log(`- Deadline: ${new Date(Number(goalDetails.deadline) * 1000).toLocaleString()}`);
    console.log(`- Status: ${["Active", "Completed", "Expired", "Withdrawn"][goalDetails.status]}`);
    
    // 3. Deposit funds to the goal
    console.log("\nDepositing funds to the goal...");
    const depositAmount = parseEther("0.01"); // 0.01 ETH
    
    const { request: depositRequest } = await publicClient.simulateContract({
      address: GOAL_TRACKER_ADDRESS,
      abi: GoalTrackerABI,
      functionName: "deposit",
      args: [goalId, depositAmount],
      account,
      value: depositAmount,
    });
    
    const depositHash = await walletClient.writeContract(depositRequest);
    console.log(`Deposit transaction sent! Hash: ${depositHash}`);
    
    // Wait for transaction to be mined
    console.log("Waiting for deposit confirmation...");
    const depositReceipt = await publicClient.waitForTransactionReceipt({ hash: depositHash });
    console.log(`Deposit confirmed in block ${depositReceipt.blockNumber}`);
    
    // 4. Get updated goal details
    console.log("\nFetching updated goal details...");
    const updatedGoalDetails = await publicClient.readContract({
      address: GOAL_TRACKER_ADDRESS,
      abi: GoalTrackerABI,
      functionName: "getGoalDetails",
      args: [goalId],
    });
    
    console.log("Updated Goal Details:");
    console.log(`- Current Amount: ${formatEther(updatedGoalDetails.currentAmount)} ETH`);
    console.log(`- Status: ${["Active", "Completed", "Expired", "Withdrawn"][updatedGoalDetails.status]}`);
    
    // 5. Check if user has any NFT rewards
    console.log("\n--- GoalNFT Contract Interaction ---");
    console.log("Checking for NFT rewards...");
    
    const nftBalance = await publicClient.readContract({
      address: GOAL_NFT_ADDRESS,
      abi: GoalNFTABI,
      functionName: "balanceOf",
      args: [account.address],
    });
    
    console.log(`NFT balance: ${nftBalance}`);
    
    if (nftBalance > 0n) {
      console.log("Fetching NFT details...");
      
      const tokenIds = await publicClient.readContract({
        address: GOAL_NFT_ADDRESS,
        abi: GoalNFTABI,
        functionName: "getTokensByOwner",
        args: [account.address],
      });
      
      console.log(`Token IDs: ${tokenIds}`);
      
      for (const tokenId of tokenIds) {
        const tokenURI = await publicClient.readContract({
          address: GOAL_NFT_ADDRESS,
          abi: GoalNFTABI,
          functionName: "tokenURI",
          args: [tokenId],
        });
        
        console.log(`Token ${tokenId} URI: ${tokenURI}`);
        
        // If it's a data URI, decode and display metadata
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Data = tokenURI.replace("data:application/json;base64,", "");
          const decodedData = Buffer.from(base64Data, "base64").toString("utf-8");
          console.log("Token Metadata:", JSON.parse(decodedData));
        }
      }
    }
    
    console.log("\nContract interaction complete!");
    
  } catch (error) {
    console.error("Error interacting with contracts:", error);
  }
}

main();
