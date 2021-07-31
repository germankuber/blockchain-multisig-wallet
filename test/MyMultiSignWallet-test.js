const { expect, assert } = require("chai");
const { deployMockContract } = require("ethereum-waffle");
const { IERC20Abi } = require("./utils");

describe("MyMultiSignWallet", function () {
  let myMultiSignWallet;
  let owner;
  let addr1;
  let addr2;
  let mockERC20;
  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    mockERC20 = await deployMockContract(owner, IERC20Abi);
    myMultiSignWallet = await (await ethers.getContractFactory("MyMultiSignWallet")).deploy();
    await myMultiSignWallet.deployed();
  });

  describe("addToken", function () {
    it("Should add new Token", async function () {
      const tokenSymbol = "DAIT";

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      const [, , , exist] = await myMultiSignWallet.tokens(tokenSymbol);

      expect(exist).to.equal(true);
    });

    it("Should emit event AddNewToken", async function () {
      const tokenSymbol = "DAIT";
      const tokenName = "DAI-TEST";
      
      await expect(myMultiSignWallet.addToken(tokenName, mockERC20.address, tokenSymbol))
        .to.emit(myMultiSignWallet, 'AddNewToken')
        .withArgs(owner.address, tokenName, mockERC20.address, tokenSymbol);
    });

    it("Should reject new Token, if it is already added", async function () {
      const tokenSymbol = "DAIT";

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);

      await expect(myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol)).to.be
        .reverted.revertedWith("Token is already registered");
    });
  });
  describe("depositToken", function () {
    it("Should reject when the token did not registered", async function () {
      await expect(myMultiSignWallet.depositToken("DAI-TEST", 200)).to.be
        .reverted.revertedWith("Token is not registered");

    });
    it("Should Deposit current token", async function () {
      const tokenSymbol = "DAIT";
      const amountToDeposit = 22476;

      await mockERC20.mock.transferFrom.returns(true)
      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);

      await expect(myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit))
        .to.emit(myMultiSignWallet, 'DepositToken')
        .withArgs(owner.address, tokenSymbol, amountToDeposit);

      expect(await myMultiSignWallet.tokensBalance(tokenSymbol)).to.equal(amountToDeposit);
      expect(await myMultiSignWallet.userTokenBalancePerToken(owner.address, tokenSymbol)).to.equal(amountToDeposit);
    });
  });

  describe("withdrawToken", function () {
    it("Should reject when the token did not registered", async function () {
      await expect(myMultiSignWallet.withdrawToken("DAI-TEST", 200)).to.be
        .reverted.revertedWith("Token is not registered");

    });
    it("Should reject when the user does not have enough amount of tokens", async function () {
      const tokenSymbol = "DAIT";
      const amountToDeposit = 100;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);

      await expect(myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw)).to.be
        .reverted.revertedWith("You do not have enough tokens");
    });

    it("Should withdraw tokens", async function () {
      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);

      await expect(myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw))
        .to.emit(myMultiSignWallet, 'WithdrawToken')
        .withArgs(owner.address, tokenSymbol, amountToWithdraw);

      expect(await myMultiSignWallet.tokensBalance(tokenSymbol)).to.equal(200);
      expect(await myMultiSignWallet.userTokenBalancePerToken(owner.address, tokenSymbol)).to.equal(200);


    });
  });
});
