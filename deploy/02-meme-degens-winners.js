const {network} = require("hardhat")

const openAddress = "0x89D10D5Fe01B544A8bcaBF5F9124E1DD2788240B"

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    let memeDegensWinners;
    log("Deploying MemeDegensWinners")
    if (network.name === "localhost" || network.name === "matic" || network.name === "boba" || network.name === "mumbai") {
        memeDegensWinners = await deploy("MemeDegensWinners", {from: deployer, log: true, args: [openAddress]})
    } else {
        throw new Error("Cannot deploy MemeDegensWinners - unsupported network")
    }
    log("npx hardhat verify --network " + network.name + " " + memeDegensWinners.address + " " + openAddress)
}