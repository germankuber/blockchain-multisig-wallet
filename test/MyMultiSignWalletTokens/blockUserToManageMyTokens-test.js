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

  describe("blockUserToManageMyTokens", function () {
    it("Should reject when the token did not registered", async function () {
      await expect(myMultiSignWallet.blockUserToManageMyTokens("DAI-TEST", addr1.address)).to.be
        .reverted.revertedWith("Token is not registered");

    });
    it("Should add user to permission list", async function () {
      const tokenSymbol = "DAIT";

      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      await myMultiSignWallet.allowUserToManageMyTokens(tokenSymbol, addr1.address);

      expect(await myMultiSignWallet.permissions(owner.address, tokenSymbol, addr1.address)).to.equal(true);

      await myMultiSignWallet.blockUserToManageMyTokens(tokenSymbol, addr1.address);

      expect(await myMultiSignWallet.permissions(owner.address, tokenSymbol, addr1.address)).to.equal(false);

    });
  });
});
