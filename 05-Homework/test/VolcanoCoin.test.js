const { expect } = require("chai");

describe("VolcanoCoin", () => {

    it("should return it's symbol", async () => {
        const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
        const volcanoCoin = await VolcanoCoin.deploy();

        await volcanoCoin.deployed();
        
        expect(await volcanoCoin.symbol()).to.equal("VLC");
    });

    it("should return it's name", async () => {
        const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
        const volcanoCoin = await VolcanoCoin.deploy();

        await volcanoCoin.deployed();
        
        expect(await volcanoCoin.name()).to.equal("Volcano Coin");
    });
});