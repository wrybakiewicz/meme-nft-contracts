const {network} = require("hardhat")

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    let memeNFT;
    log("Deploying MemeNFTWinner")
    if (network.name === "localhost" || network.name === "matic" || network.name === "boba" || network.name === "mumbai") {
        memeNFT = await deploy("MemeNFTWinner", {from: deployer, log: true, args: []})
    } else {
        throw new Error("Cannot deploy MemeNFTWinner - unsupported network")
    }
    log("npx hardhat verify --network " + network.name + " " + memeNFT.address)
}