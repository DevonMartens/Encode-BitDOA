const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let USDC_TokenContract;
  let DeFi_Instance;
  const INITIAL_AMOUNT = "1000";

  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    // this account needs to be unlocked when the chain is forked
    // npx ganache-cli -f https://mainnet.infura.io/v3/4f8de5d8454f48a09597004ddf33555a --unlock 0x503828976D22510aad0201ac7EC88293211D23Da -p 8545
    const whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );
    console.log("owner account is ", owner.address);
    
    // Get contract instances of DAI and USDC
    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);
    const symbol = await DAI_TokenContract.symbol();

    // Get an instance of our DeFi contract
    const DeFi = await ethers.getContractFactory("DeFi");

    // Transfer DAI from the whale to the owner address
    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      ethers.utils.parseUnits(INITIAL_AMOUNT)
    );

    DeFi_Instance = await DeFi.deploy();
    await DeFi_Instance.deployed();

    console.log("DeFi_Instance: ", DeFi_Instance.address);
  });

  it("should check transfer succeeded", async () => {
    let ownerDaiBalance = await DAI_TokenContract.balanceOf(owner.address);
    console.log("Owner DAI Balance: ", ethers.utils.formatUnits(ownerDaiBalance));

    expect(ownerDaiBalance).to.be.gte(ethers.utils.parseUnits(INITIAL_AMOUNT));
  });

  it("should send DAI to contract", async () => {
    // Transfer DAI from the Owner address to our DeFi contract address
    await DAI_TokenContract.transfer(
      DeFi_Instance.address,
      ethers.utils.parseUnits(INITIAL_AMOUNT)
    );

    let defiDaiBalance = await DAI_TokenContract.balanceOf(DeFi_Instance.address);
    let ownerDaiBalance = await DAI_TokenContract.balanceOf(owner.address);

    console.log("DeFi Contract DAI Balance", ethers.utils.formatEther(defiDaiBalance));
    console.log("Owner DAI Balance", ethers.utils.formatEther(ownerDaiBalance));

    expect(defiDaiBalance).to.be.gte(ethers.utils.parseUnits(INITIAL_AMOUNT));
  });

  it("should make a swap", async () => {
    // DeFi Contract swaps the DAI to USDC and sends it back to the Owner address
    let tx = await DeFi_Instance.swapDAItoUSDC(ethers.utils.parseUnits(INITIAL_AMOUNT));
    await tx.wait();

    let defiDaiBalance = await DAI_TokenContract.balanceOf(DeFi_Instance.address);
    console.log("DeFi Contract DAI Balance", ethers.utils.formatEther(defiDaiBalance));
    
    let usdcBalance = await USDC_TokenContract.balanceOf(owner.address);
    console.log("Owner USDC balance: ", ethers.utils.formatUnits(usdcBalance, 6));

    expect(usdcBalance).to.be.gt(ethers.utils.parseUnits("1", 6));
  });
});
