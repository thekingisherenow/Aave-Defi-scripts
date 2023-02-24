const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth } = require("./getWeth")

const main = async () => {
    //the protocal treats everything as a ERC20 token.
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer)
    console.log(`Lenind Pool Address: ${await lendingPool.address}`)

    //deposit

    //allow it persmission to transfer our web token.
}
//now we interact with aave protocal.
//abi,address,dep[loyer.]
//Lending Poool Addresses Provider = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
//Lending pool adress is provided from lending pool address provider.

async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = lendingPoolAddressProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
