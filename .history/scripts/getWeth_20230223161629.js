const { getNamedAccounts } = require("hardhat")

async function getWeth() {
    const { deployer } = getNamedAccounts()
}

module.exports = { getWeth }
