// Deployment script for BaseSave contracts on Base Sepolia
// To use: npx hardhat run scripts/deploy-with-address.js --network base-sepolia

async function main() {
  // Get all signers
  const signers = await ethers.getSigners();
  
  // Find the signer with the specified address
  const targetAddress = "0x251E1Ef97080Beea4e3a11479c82241F5694cD27";
  const deployer = signers.find(signer => signer.address.toLowerCase() === targetAddress.toLowerCase());
  
  if (!deployer) {
    console.error(`Signer with address ${targetAddress} not found in available accounts.`);
    console.log("Available accounts:");
    for (const signer of signers) {
      console.log(`- ${signer.address}`);
    }
    process.exit(1);
  }

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get contract factories
  const GoalNFT = await ethers.getContractFactory("GoalNFT", deployer);
  const GoalTracker = await ethers.getContractFactory("GoalTracker", deployer);

  console.log("Deploying contracts to Base Sepolia...");

  // Deploy GoalNFT first
  // Base image URI should point to your NFT images (e.g., IPFS gateway or your own API)
  const baseImageURI = "https://basesave.app/api/nft/";
  console.log("Deploying GoalNFT...");
  const goalNFT = await GoalNFT.deploy(baseImageURI);
  await goalNFT.waitForDeployment();
  
  const goalNFTAddress = await goalNFT.getAddress();
  console.log("GoalNFT deployed to:", goalNFTAddress);

  // Deploy GoalTracker
  // Fee collector should be a secure wallet controlled by the team
  const feeCollector = deployer.address; // Change this to your fee collection address
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

  console.log("\nDeployment to Base Sepolia complete!");
  console.log({
    Network: "Base Sepolia",
    GoalNFT: goalNFTAddress,
    GoalTracker: goalTrackerAddress,
    FeeCollector: feeCollector
  });
  
  console.log("\nVerify contracts with:");
  console.log(`npx hardhat verify --network base-sepolia ${goalNFTAddress} "${baseImageURI}"`);
  console.log(`npx hardhat verify --network base-sepolia ${goalTrackerAddress} ${feeCollector} ${goalNFTAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
