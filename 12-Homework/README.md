# Homework 12 Upgrading Contracts

### Steps

1. Take your existing Volcano coin contract and add a constant to hold a version number (set it to 1).

2. Write a unit test in hardhat or truffle to test the version number.

3. Make your contract upgradeable by inheriting from Open Zeppelin UUPSUpgradeable

4. Make the necessary changes to your contract
Replace a contructor with an initialize function
Ensure that all necessary initialisation is being done that function
Change any other contracts you inherit from to use the upgradeable version

5. Use the relevant plugin to deploy your contract.

6. Rerun the unit tests to ensure your contract still works.

7. Change the version number in your contract, and use the plugin to upgrade the contract. 8. Rerun the unit tests, and check that the version number has increased.

9. Write a unit test to test the upgrade process.

### See the guides here:

1. https://docs.openzeppelin.com/openzeppelin/upgrades (https://docs.openzeppelin.com/openzeppelin/upgrades) 

2. https://docs.openzeppelin.com/contracts/4.x/upgradeable (https://docs.openzeppelin.com/contracts/4.x/upgradeable) 

3. https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable (https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable) 

4. https://docs.openzeppelin.com/upgrades-plugins/1.x/ (https://docs.openzeppelin.com/upgrades- plugins/1.x/) 

5. https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786 (https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786)

6. In addition I found [this video](https://www.youtube.com/watch?v=bdXJmWajZRY) helpful.