// Minimal test deployment script
// To use: npx hardhat run scripts/deploy-test.js --network base-sepolia

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying test contract with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get contract factory
  const TestContract = await ethers.getContractFactory("TestContract");

  console.log("Deploying test contract to Base Sepolia...");

  // Deploy with even lower gas price
  const testContract = await TestContract.deploy("Hello, Base Sepolia!", {
    gasLimit: 500000,  // Further reduced gas limit
    gasPrice: ethers.parseUnits("0.03", "gwei")  // Further reduced gas price
  });

  await testContract.waitForDeployment();

  const contractAddress = await testContract.getAddress();
  console.log("TestContract deployed to:", contractAddress);

  console.log("\nDeployment to Base Sepolia complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
