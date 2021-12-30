const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const {
  constants, // Common constants, like the zero address and largest integers
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const { solidity } = require("ethereum-waffle");
use(solidity);

// https://www.chaijs.com/guide/styles/
// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
// https://docs.openzeppelin.com/test-helpers/0.5/

describe("Volcano Coin", () => {
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    const Volcano = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await Volcano.deploy();
    await volcanoContract.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("has a name", async () => {
    let contractName = await volcanoContract.name();
    expect(contractName).to.equal("Volcano Coin");
  });

  it("reverts when transferring tokens to the zero address", async () => {
    await expectRevert(
      volcanoContract.transfer(constants.ZERO_ADDRESS, 10),
      "ERC20: transfer to the zero address"
    );
  });

  //homework
  it("has a symbol", async () => {
    let contractSymbol = await volcanoContract.symbol();
    expect(contractSymbol).to.equal("VLC");
  });

  it("has 18 decimals", async () => {
    let contractDecimals = await volcanoContract.decimals();
    expect(contractDecimals).to.equal(18);
  });

  it("assigns initial balance", async () => {
    let contractTotalSupply = await volcanoContract.totalSupply();
    expect(contractTotalSupply).to.equal(100000);
  });

  it("increases allowance for address1", async () => {
    let increaseAmt = 10;
    let allowanceBefore = await volcanoContract.allowance(owner.address, addr1.address);    
    let tx = await volcanoContract.increaseAllowance(addr1.address, increaseAmt);
    await tx.wait();
    let allowanceAfter = await volcanoContract.allowance(owner.address, addr1.address);    
    expect(allowanceAfter - allowanceBefore).to.be.equal(increaseAmt);
  });

  it("decreases allowance for address1", async () => {
    let increaseAmt = 10;
    let increaseTx = await volcanoContract.increaseAllowance(addr1.address, increaseAmt);
    await increaseTx.wait();
    let allowanceBefore = await volcanoContract.allowance(owner.address, addr1.address);

    let decreaseAmt = 3;
    let decreaseTx = await volcanoContract.decreaseAllowance(addr1.address, decreaseAmt);
    await decreaseTx.wait();
    let allowanceAfter = await volcanoContract.allowance(owner.address, addr1.address);

    expect(allowanceBefore - allowanceAfter).to.be.equal(decreaseAmt);
  });

  it("emits an event when increasing allowance", async () => {
    let tx = volcanoContract.increaseAllowance(addr1.address, 10);
    expect(tx).to.emit(volcanoContract, "Approval");
  });

  it("reverts decreaseAllowance when trying decrease below 0", async () => {
    expectRevert(volcanoContract.connect(addr1).decreaseAllowance(addr2.address, 10), "ERC20: decreased allowance below zero");
  });

  it("updates balances on successful transfer from owner to addr1", async () => {
    let transferAmt = 100;
    let ownerInitialBalance = await volcanoContract.balanceOf(owner.address);
    let addr1InitialBalance = await volcanoContract.balanceOf(addr1.address);

    let tx = await volcanoContract.transfer(addr1.address, transferAmt);
    await tx.wait();

    let ownerBalance = await volcanoContract.balanceOf(owner.address);
    let addr1Balance = await volcanoContract.balanceOf(addr1.address);

    expect(ownerInitialBalance - ownerBalance).to.equal(transferAmt);
    expect(addr1Balance - addr1InitialBalance).to.equal(transferAmt);
  });

  it("reverts transfer when sender does not have enough balance", async () => {
    await expect(volcanoContract.connect(addr1).transfer(addr2.address, 100)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("reverts transferFrom addr1 to addr2 called by the owner without setting allowance", async () => {
    let transferAmt = 100;
    let tx = await volcanoContract.transfer(addr1.address, transferAmt);
    await tx.wait();
    await expect(volcanoContract.transferFrom(addr1.address, addr2.address, transferAmt)).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
  });

  it("updates balances after transferFrom addr1 to addr2 called by the owner", async () => {
    let transferAmt = 100;
    let tx = await volcanoContract.transfer(addr1.address, transferAmt);
    await tx.wait();

    let txAllowance = await volcanoContract.connect(addr1).increaseAllowance(owner.address, transferAmt);
    await txAllowance.wait();

    let addr1InitialBalance = await volcanoContract.balanceOf(addr1.address);
    let addr2InitialBalance = await volcanoContract.balanceOf(addr2.address);

    let txTransferFrom = await volcanoContract.transferFrom(addr1.address, addr2.address, transferAmt);
    await txTransferFrom.wait();

    let addr1Balance = await volcanoContract.balanceOf(addr1.address);
    let addr2Balance = await volcanoContract.balanceOf(addr2.address);

    expect(addr1InitialBalance - addr1Balance).to.be.equal(transferAmt);
    expect(addr2Balance - addr2InitialBalance).to.be.equal(transferAmt);
  });
});
