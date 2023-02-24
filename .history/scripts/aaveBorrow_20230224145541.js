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
    let { totalDebtETH, availableBorrowsETH } = await getBorrowUserData(lendingPool, deployer)

    //conversion rate on DAI ??
    const daiETHPrice = await getDAIPrice()
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiETHPrice.toNumber())
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    console.log(`you have got ${amountDaiToBorrowWei} DAI`)
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrowDAI(DAIAddress, lendingPool, amountDaiToBorrowWei, deployer)
    await getBorrowUserData(lendingPool, deployer)
    //approvation needed..
    await approveErc20(DAIAddress, deployer, amountDaiToBorrowWei, deployer)
    console.log("repay function bhaitra chirna lako cham..")
    await repay(DAIAddress, lendingPool, amountDaiToBorrowWei, deployer)
    await getBorrowUserData(lendingPool, deployer)
}
async function repay(assetAddress, lendingPool, amountDai, account) {
    //approveErc20 done here.. need to understand this.
    const bool = assetAddress && lendingPool && amountDai && account
    console.log(bool)
    console.log("repay function ma nai ho samasya.")
    const tx = await lendingPool.repay(assetAddress, amountDai, 1, account)
    await tx.wait(1)
    console.log("Money paid back.")
}

async function borrowDAI(assetAddress, lendingPool, amountDaiToBorrowWei, account) {
    const borrowTx = await lendingPool.borrow(assetAddress, amountDaiToBorrowWei, 1, 0, account)
    await borrowTx.wait()
    console.log("Successfully borrowed")
}
async function getDAIPrice() {
    const daiETHPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    const daiETHPrice = (await daiETHPriceFeed.latestRoundData()).answer
    return daiETHPrice
}
async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log("USER ACCOUNT DATA:")
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed..`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH `)
    return { totalDebtETH, availableBorrowsETH }
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
