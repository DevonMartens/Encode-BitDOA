// SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;

contract VolcanoCoin {
    
    struct Payment {
        uint256 amount;
        address to;
    }
    
    uint256 private _totalSupply;
    address owner;
    mapping(address => uint256) private _balances;
    mapping(address => Payment[]) private _payments;
    
    event TotalSupplyIncreased(uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    constructor() {
        _totalSupply = 10000;
        owner = msg.sender;
        _balances[owner] = _totalSupply;
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
    
    function getBalance(address addr) public view returns (uint256) {
        return _balances[addr];
    }
    
    function getPayments(address addr) public view returns (Payment[] memory) {
        return _payments[addr];
    }
    
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal {
        // check the sender's balance to ensure they have enough to cover the amount being transferred
        uint256 senderBalance = _balances[sender];
        
        require(senderBalance >= amount, "VolcanoCoin: transfer amount exceeds balance");
        
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;
        
        _payments[sender].push(Payment(amount, recipient));
        
        emit Transfer(sender, recipient, amount);
    }
    
}