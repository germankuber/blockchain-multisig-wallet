const { expect } = require("chai");
const { setupTest } = require("../utils");

describe("MyMultiSignWallet", function () {
  let myMultiSignWallet;
  let owner;
  let addr1;
  let addr2;
  let mockERC20;
  beforeEach(async () => {
    [myMultiSignWallet, mockERC20, owner, addr1, addr2] = await setupTest();
  });


  describe("withdrawToken", function () {

    it("Should approve transaction, and execute Withdraw", async function () {

      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr2.address);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr1.address);

      await myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw);



      myMultiSignWallet = myMultiSignWallet.connect(addr1);
      myMultiSignWallet.approveTransaction(1);
      myMultiSignWallet = myMultiSignWallet.connect(addr2);

      let transaction = await myMultiSignWallet.tokenTransactions(1);

      await expect(myMultiSignWallet.approveTransaction(1))
        .to.emit(myMultiSignWallet, 'TransferTokens')
        .withArgs(transaction.origin,
          transaction.destination,
          transaction.symbol,
          transaction.value);
          
      expect(await myMultiSignWallet.tokensBalance(tokenSymbol)).to.equal(200);
      expect(await myMultiSignWallet.userTokenBalancePerToken(owner.address, tokenSymbol)).to.equal(200);
    });
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

    it("Should create transaction", async function () {
      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)
      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);

      await myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw);

      const [sender, destination, origin, value, symbol, approvals, executed] = await myMultiSignWallet.tokenTransactions(1);
      expect(sender).to.equal(owner.address);
      expect(origin).to.equal(owner.address);
      expect(destination).to.equal(owner.address);
      expect(value).to.equal(amountToWithdraw);
      expect(symbol).to.equal(tokenSymbol);
      expect(approvals).to.equal(0);
      expect(executed).to.equal(false);

    });
  });

});
