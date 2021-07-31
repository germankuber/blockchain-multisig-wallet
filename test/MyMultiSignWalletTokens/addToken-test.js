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

  
});
