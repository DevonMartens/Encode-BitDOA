// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Score {

uint public score;

address owner;

modifier onlyOwner() {
    if(msg.sender==owner){
        _; //this is just calling the function setScore or whatever function that it is applied to
    }
}

event ScoreSet(uint);

constructor() {
    score = 5;
    owner = msg.sender;
}

//function getScore() public view returns(uint) {
//    return score;
//}

function setScore(uint _newScore) public onlyOwner {
    score = _newScore;
    emit ScoreSet(_newScore);
}

}