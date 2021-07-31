//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./CoreData.sol";
import "./MyMultiSignWalletTokens.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyMultiSignWallet is MyMultiSignWalletTokens {
    constructor(uint8 _countOfApprovals)
        MyMultiSignWalletTokens(_countOfApprovals)
    {}
}
