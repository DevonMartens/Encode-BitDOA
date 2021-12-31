const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

describe("VolcanoCoin", () => {
    let volcanoContract;

    beforeEach(async () => {
        const Volcano = await ethers.getContractFactory("VolcanoCoin");
        volcanoContract = await Volcano.deploy();
        await volcanoContract.deployed();

        [owner, addr1, addr2, addr3] = await ethers.getSigners();
    });

    it("should return it's symbol", async () => {
        expect(await volcanoContract.symbol()).to.equal("VLC");
    });

    it("should return it's name", async () => {
        expect(await volcanoContract.name()).to.equal("Volcano Coin");
    });

    it("should return initial total supply of 10000", async () => {
        expect(await volcanoContract.totalSupply()).to.equal(10000);
    });

    it("should return total supply of 20000 after adding 10000", async () => {
        let tx = await volcanoContract.addToTotalSupply(10000);
        await tx.wait();

        expect(await volcanoContract.totalSupply()).to.equal(20000);
    });

    it("updates balances on successful transfer from owner to addr1", async () => {
        let transferAmt = 100;
        // let ownerInitialBalance = await volcanoContract.balanceOf(owner.address);
        // let addr1InitialBalance = await volcanoContract.balanceOf(addr1.address);

        // let tx = await volcanoContract.transfer(addr1.address, transferAmt);
        // await tx.wait();

        // let ownerBalance = await volcanoContract.balanceOf(owner.address);
        // let addr1Balance = await volcanoContract.balanceOf(addr1.address);

        // expect(ownerInitialBalance - ownerBalance).to.equal(transferAmt);
        // expect(addr1Balance - addr1InitialBalance).to.equal(transferAmt);

        await expect(() => volcanoContract.transfer(addr1.address, transferAmt))
            .to.changeTokenBalances(volcanoContract, [owner, addr1], [-transferAmt, transferAmt]);
    });

    it("payment id of owner's first transfer should be 1", async () => {
        let transferAmt = 100;

        // Make a transfer from the owner account
        let tx = await volcanoContract.transfer(addr1.address, transferAmt);
        await tx.wait();

        // View the payments for the owner account
        let paymentsTx = await volcanoContract.viewPayments();

        expect(paymentsTx[0][0].toNumber()).to.equal(1);
    });
});