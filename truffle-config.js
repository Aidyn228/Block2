// truffle-config.js
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "build/contracts"),

  networks: {
    // Local Ganache Network Configuration
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ganache CLI port (default: none)
      network_id: "*",       // Match any network id
    },

    // Uncomment if you want to deploy to a testnet like Rinkeby
    /*
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC, // Your wallet's mnemonic
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}` // Infura API Key
        );
      },
      network_id: 4,       // Rinkeby's network id
      gas: 4500000,        // Gas limit
      gasPrice: 10000000000, // 10 gwei
    },
    */

    // You can add other networks here like mainnet, ropsten, etc.
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,  // Enable optimization
          runs: 200       // Optimize for how many times you intend to run the code
        },
      }
    }
  }
};
