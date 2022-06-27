const {network} = require("hardhat")

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    let memeDegensOpen;
    log("Deploying MemeDegensOpen")
    if (network.name === "localhost" || network.name === "matic" || network.name === "boba" || network.name === "mumbai") {
        memeDegensOpen = await deploy("MemeDegensOpen", {from: deployer, log: true, args: []})
    } else {
        throw new Error("Cannot deploy MemeDegensOpen - unsupported network")
    }
    log("npx hardhat verify --network " + network.name + " " + memeDegensOpen.address)
}