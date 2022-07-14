const{assert,expect}=require("chai")
const{deployments,network,ethers}=require("hardhat")
const{developmentChains,networkConfig}=require("../../helper-hardhat-config")

!developmentChains.include(network.name)
?describe.skip
:describe("Raffle unit test",function (){

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        player = accounts[1]
        await deployments.fixture(["mocks", "raffle"])
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        raffleContract = await ethers.getContract("Raffle")
        raffle = raffleContract.connect(player)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = await raffle.getInterval()
    })

    describe("constructor", function () {
        it("intitiallizes the raffle correctly", async () => {
            const raffleState = (await raffle.getRaffleState()).toString()
            assert.equal(raffleState, "0")
            assert.equal(
                interval.toString(),
                networkConfig[network.config.chainId]["keepersUpdateInterval"]
            )
        })
    })

    describe("enterRaffle", function () {
        it("reverts when you don't pay enough", async () => {
            await expect(raffle.enterRaffle()).to.be.revertedWith(
                "Raffle__SendMoreToEnterRaffle"
            )
        })
        it("records player when they enter", async () => {
            await raffle.enterRaffle({ value: raffleEntranceFee })
            const contractPlayer = await raffle.getPlayer(0)
            assert.equal(player.address, contractPlayer)
        })

        it("emits event ",async () => {
            await (expect(raffle.enterraffle({value: raffleeEnteranceFee})).to.emit(raffle,"Rafflestring"))
        })
    })
})

