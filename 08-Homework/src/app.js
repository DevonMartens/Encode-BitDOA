const express = require('express');
const path = require('path');
var ethers = require('ethers');
const url = "http://127.0.0.1:8545";

const provider = new ethers.providers.JsonRpcProvider(url);

const app = express();

// test the ethereum network connection 
provider.getBlockNumber().then((result) => { console.log("Current block number: " + result); });

const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath, { extensions: ['html'] }));
app.use(express.json());

app.get('', (req, res) => {
  res.sendFile(publicDirPath + "/index.html");
});

app.listen(3000, () => {
  console.log('Server is up and running on http://127.0.0.1:3000');
});

app.post('/mintNft', (req, res) => {
    console.log('mintNft post');
  
    //mint the NFT

});
