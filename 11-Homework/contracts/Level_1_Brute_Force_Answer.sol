pragma solidity 0.6.0;

contract Level_1_Brute_Force_Answer {

    bytes32 answerHash = 0x04994f67dc55b09e814ab7ffc8df3686b4afb2bb53e60eae97ef043fe03fb829;

    function guess() public view returns(uint8) {
        for (uint8 i = 0; i < 256; i++) {
            if (keccak256(abi.encodePacked(i)) == answerHash) {
                return i;
            }
        }
    }
}