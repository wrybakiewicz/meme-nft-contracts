const {network} = require("hardhat")

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    let memeNFT;
    log("Deploying MemeNFTOpen")
    if (network.name === "localhost" || network.name === "matic" || network.name === "boba" || network.name === "mumbai") {
        memeNFT = await deploy("MemeNFTOpen", {from: deployer, log: true, args: []})
    } else {
        throw new Error("Cannot deploy MemeNFTOpen - unsupported network")
    }
    log("npx hardhat verify --network " + network.name + " " + memeNFT.address)
}