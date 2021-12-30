
const { ethers } = require("hardhat");

// const provider = new ethers.providers.getDefaultProvider("rinkeby");
const provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545");

async function basicProvider() {
  let blockNumber = await provider.getBlockNumber();
  console.log("block number", blockNumber);

  let balance = await provider.getBalance(
    ""
  );
  console.log(balance);
  balance = ethers.utils.formatEther(balance);
  console.log("balance in eth:", balance);

  let block = await provider.getBlock(blockNumber - 1);
  console.log(block);
}

let myWallet01 = new ethers.Wallet(
  "",
  provider
);

// myWallet01 = myWallet01.connect(provider);

async function sendingTx() {
  let myAddr = await myWallet01.getAddress();

  console.log("my addr:", myAddr);

  let txResponse = await myWallet01.sendTransaction({
    to: "",
    value: ethers.utils.parseEther("1"),
  });

  console.log("tx hash", txResponse.hash);

  let txReceipt = await txResponse.wait();
  console.log(txReceipt);
}

async function deployContract() {
  const volcanoContract = await ethers.getContractFactory(
    "VolcanoCoin",
    myWallet01
  );

  const contract = await volcanoContract.deploy(); // pass parameters to you constructor

  await contract.deployed();

  console.log("contract addr:", contract.address);
  let name = await contract.name();

  console.log("name:", name);
}

let myWallet02 = new ethers.Wallet(
  "",
  provider
);

async function connectToContract() {
  let contractAddr = "";

  const volcanoContract = await ethers.getContractAt(
    "VolcanoCoin",
    contractAddr,
    myWallet01
  );

  let name = await volcanoContract.name();
  console.log("name:", name);

  let ownerBalance = await volcanoContract.balanceOf(myWallet01.address);
  let otherUserBalance = await volcanoContract.balanceOf(myWallet02.address);
  console.log("owner balance:", ownerBalance.toString());
  console.log("other user balance:", otherUserBalance.toString());

  let txResponse = await volcanoContract.transfer(myWallet02.address, 10);
  await txResponse.wait();
  console.log(txResponse.from);

  ownerBalance = await volcanoContract.balanceOf(myWallet01.address);
  otherUserBalance = await volcanoContract.balanceOf(myWallet02.address);
  console.log("owner balance after transfer:", ownerBalance.toString());
  console.log(
    "other user balance after transfer:",
    otherUserBalance.toString()
  );

  let refundTx = await volcanoContract
    .connect(myWallet02)
    .transfer(myWallet01.address, 20);

  await refundTx.wait();

  ownerBalance = await volcanoContract.balanceOf(myWallet01.address);
  otherUserBalance = await volcanoContract.balanceOf(myWallet02.address);
  console.log("owner balance after refund:", ownerBalance.toString());
  console.log("other user balance after refund:", otherUserBalance.toString());
}

// basicProvider()
// sendingTx()
// deployContract()
connectToContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
