//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyMultiSignWallet is Ownable {
    struct Token {
        string name;
        address tokenAddress;
        string symbol;
        bool exist;
    }
    mapping(string => Token) public tokens;
    mapping(string => uint256) tokensBalance;
    mapping(address => mapping(string => uint256)) userTokenBalancePerToken;
    mapping(address => uint256) userEthBalance;

    modifier onlyNewTokens(string memory symbol) {
        require(tokens[symbol].exist == false, "Token is already registered");
        _;
    }

    modifier onlyExistedTokens(string memory symbol) {
        require(tokens[symbol].exist == true, "Token is not registered");
        _;
    }

    function addToken(
        string calldata name,
        address tokenAddress,
        string calldata symbol
    ) public onlyNewTokens(symbol) {
        Token memory token;
        token.name = name;
        token.tokenAddress = tokenAddress;
        token.symbol = symbol;
        token.exist = true;
        tokens[token.symbol] = token;
    }
}
