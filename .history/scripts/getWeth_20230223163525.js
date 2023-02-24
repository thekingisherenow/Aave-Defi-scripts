const { getNamedAccounts, ethers } = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    const { deployer } = getNamedAccounts()
    //call the deposit function on the weth contract.
    //getContractAt(abi , contract address,deployer)
    //abi ->from interface
    //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2              ->mainnet weth contract.

    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)
}

module.exports = { getWeth }
