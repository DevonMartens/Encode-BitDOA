require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("@nomiclabs/hardhat-etherscan");

let secret = require("./secret")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    rinkeby: {
      url: secret.url,
      accounts: [secret.key]
    }
  },
  etherscan: {
    apiKey: ""
  }
};
