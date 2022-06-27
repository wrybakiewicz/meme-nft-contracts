const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("MemeDegensWinners", function () {

    it("should mint token from open collection", async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const memeDegensOpen = await deployMemeDegensOpen()
        const memeDegensWinners = await deployMemeDegensWinners(memeDegensOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        await memeDegensOpen.mint(address1.address)
        await memeDegensOpen.setTokenURI(tokenUri1, 1)
        await memeDegensOpen.mint(address2.address)
        await memeDegensOpen.setTokenURI(tokenUri2, 2)
        await memeDegensOpen.connect(address2).approve(memeDegensWinners.address, 2)
        await memeDegensWinners.addOpenCollectionWinnerIds([2])

        const mintTx = await memeDegensWinners.connect(address2).mintFromOpenCollection(2)

        expect(await memeDegensWinners.name()).to.equal("MemeDegensWinners");
        expect(await memeDegensWinners.symbol()).to.equal("MDGW");
        expect(await memeDegensWinners.ownerOf(1)).to.equal(address2.address);
        expect(await memeDegensWinners.tokenURI(1)).to.equal(tokenUri2);
        expect(await memeDegensWinners.totalSupply()).to.equal(1);
        await expect(mintTx).to.emit(memeDegensWinners, "MintedFromOpen")
            .withArgs(2, 1);
    });

    it("should mint two tokens from different addresses from open collection", async () => {
        const [owner, address1, address2, address3] = await ethers.getSigners();
        const memeDegensOpen = await deployMemeDegensOpen()
        const memeDegensWinners = await deployMemeDegensWinners(memeDegensOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        const tokenUri3 = "uri3"
        await memeDegensOpen.mint(address1.address)
        await memeDegensOpen.setTokenURI(tokenUri1, 1)
        await memeDegensOpen.mint(address2.address)
        await memeDegensOpen.setTokenURI(tokenUri2, 2)
        await memeDegensOpen.mint(address3.address)
        await memeDegensOpen.setTokenURI(tokenUri3, 3)
        await memeDegensOpen.connect(address1).approve(memeDegensWinners.address, 1)
        await memeDegensOpen.connect(address3).approve(memeDegensWinners.address, 3)
        await memeDegensWinners.addOpenCollectionWinnerIds([1, 3])

        const mintTx1 = await memeDegensWinners.connect(address1).mintFromOpenCollection(1)
        const mintTx2 = await memeDegensWinners.connect(address3).mintFromOpenCollection(3)

        expect(await memeDegensWinners.name()).to.equal("MemeDegensWinners");
        expect(await memeDegensWinners.symbol()).to.equal("MDGW");
        expect(await memeDegensWinners.ownerOf(1)).to.equal(address1.address);
        expect(await memeDegensWinners.tokenURI(1)).to.equal(tokenUri1);
        expect(await memeDegensWinners.ownerOf(2)).to.equal(address3.address);
        expect(await memeDegensWinners.tokenURI(2)).to.equal(tokenUri3);
        expect(await memeDegensWinners.totalSupply()).to.equal(2);
        await expect(mintTx1).to.emit(memeDegensWinners, "MintedFromOpen")
            .withArgs(1, 1);
        await expect(mintTx2).to.emit(memeDegensWinners, "MintedFromOpen")
            .withArgs(3, 2);
    });

    it("should mint two tokens from the same addresses from open collection", async () => {
        const [owner, address1, address2, address3] = await ethers.getSigners();
        const memeDegensOpen = await deployMemeDegensOpen()
        const memeDegensWinners = await deployMemeDegensWinners(memeDegensOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        const tokenUri3 = "uri3"
        await memeDegensOpen.mint(address1.address)
        await memeDegensOpen.setTokenURI(tokenUri1, 1)
        await memeDegensOpen.mint(address1.address)
        await memeDegensOpen.setTokenURI(tokenUri2, 2)
        await memeDegensOpen.mint(address3.address)
        await memeDegensOpen.setTokenURI(tokenUri3, 3)
        await memeDegensOpen.connect(address1).approve(memeDegensWinners.address, 1)
        await memeDegensOpen.connect(address1).approve(memeDegensWinners.address, 2)
        await memeDegensWinners.addOpenCollectionWinnerIds([1, 2])

        const mintTx1 = await memeDegensWinners.connect(address1).mintFromOpenCollection(1)
        const mintTx2 = await memeDegensWinners.connect(address1).mintFromOpenCollection(2)

        expect(await memeDegensWinners.name()).to.equal("MemeDegensWinners");
        expect(await memeDegensWinners.symbol()).to.equal("MDGW");
        expect(await memeDegensWinners.ownerOf(1)).to.equal(address1.address);
        expect(await memeDegensWinners.tokenURI(1)).to.equal(tokenUri1);
        expect(await memeDegensWinners.ownerOf(2)).to.equal(address1.address);
        expect(await memeDegensWinners.tokenURI(2)).to.equal(tokenUri2);
        expect(await memeDegensWinners.totalSupply()).to.equal(2);
        await expect(mintTx1).to.emit(memeDegensWinners, "MintedFromOpen")
            .withArgs(1, 1);
        await expect(mintTx2).to.emit(memeDegensWinners, "MintedFromOpen")
            .withArgs(2, 2);
    });

    it("should not mint not whitelisted token", async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const memeDegensOpen = await deployMemeDegensOpen()
        const memeDegensWinners = await deployMemeDegensWinners(memeDegensOpen.address)

        const tokenUri1 = "uri1"
        const tokenUri2 = "uri2"
        await memeDegensOpen.mint(address1.address)
        await memeDegensOpen.setTokenURI(tokenUri1, 1)
        await memeDegensOpen.mint(address2.address)
        await memeDegensOpen.setTokenURI(tokenUri2, 2)
        await memeDegensOpen.connect(address1).approve(memeDegensWinners.address, 1)
        await memeDegensOpen.connect(address2).approve(memeDegensWinners.address, 2)
        await memeDegensWinners.addOpenCollectionWinnerIds([2])

        const mintTx1 = memeDegensWinners.connect(address1).mintFromOpenCollection(1)

        await expect(mintTx1).to.be.revertedWith("Can mint only whitelisted tokens")
    });

    const deployMemeDegensOpen = async () => {
        const MemeDegensOpen = await ethers.getContractFactory("MemeDegensOpen");
        const memeDegensOpen = await MemeDegensOpen.deploy();
        await memeDegensOpen.deployed();
        return memeDegensOpen
    }

    const deployMemeDegensWinners = async (memeDegensOpenAddress) => {
        const MemeDegensWinners = await ethers.getContractFactory("MemeDegensWinners");
        const memeDegensWinners = await MemeDegensWinners.deploy(memeDegensOpenAddress);
        await memeDegensWinners.deployed();
        return memeDegensWinners
    }

});
