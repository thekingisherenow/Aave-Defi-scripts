const { getNamedAccounts } = require("hardhat")
const { getWeth } = require("./getWeth")

const main = async () => {
    //the protocal treats everything as a ERC20 token.
    await getWeth()
    const { deployer } = await getNamedAccounts()
    //now we interact with aave protocal.
    //abi,address,dep[loyer.]
    //address = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
