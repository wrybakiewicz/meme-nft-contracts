const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeNFTWinner", function () {

    it("should mint token from open collection", async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const memeNftOpen = await deployMemeNftOpen()
        const memeNFTWinner = await deployMemeNftWinner(memeNftOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        await memeNftOpen.connect(address1).mint(tokenUri1)
        await memeNftOpen.connect(address2).mint(tokenUri2)
        await memeNftOpen.connect(address2).approve(memeNFTWinner.address, 2)
        await memeNFTWinner.addOpenCollectionWinnerIds([2])

        const mintTx = await memeNFTWinner.connect(address2).mintFromOpenCollection(2)

        expect(await memeNFTWinner.name()).to.equal("MemeNFTWinner");
        expect(await memeNFTWinner.symbol()).to.equal("MNFTW");
        expect(await memeNFTWinner.ownerOf(1)).to.equal(address2.address);
        expect(await memeNFTWinner.tokenURI(1)).to.equal(tokenUri2);
        expect(await memeNFTWinner.totalSupply()).to.equal(1);
        await expect(mintTx).to.emit(memeNFTWinner, "MintedFromOpen")
            .withArgs(2, 1);
    });

    it("should mint two tokens from different addresses from open collection", async () => {
        const [owner, address1, address2, address3] = await ethers.getSigners();
        const memeNftOpen = await deployMemeNftOpen()
        const memeNFTWinner = await deployMemeNftWinner(memeNftOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        const tokenUri3 = "uri3"
        await memeNftOpen.connect(address1).mint(tokenUri1)
        await memeNftOpen.connect(address2).mint(tokenUri2)
        await memeNftOpen.connect(address3).mint(tokenUri3)
        await memeNftOpen.connect(address1).approve(memeNFTWinner.address, 1)
        await memeNftOpen.connect(address3).approve(memeNFTWinner.address, 3)
        await memeNFTWinner.addOpenCollectionWinnerIds([1, 3])

        const mintTx1 = await memeNFTWinner.connect(address1).mintFromOpenCollection(1)
        const mintTx2 = await memeNFTWinner.connect(address3).mintFromOpenCollection(3)

        expect(await memeNFTWinner.name()).to.equal("MemeNFTWinner");
        expect(await memeNFTWinner.symbol()).to.equal("MNFTW");
        expect(await memeNFTWinner.ownerOf(1)).to.equal(address1.address);
        expect(await memeNFTWinner.tokenURI(1)).to.equal(tokenUri1);
        expect(await memeNFTWinner.ownerOf(2)).to.equal(address3.address);
        expect(await memeNFTWinner.tokenURI(2)).to.equal(tokenUri3);
        expect(await memeNFTWinner.totalSupply()).to.equal(2);
        await expect(mintTx1).to.emit(memeNFTWinner, "MintedFromOpen")
            .withArgs(1, 1);
        await expect(mintTx2).to.emit(memeNFTWinner, "MintedFromOpen")
            .withArgs(3, 2);
    });

    it("should mint two tokens from the same addresses from open collection", async () => {
        const [owner, address1, address2, address3] = await ethers.getSigners();
        const memeNftOpen = await deployMemeNftOpen()
        const memeNFTWinner = await deployMemeNftWinner(memeNftOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        const tokenUri3 = "uri3"
        await memeNftOpen.connect(address1).mint(tokenUri1)
        await memeNftOpen.connect(address1).mint(tokenUri2)
        await memeNftOpen.connect(address3).mint(tokenUri3)
        await memeNftOpen.connect(address1).approve(memeNFTWinner.address, 1)
        await memeNftOpen.connect(address1).approve(memeNFTWinner.address, 2)
        await memeNFTWinner.addOpenCollectionWinnerIds([1, 2])

        const mintTx1 = await memeNFTWinner.connect(address1).mintFromOpenCollection(1)
        const mintTx2 = await memeNFTWinner.connect(address1).mintFromOpenCollection(2)

        expect(await memeNFTWinner.name()).to.equal("MemeNFTWinner");
        expect(await memeNFTWinner.symbol()).to.equal("MNFTW");
        expect(await memeNFTWinner.ownerOf(1)).to.equal(address1.address);
        expect(await memeNFTWinner.tokenURI(1)).to.equal(tokenUri1);
        expect(await memeNFTWinner.ownerOf(2)).to.equal(address1.address);
        expect(await memeNFTWinner.tokenURI(2)).to.equal(tokenUri2);
        expect(await memeNFTWinner.totalSupply()).to.equal(2);
        await expect(mintTx1).to.emit(memeNFTWinner, "MintedFromOpen")
            .withArgs(1, 1);
        await expect(mintTx2).to.emit(memeNFTWinner, "MintedFromOpen")
            .withArgs(2, 2);
    });

    it("should not mint not whitelisted token", async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const memeNftOpen = await deployMemeNftOpen()
        const memeNFTWinner = await deployMemeNftWinner(memeNftOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        await memeNftOpen.connect(address1).mint(tokenUri1)
        await memeNftOpen.connect(address2).mint(tokenUri2)
        await memeNftOpen.connect(address1).approve(memeNFTWinner.address, 1)
        await memeNftOpen.connect(address2).approve(memeNFTWinner.address, 2)
        await memeNFTWinner.addOpenCollectionWinnerIds([2])

        const mintTx1 = memeNFTWinner.connect(address1).mintFromOpenCollection(1)

        await expect(mintTx1).to.be.revertedWith("Can mint only whitelisted tokens")
    });
    
    const deployMemeNftOpen = async () => {
        const MemeNFTOpen = await ethers.getContractFactory("MemeNFTOpen");
        const memeNFTOpen = await MemeNFTOpen.deploy();
        await memeNFTOpen.deployed();
        return memeNFTOpen
    }

    const deployMemeNftWinner = async (memeNftOpenAddress) => {
        const MemeNFTWinner = await ethers.getContractFactory("MemeNFTWinner");
        const memeNFTWinner = await MemeNFTWinner.deploy(memeNftOpenAddress);
        await memeNFTWinner.deployed();
        return memeNFTWinner
    }
    
});
