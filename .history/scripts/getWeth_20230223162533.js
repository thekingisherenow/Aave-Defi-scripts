const { getNamedAccounts } = require("hardhat")

async function getWeth() {
    const { deployer } = getNamedAccounts()
    //call the deposit function on the weth contract.
    //abi, contract address
    //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2              ->mainnet weth contract.
}

module.exports = { getWeth }
