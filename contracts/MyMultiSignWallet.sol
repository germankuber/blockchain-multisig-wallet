//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyMultiSignWallet is Ownable {
    event AddNewToken(
        address creationAddress,
        string name,
        address tokenAddress,
        string symbol
    );

    event DepositToken(
        address userAddress,
        string symbolOfTokenToDeposit,
        uint256 amount
    );

    event WithdrawToken(
        address userAddress,
        string symbolOfTokenToWithdraw,
        uint256 amount
    );

    struct Token {
        string name;
        address tokenAddress;
        string symbol;
        bool exist;
    }
    mapping(string => Token) public tokens;
    mapping(string => uint256) public tokensBalance;
    mapping(address => mapping(string => uint256))
        public userTokenBalancePerToken;
    mapping(address => uint256) public userEthBalance;

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
        //TODO: Test events
        emit AddNewToken(msg.sender, name, tokenAddress, symbol);
    }

    function depositToken(
        string calldata symbolOfTokenToDeposit,
        uint256 amount
    ) public onlyExistedTokens(symbolOfTokenToDeposit) {
        IERC20 ierc20Token = IERC20(
            tokens[symbolOfTokenToDeposit].tokenAddress
        );

        if (ierc20Token.transferFrom(msg.sender, address(this), amount)) {
            tokensBalance[symbolOfTokenToDeposit] += amount;
            userTokenBalancePerToken[msg.sender][
                symbolOfTokenToDeposit
            ] += amount;
            emit DepositToken(msg.sender, symbolOfTokenToDeposit, amount);
        }
    }

    function withdrawToken(
        string calldata symbolOfTokenToWithdraw,
        uint256 amount
    ) public onlyExistedTokens(symbolOfTokenToWithdraw) {
        require(
            userTokenBalancePerToken[msg.sender][symbolOfTokenToWithdraw] >=
                amount,
            "You do not have enough tokens"
        );
        IERC20 ierc20Token = IERC20(
            tokens[symbolOfTokenToWithdraw].tokenAddress
        );

        if (ierc20Token.transferFrom(address(this), msg.sender, amount)) {
            tokensBalance[symbolOfTokenToWithdraw] -= amount;
            userTokenBalancePerToken[msg.sender][
                symbolOfTokenToWithdraw
            ] -= amount;

            emit WithdrawToken(msg.sender, symbolOfTokenToWithdraw, amount);
        }
    }
}
