const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeNFTWinner", function () {
    it("should mint two tokens", async function () {
        const [owner, address1, address2] = await ethers.getSigners();
        const MemeNFTWinner = await ethers.getContractFactory("MemeNFTWinner");
        const memeNFTWinner = await MemeNFTWinner.deploy();
        await memeNFTWinner.deployed();
        const url1 = "some1.url"
        const url2 = "some2.url"
        const url3 = "some3.url"

        const mintTx1 = await memeNFTWinner.mint(url1, owner.address)
        await memeNFTWinner.mint(url2, owner.address)
        await memeNFTWinner.mint(url3, address1.address)

        expect(await memeNFTWinner.name()).to.equal("MemeNFTWinner");
        expect(await memeNFTWinner.symbol()).to.equal("MNFTW");
        expect(await memeNFTWinner.ownerOf(1)).to.equal(owner.address);
        expect(await memeNFTWinner.tokenURI(1)).to.equal(url1);
        expect(await memeNFTWinner.ownerOf(2)).to.equal(owner.address);
        expect(await memeNFTWinner.tokenURI(2)).to.equal(url2);
        expect(await memeNFTWinner.ownerOf(3)).to.equal(address1.address);
        expect(await memeNFTWinner.tokenURI(3)).to.equal(url3);
        expect(await memeNFTWinner.balanceOf(owner.address)).to.equal(2);
        expect(await memeNFTWinner.balanceOf(address1.address)).to.equal(1);
        expect(await memeNFTWinner.balanceOf(address2.address)).to.equal(0);
        await expect(mintTx1).to.emit(memeNFTWinner, "Transfer")
            .withArgs('0x0000000000000000000000000000000000000000', owner.address, 1);
        expect(await memeNFTWinner.totalSupply()).to.equal(3);
    });

});
