// Absolutely minimal deployment script
// To use: npx hardhat run scripts/deploy-minimal.js --network base-sepolia

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying minimal contract with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get contract factory
  const MinimalContract = await ethers.getContractFactory("MinimalContract");

  console.log("Deploying minimal contract to Base Sepolia...");

  // Deploy with absolute minimum gas settings
  const minimalContract = await MinimalContract.deploy({
    gasLimit: 200000,  // Absolute minimum gas limit
    gasPrice: ethers.parseUnits("0.02", "gwei")  // Extremely low gas price
  });
  
  await minimalContract.waitForDeployment();
  
  const contractAddress = await minimalContract.getAddress();
  console.log("MinimalContract deployed to:", contractAddress);

  console.log("\nDeployment to Base Sepolia complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
