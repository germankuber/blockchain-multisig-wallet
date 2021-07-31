const { expect, assert } = require("chai");
const { deployMockContract } = require("ethereum-waffle");
const { IERC20Abi, setupTest } = require("./utils");




describe("MyMultiSignWallet", function () {
  let myMultiSignWallet;
  let owner;
  let addr1;
  let addr2;
  let mockERC20;
  beforeEach(async () => {
        [myMultiSignWallet, mockERC20, owner, addr1, addr2] = await setupTest();
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

});
