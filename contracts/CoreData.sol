//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract CoreData {
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

    event TransferTokens(
        address origin,
        address destination,
        string symbolOfTokenToTransfer,
        uint256 amount
    );

    event NewTokenTransaction(TokenTransaction transaction);
    event ApproveTokenTransaction(
        address sender,
        address origin,
        address destination,
        uint256 value,
        string symbol,
        uint8 approvals
    );
    event ExecuteTokenTransaction(
        address sender,
        address origin,
        address destination,
        uint256 value,
        string symbol,
        uint8 approvals
    );

    struct Token {
        string name;
        address tokenAddress;
        string symbol;
        bool exist;
    }

    struct TokenTransaction {
        address sender;
        address origin;
        address destination;
        uint256 value;
        string symbol;
        uint8 approvals;
        bool executed;
    }
    struct EthTransaction {
        address sender;
        address destination;
        uint256 value;
        bytes data;
        uint8 approvals;
        bool executed;
    }

    mapping(string => Token) public tokens;
    mapping(string => uint256) public tokensBalance;
    mapping(address => mapping(string => uint256))
        public userTokenBalancePerToken;
    mapping(address => uint256) public userEthBalance;

    mapping(address => mapping(string => mapping(address => bool)))
        public permissions;
    mapping(address => mapping(string => mapping(address => bool)))
        public addressAlreadyApproved;

    mapping(uint256 => TokenTransaction) public tokenTransactions;
    uint256 tokenTransactionId;
    mapping(uint256 => EthTransaction) ethTransactions;
    uint256 ethTransactionsId;

    modifier onlyNewTokens(string memory symbol) {
        require(tokens[symbol].exist == false, "Token is already registered");
        _;
    }

    modifier onlyExistedTokens(string memory symbol) {
        require(tokens[symbol].exist == true, "Token is not registered");
        _;
    }

    modifier hasEnoughTokens(
        address origin,
        string memory symbol,
        uint256 amount
    ) {
        require(
            userTokenBalancePerToken[origin][symbol] >= amount,
            "You do not have enough tokens"
        );
        _;
    }

    modifier hasPermissionOnTheAccount(
        address origin,
        string memory symbol,
        uint256 amount
    ) {
        require(
            permissions[origin][symbol][msg.sender] == true ||
                origin == msg.sender,
            "You do not have permission to operate with this address"
        );
        _;
    }
}
