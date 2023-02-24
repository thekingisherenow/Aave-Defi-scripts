const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("./getWeth")

const main = async () => {
    //the protocal treats everything as a ERC20 token.
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer)
    const lendingPoolAddress = await lendingPool.address
    console.log(`Lenind Pool Address: ${lendingPoolAddress}`)

    //deposit
    const wethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    //approve
    await approveErc20(wethAddress, lendingPoolAddress, AMOUNT, deployer)
    console.log("Depositingg.....")
    await lendingPool.deposit(wethAddress, AMOUNT, deployer, 0)
    console.log("Depositedd !!")

    //Borrow Time !!
    //how much we have borrowed,how much we have in collateral,how much we can borrow .. -> function getUserAccountData()
    await getBorrowUserData(lendingPool, deployer)
}
async function getBorrowUserData(lendingPool, account) {
    const { healthFactor } = await lendingPool.getUserAccountData(account)
    console.log(healthFactor)
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
async function approveErc20(erc20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved !!")
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
