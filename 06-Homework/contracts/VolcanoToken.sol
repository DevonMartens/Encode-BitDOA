// SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VolcanoToken is ERC721, Ownable {
    using Strings for uint256;
    uint256 private _tokenId;
    
    struct Metadata {
        uint256 timestamp;
        uint256 tokenId;
        string tokenUri;
    }

    mapping(address => Metadata[]) public _ownerMapping;

    constructor() ERC721("VolcanoToken", "VOL") {
        
    }

    function _baseURI() internal override view virtual returns (string memory) {
        return "https://somenft.com/";
    }

    function mint() public {
        _safeMint(msg.sender, _tokenId);

        // add the metadata to the owner mapping        
        Metadata memory meta = Metadata(block.timestamp, _tokenId, string(abi.encodePacked(_baseURI(), _tokenId.toString())));
        _ownerMapping[msg.sender].push(meta);

        _tokenId += 1;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override virtual {
        // remove the mapping from the original owner
        removeOwnerMapping(tokenId, from);

        // add the metadata to the owner mapping
        Metadata memory meta = Metadata(block.timestamp, tokenId, string(abi.encodePacked(_baseURI(), tokenId.toString())));
        _ownerMapping[to].push(meta);

        super.safeTransferFrom(from, to, tokenId);
    }

    function getMeta(address ownerAddress) public view returns (Metadata[] memory) {
        return _ownerMapping[ownerAddress];
    }

    function burn(uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner, "VolcanoToken: you must own the token to burn it!");

        _burn(tokenId);
        removeOwnerMapping(tokenId, tokenOwner);
    }

    function removeOwnerMapping(uint256 tokenId, address tokenOwner) internal returns (bool) {
        Metadata[] storage meta = _ownerMapping[tokenOwner];
        uint indexToBeDeleted;
        uint arrayLen = meta.length;

        for (uint i=0; i<arrayLen; i++) {
            Metadata memory m = meta[i];

            if (tokenId == m.tokenId) {
                indexToBeDeleted = i;
                break;
            }
        }

        // Move the item into the last position
        meta[indexToBeDeleted] = meta[meta.length-1];
        // Remove the last element
        meta.pop();

        return true;
    }

}