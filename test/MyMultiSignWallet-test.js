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
    it("Should reject new Token, if it is already added", async function () {
      const tokenSymbol = "DAIT";
      await myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol);
      
      await expect(myMultiSignWallet.addToken("DAI-TEST", mockERC20.address, tokenSymbol)).to.be
      .reverted.revertedWith("Token is already registered");
    });
  });
});
