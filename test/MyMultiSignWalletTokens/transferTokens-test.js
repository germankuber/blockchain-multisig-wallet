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


  describe("transferToken", function () {
    it("Should approve transaction, and execute Transfer", async function () {

      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToTransfer = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr2.address);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr1.address);

      await myMultiSignWallet.transferToken(
        owner.address,
        addr2.address,
        tokenSymbol, 
        amountToTransfer);

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

   

  
  });
});
