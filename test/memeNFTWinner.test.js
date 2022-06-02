const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeNFTWinner", function () {

    it("should mint token from open collection", async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const memeNftOpen = await deployMemeNftOpen()
        const memeNFTWinner = await deployMemeNftWinner(memeNftOpen.address)
        
        const tokenUri = "uri1"
        await memeNftOpen.connect(address1).mint(tokenUri)
        await memeNftOpen.connect(address2).mint(tokenUri)
        await memeNftOpen.connect(address2).approve(memeNFTWinner.address, 2)
        await memeNFTWinner.addOpenCollectionWinnerIds([2])

        const mintTx = await memeNFTWinner.connect(address2).mintFromOpenCollection(2)

        expect(await memeNFTWinner.name()).to.equal("MemeNFTWinner");
        expect(await memeNFTWinner.symbol()).to.equal("MNFTW");
        expect(await memeNFTWinner.ownerOf(1)).to.equal(address2.address);
        expect(await memeNFTWinner.tokenURI(1)).to.equal(tokenUri);
        expect(await memeNFTWinner.totalSupply()).to.equal(1);
        await expect(mintTx).to.emit(memeNFTWinner, "MintedFromOpen")
            .withArgs(2, 1);
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
