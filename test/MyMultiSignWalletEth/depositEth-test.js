const { expect } = require("chai");
const { setupTest } = require("../utils");

describe("MyMultiSignWalletEth", function () {
  let myMultiSignWallet;
  let owner;

  beforeEach(async () => {
    [myMultiSignWallet, mockERC20, owner, addr1, addr2] = await setupTest();
  });

  describe("depositEth", function () {
    it("Should reject when you do not send the same value", async function () {

      await expect(myMultiSignWallet.depositEth(100, { value: 200 })).to.be
        .reverted.revertedWith("You have to send the same value");
    });

    it("Should emit event AddNewToken", async function () {
      const value = 2000;
      myMultiSignWallet.depositEth(value, { value: value });
      expect(await myMultiSignWallet.userEthBalance(owner.address)).to.equal(value);
    });

    // it("Should reject new Token, if it is already added", async function () {
    //   const tokenSymbol = "DAIT";

    //   await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);

    //   await expect(myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol)).to.be
    //     .reverted.revertedWith("Token is already registered");
    // });
  });


});
