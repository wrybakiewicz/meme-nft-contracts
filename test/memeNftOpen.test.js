const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeNFTOpen", function () {
  it("should mint three tokens", async function () {
    const [owner, address1, address2] = await ethers.getSigners();
    const MemeNFTOpen = await ethers.getContractFactory("MemeNFTOpen");
    const memeNFTOpen = await MemeNFTOpen.deploy();
    await memeNFTOpen.deployed();
    const url1 = "some1.url"
    const url2 = "some2.url"
    const url3 = "some3.url"

    const mintTx1 = await memeNFTOpen.mint(url1)
    await memeNFTOpen.mint(url2)
    await memeNFTOpen.connect(address1).mint(url3)

    expect(await memeNFTOpen.name()).to.equal("MemeNFTOpen");
    expect(await memeNFTOpen.symbol()).to.equal("MNFTO");
    expect(await memeNFTOpen.ownerOf(1)).to.equal(owner.address);
    expect(await memeNFTOpen.tokenURI(1)).to.equal(url1);
    expect(await memeNFTOpen.ownerOf(2)).to.equal(owner.address);
    expect(await memeNFTOpen.tokenURI(2)).to.equal(url2);
    expect(await memeNFTOpen.ownerOf(3)).to.equal(address1.address);
    expect(await memeNFTOpen.tokenURI(3)).to.equal(url3);
    expect(await memeNFTOpen.balanceOf(owner.address)).to.equal(2);
    expect(await memeNFTOpen.balanceOf(address1.address)).to.equal(1);
    expect(await memeNFTOpen.balanceOf(address2.address)).to.equal(0);
    await expect(mintTx1).to.emit(memeNFTOpen, "Transfer")
        .withArgs('0x0000000000000000000000000000000000000000', owner.address, 1);
    expect(await memeNFTOpen.totalSupply()).to.equal(3);
  });

});
