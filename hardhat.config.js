require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const BASE_MAINNET_RPC_URL = process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org";
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "https://base-sepolia.g.alchemy.com/v2/anlAQwNBJhhdGsOc1-M2izDa9-8-MJ2h";
const BASE_GOERLI_RPC_URL = process.env.BASE_GOERLI_RPC_URL || "https://goerli.base.org";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const ALCHEMY_API_KEY = "anlAQwNBJhhdGsOc1-M2izDa9-8-MJ2h";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      chainId: 31337
    },
    base: {
      url: BASE_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 8453,
      gasPrice: 1000000000, // 1 gwei
    },
    "base-sepolia": {
      url: BASE_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 84532,
      gasPrice: 1000000000, // 1 gwei
    },
    "base-goerli": {
      url: BASE_GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 84531,
      gasPrice: 1000000000, // 1 gwei
    }
  },
  etherscan: {
    apiKey: {
      base: ETHERSCAN_API_KEY,
      "base-sepolia": ETHERSCAN_API_KEY,
      "base-goerli": ETHERSCAN_API_KEY
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "base-goerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
