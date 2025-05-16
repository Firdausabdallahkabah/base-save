// Minimal NFT deployment script
// To use: npx hardhat run scripts/deploy-minimal-nft.js --network base-sepolia

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying minimal NFT with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get contract factory
  const MinimalGoalNFT = await ethers.getContractFactory("MinimalGoalNFT");

  console.log("Deploying minimal NFT to Base Sepolia...");

  // Deploy with minimal gas settings
  const minimalNFT = await MinimalGoalNFT.deploy({
    gasLimit: 500000,
    gasPrice: ethers.parseUnits("0.02", "gwei")
  });
  
  await minimalNFT.waitForDeployment();
  
  const contractAddress = await minimalNFT.getAddress();
  console.log("MinimalGoalNFT deployed to:", contractAddress);

  console.log("\nDeployment to Base Sepolia complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
