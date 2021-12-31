pragma solidity 0.6.0;
import './Level_3_Global_Functions.sol';

contract Level_3_Global_Functions_Answer {
    Level_3_Global_Functions public gfContract;

    constructor(address _gfContractAddress) public {
        gfContract = Level_3_Global_Functions(_gfContractAddress);
    }

    // Once this function is called, you need to wait 256 blocks before calling levelComplete()
    function guess() public {
        gfContract.guessTheFutureHash('');
    }

    function levelComplete() public {
        gfContract.completeLevel();
    }

}