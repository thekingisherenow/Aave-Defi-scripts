const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth } = require("./getWeth")

const main = async () => {
    //the protocal treats everything as a ERC20 token.
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPoolAddress = await getLendingPool(deployer)
    //now we interact with aave protocal.
    //abi,address,dep[loyer.]
    //Lending Poool Addresses Provider = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    //Lending pool adress is provided from lending pool address provider.
}

async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = lendingPoolAddressProvider.getLendingPool()
    lendingPoolAddress = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
