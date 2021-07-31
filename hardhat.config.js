require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat-watcher");
let secret = require("./secrets");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  watcher: {
    test: {
      tasks: ["test"],
      files: ["./test","./contracts"],
      verbose: true,
    },
    ci: {
      tasks: ["clean", { command: "compile", params: { quiet: true } }, { command: "test", params: { noCompile: true, testFiles: ["testfile.ts"] } } ],
    }
  },
  networks:{
    rinkeby:{
      url: secret.url,
      accounts:[secret.secret]
    }
  },
  solidity: "0.8.4",
};
