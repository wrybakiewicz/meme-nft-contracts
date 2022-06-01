//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract MemeNFTWinner is ERC721Enumerable, ERC721URIStorage, ERC721Royalty, IERC721Receiver, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint => bool) public openCollectionTokenIdCanMint;
    address public openCollectionAddress;

    constructor(address _openCollectionAddress) ERC721("MemeNFTWinner", "MNFTW") {
        _setDefaultRoyalty(msg.sender, 500);
        openCollectionAddress = _openCollectionAddress;
    }

    //TODO: add tests for this & some events

    function addOpenCollectionWinnerIds(uint[] memory _openCollectionWinnerIds) public onlyOwner {
        for (uint i = 0; i < _openCollectionWinnerIds.length; i++) {
            openCollectionTokenIdCanMint[_openCollectionWinnerIds[i]] = true;
        }
    }

    function mintFromOpenCollection(uint _openCollectionTokenId) public {
        require(openCollectionTokenIdCanMint[_openCollectionTokenId], "Can mint only whitelisted tokens");
        ERC721URIStorage openCollection = ERC721URIStorage(openCollectionAddress);
        string memory _tokenURI = openCollection.tokenURI(_openCollectionTokenId);
        openCollection.safeTransferFrom(msg.sender, address(this), _openCollectionTokenId);
        mint(_tokenURI, msg.sender);
    }

    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external view returns (bytes4) {
        require(from == openCollectionAddress, "Can receive tokens only from open collection address");
        require(openCollectionTokenIdCanMint[tokenId], "Token id must be whitelisted");
        return MemeNFTWinner.onERC721Received.selector;
    }

    function mint(string memory _tokenURI, address to) internal returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, ERC721Royalty)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


}
