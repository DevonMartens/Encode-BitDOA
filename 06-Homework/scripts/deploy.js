
const hre = require("hardhat");

async function main() {

    const VolcanoToken = await hre.ethers.getContractFactory("VolcanoToken");
    const volcanoToken = await VolcanoToken.deploy();

    await volcanoToken.deployed();
  
    console.log("Volcano Token deployed to:", volcanoToken.address);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
  });
  