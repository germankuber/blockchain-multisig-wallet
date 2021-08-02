const { expect } = require("chai");
const { setupTest } = require("../utils");

describe("MyMultiSignWalletEth", function () {
  let myMultiSignWallet;
  let owner;
  let addr1;
  let addr2;
  let mockERC20;
  beforeEach(async () => {
    [myMultiSignWallet, mockERC20, owner, addr1, addr2] = await setupTest();
  });

  describe("withdrawEth", function () {
    it("Should reject when you do not have enough eth", async function () {
      myMultiSignWallet.depositEth(200, { value: 200 });
      await expect(myMultiSignWallet.withdrawEth(444)).to.be
        .reverted.revertedWith("You do not have enough eth");
    });

    it("Should withdraw Eth", async function () {
      const balanceBeforeWithdraw = ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
      myMultiSignWallet.depositEth(200, { value: 200 });
      await myMultiSignWallet.withdrawEth(150);
      const balanceAfterWithdraw = ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));

      expect(balanceBeforeWithdraw > balanceAfterWithdraw).to.equal(true);
      expect(await myMultiSignWallet.userEthBalance(owner.address)).to.equal(50);

    });

    // it("Should reject new Token, if it is already added", async function () {
    //   const tokenSymbol = "DAIT";

    //   await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);

    //   await expect(myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol)).to.be
    //     .reverted.revertedWith("Token is already registered");
    // });
  });


});
