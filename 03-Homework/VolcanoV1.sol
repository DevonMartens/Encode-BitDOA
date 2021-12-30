// SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;

contract VolcanoCoin {
    
    uint256 private _totalSupply;
    address owner;
    
    event TotalSupplyIncreased(uint256);
    
    constructor() {
        _totalSupply = 10000;
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        if (msg.sender == owner) {
            _;
        }
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    function mint() public onlyOwner {
        _totalSupply += 1000;
        
        emit TotalSupplyIncreased(_totalSupply);
    }
    
}