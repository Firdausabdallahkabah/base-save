// Deployment script for BaseSave contracts
// To use: npx hardhat run scripts/deploy.js --network base

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get contract factories
  const GoalNFT = await ethers.getContractFactory("GoalNFT");
  const GoalTracker = await ethers.getContractFactory("GoalTracker");

  // Deploy GoalNFT first
  // Base image URI should point to your NFT images (e.g., IPFS gateway or your own API)
  const baseImageURI = "https://basesave.app/api/nft/";
  const goalNFT = await GoalNFT.deploy(baseImageURI);
  await goalNFT.waitForDeployment();
  
  const goalNFTAddress = await goalNFT.getAddress();
  console.log("GoalNFT deployed to:", goalNFTAddress);

  // Deploy GoalTracker
  // Fee collector should be a secure wallet controlled by the team
  const feeCollector = deployer.address; // Change this to your fee collection address
  const goalTracker = await GoalTracker.deploy(feeCollector, goalNFTAddress);
  await goalTracker.waitForDeployment();
  
  const goalTrackerAddress = await goalTracker.getAddress();
  console.log("GoalTracker deployed to:", goalTrackerAddress);

  // Set GoalTracker in GoalNFT
  const setGoalTrackerTx = await goalNFT.setGoalTracker(goalTrackerAddress);
  await setGoalTrackerTx.wait();
  console.log("GoalTracker address set in GoalNFT");

  console.log("Deployment complete!");
  console.log({
    GoalNFT: goalNFTAddress,
    GoalTracker: goalTrackerAddress,
    FeeCollector: feeCollector
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
