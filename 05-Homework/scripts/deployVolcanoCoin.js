const hre = require("hardhat");

async function main() {

    const VolcanoCoin = await hre.ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();

    await volcanoCoin.deployed();
  
    console.log("Volcano Coin deployed to:", volcanoCoin.address);
  }
  

  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
  });
  