// Simplified deployment script for BaseSave contracts on Base Sepolia
// To use: npx hardhat run scripts/deploy-simple.js --network base-sepolia

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get contract factories for simplified contracts
  const SimpleGoalNFT = await ethers.getContractFactory("SimpleGoalNFT");
  const SimpleGoalTracker = await ethers.getContractFactory("SimpleGoalTracker");

  console.log("Deploying simplified contracts to Base Sepolia...");

  // Deploy SimpleGoalNFT first
  const baseImageURI = "https://basesave.app/api/nft/";
  console.log("Deploying SimpleGoalNFT...");
  const goalNFT = await SimpleGoalNFT.deploy(baseImageURI, {
    gasLimit: 500000,
    gasPrice: ethers.parseUnits("0.02", "gwei")  // Extremely low gas price
  });
  await goalNFT.waitForDeployment();

  const goalNFTAddress = await goalNFT.getAddress();
  console.log("SimpleGoalNFT deployed to:", goalNFTAddress);

  // Deploy SimpleGoalTracker
  const feeCollector = deployer.address;
  console.log("Deploying SimpleGoalTracker...");
  const goalTracker = await SimpleGoalTracker.deploy(feeCollector, goalNFTAddress, {
    gasLimit: 500000,
    gasPrice: ethers.parseUnits("0.02", "gwei")  // Extremely low gas price
  });
  await goalTracker.waitForDeployment();

  const goalTrackerAddress = await goalTracker.getAddress();
  console.log("SimpleGoalTracker deployed to:", goalTrackerAddress);

  // Set GoalTracker in GoalNFT
  console.log("Setting GoalTracker in SimpleGoalNFT...");
  const setGoalTrackerTx = await goalNFT.setGoalTracker(goalTrackerAddress, {
    gasLimit: 200000,
    gasPrice: ethers.parseUnits("0.02", "gwei")  // Extremely low gas price
  });
  await setGoalTrackerTx.wait();
  console.log("GoalTracker address set in SimpleGoalNFT");

  console.log("\nDeployment to Base Sepolia complete!");
  console.log({
    Network: "Base Sepolia",
    SimpleGoalNFT: goalNFTAddress,
    SimpleGoalTracker: goalTrackerAddress,
    FeeCollector: feeCollector
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
