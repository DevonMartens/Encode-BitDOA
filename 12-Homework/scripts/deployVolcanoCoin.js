const { ethers, upgrades, run } = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.

  await run('clean');
  await run('compile');

  // We get the contract to deploy
  const VolcanoCoinV1 = await ethers.getContractFactory("VolcanoCoinV1");
  const VolcanoCoinV2 = await ethers.getContractFactory("VolcanoCoinV2");

  const volcanoCoinV1 = await upgrades.deployProxy(VolcanoCoinV1);
  await volcanoCoinV1.deployed();
  console.log("VolcanoCoinV1 deployed to:", volcanoCoinV1.address);

  const volcanoCoinV2 = await upgrades.upgradeProxy(volcanoCoinV1.address, VolcanoCoinV2);
  await volcanoCoinV2.deployed();
  console.log("VolcanoCoinV2 deployed to:", volcanoCoinV2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
