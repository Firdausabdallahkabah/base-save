// Deployment script for BaseSave contracts on local Hardhat network
// To use: npx hardhat run scripts/deploy-local.js --network localhost

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get contract factories
  const GoalNFT = await ethers.getContractFactory("GoalNFT");
  const GoalTracker = await ethers.getContractFactory("GoalTracker");

  console.log("Deploying contracts to local network...");

  // Deploy GoalNFT first
  const baseImageURI = "https://basesave.app/api/nft/";
  console.log("Deploying GoalNFT...");
  const goalNFT = await GoalNFT.deploy(baseImageURI);
  await goalNFT.waitForDeployment();
  
  const goalNFTAddress = await goalNFT.getAddress();
  console.log("GoalNFT deployed to:", goalNFTAddress);

  // Deploy GoalTracker
  const feeCollector = deployer.address;
  console.log("Deploying GoalTracker...");
  const goalTracker = await GoalTracker.deploy(feeCollector, goalNFTAddress);
  await goalTracker.waitForDeployment();
  
  const goalTrackerAddress = await goalTracker.getAddress();
  console.log("GoalTracker deployed to:", goalTrackerAddress);

  // Set GoalTracker in GoalNFT
  console.log("Setting GoalTracker in GoalNFT...");
  const setGoalTrackerTx = await goalNFT.setGoalTracker(goalTrackerAddress);
  await setGoalTrackerTx.wait();
  console.log("GoalTracker address set in GoalNFT");

  console.log("\nDeployment to local network complete!");
  console.log({
    Network: "Local Hardhat Network",
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
