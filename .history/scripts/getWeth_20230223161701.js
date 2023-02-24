const { getNamedAccounts } = require("hardhat")

async function getWeth() {
    const { deployer } = getNamedAccounts()
    //call the deposit function on the weth contract.
}

module.exports = { getWeth }
