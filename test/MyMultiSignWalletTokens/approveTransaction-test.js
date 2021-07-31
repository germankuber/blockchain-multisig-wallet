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


  describe("approveTransaction", function () {
    it("Should reject when the transaction does not exist", async function () {
      await expect(myMultiSignWallet.approveTransaction(88)).to.be
        .reverted.revertedWith("You can not approve this transaction");

    });

    it("Should reject when the sender, does not have permission to approve", async function () {

      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);

      await myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw);
      await expect(myMultiSignWallet.approveTransaction(1), { from: addr2.address }).to.be
        .reverted.revertedWith("You do not have permission to approve this transaction");

    });

    it("Should approve transaction, but need more approvals yet", async function () {

      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr2.address);

      await myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw);

      console.log(await myMultiSignWallet.permissions(owner.address, tokenSymbol, addr2.address));
      let transaction = await myMultiSignWallet.tokenTransactions(1);


      myMultiSignWallet = myMultiSignWallet.connect(addr2);
      await expect(myMultiSignWallet.approveTransaction(1))
        .to.emit(myMultiSignWallet, 'ApproveTokenTransaction')
        .withArgs(transaction.sender,
          transaction.origin,
          transaction.destination,
          transaction.value,
          transaction.symbol,
          transaction.approvals + 1);
    });

    it("Should reject if you have already approved the transaction", async function () {

      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr2.address);

      await myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw);

      myMultiSignWallet = myMultiSignWallet.connect(addr2);
      await myMultiSignWallet.approveTransaction(1);
      await expect(myMultiSignWallet.approveTransaction(1), { from: addr2.address }).to.be
        .reverted.revertedWith("You have already approve this transaction");
    });

    it("Should approve transaction", async function () {

      const tokenSymbol = "DAIT";
      const amountToDeposit = 500;
      const amountToWithdraw = 300;
      await mockERC20.mock.transferFrom.returns(true)

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.depositToken(tokenSymbol, amountToDeposit);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr2.address);

      await myMultiSignWallet.withdrawToken(tokenSymbol, amountToWithdraw);

      let transaction = await myMultiSignWallet.tokenTransactions(1);


      myMultiSignWallet = myMultiSignWallet.connect(addr2);
      await expect(myMultiSignWallet.approveTransaction(1))
        .to.emit(myMultiSignWallet, 'ApproveTokenTransaction')
        .withArgs(transaction.sender,
          transaction.origin,
          transaction.destination,
          transaction.value,
          transaction.symbol,
          transaction.approvals + 1);
    });

    
    it("Should approve transaction, and execute transaction", async function () {

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
        .to.emit(myMultiSignWallet, 'ExecuteTokenTransaction')
        .withArgs(transaction.sender,
          transaction.origin,
          transaction.destination,
          transaction.value,
          transaction.symbol,
          transaction.approvals + 1);
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
  });
});
