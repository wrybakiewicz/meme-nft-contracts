const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeDegensOpen", function () {
  it("should mint three tokens", async function () {
    const [owner, address1, address2] = await ethers.getSigners();
    const MemeDegensOpen = await ethers.getContractFactory("MemeDegensOpen");
    const memeDegensOpen = await MemeDegensOpen.deploy();
    await memeDegensOpen.deployed();
    const url1 = "some1.url"
    const url2 = "some2.url"
    const url3 = "some3.url"

    const mintTx1 = await memeDegensOpen.mint(owner.address)
    await memeDegensOpen.setTokenURI(url1, 1)
    await memeDegensOpen.mint(owner.address)
    await memeDegensOpen.setTokenURI(url2, 2)
    await memeDegensOpen.mint(address1.address)
    await memeDegensOpen.setTokenURI(url3, 3)

    expect(await memeDegensOpen.name()).to.equal("MemeDegensOpen");
    expect(await memeDegensOpen.symbol()).to.equal("MDGO");
    expect(await memeDegensOpen.ownerOf(1)).to.equal(owner.address);
    expect(await memeDegensOpen.tokenURI(1)).to.equal(url1);
    expect(await memeDegensOpen.ownerOf(2)).to.equal(owner.address);
    expect(await memeDegensOpen.tokenURI(2)).to.equal(url2);
    expect(await memeDegensOpen.ownerOf(3)).to.equal(address1.address);
    expect(await memeDegensOpen.tokenURI(3)).to.equal(url3);
    expect(await memeDegensOpen.balanceOf(owner.address)).to.equal(2);
    expect(await memeDegensOpen.balanceOf(address1.address)).to.equal(1);
    expect(await memeDegensOpen.balanceOf(address2.address)).to.equal(0);
    await expect(mintTx1).to.emit(memeDegensOpen, "Transfer")
        .withArgs('0x0000000000000000000000000000000000000000', owner.address, 1);
    expect(await memeDegensOpen.totalSupply()).to.equal(3);
  });

});
