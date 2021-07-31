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

contract MyMultiSignWallet is CoreData, Ownable {
    uint8 countOfApprovals;

    constructor(uint8 _countOfApprovals) {
        countOfApprovals = _countOfApprovals;
        tokenTransactionId = 0;
        ethTransactionsId = 0;
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

    function _transferTokens(
        address origin,
        address destination,
        string memory symbol,
        uint256 amount
    )
        private
        onlyExistedTokens(symbol)
        hasEnoughTokens(origin, symbol, amount)
    {
        IERC20 ierc20Token = IERC20(tokens[symbol].tokenAddress);

        if (ierc20Token.transferFrom(origin, destination, amount)) {
            tokensBalance[symbol] -= amount;
            userTokenBalancePerToken[origin][symbol] -= amount;

            emit TransferTokens(origin, destination, symbol, amount);
        }
    }

    function allowUserToManageMyTokens(
        string calldata symbol,
        address addressToAllow
    ) public onlyExistedTokens(symbol) {
        permissions[msg.sender][symbol][addressToAllow] = true;
    }

    function blockUserToManageMyTokens(
        string calldata symbol,
        address addressToAllow
    ) public onlyExistedTokens(symbol) {
        permissions[msg.sender][symbol][addressToAllow] = false;
    }

    function withdrawToken(string calldata symbol, uint256 amount)
        public
        onlyExistedTokens(symbol)
        hasEnoughTokens(msg.sender, symbol, amount)
        returns (uint256)
    {
        TokenTransaction memory transaction;
        transaction.sender = address(msg.sender);
        transaction.origin = address(msg.sender);
        transaction.destination = address(msg.sender);
        transaction.value = amount;
        transaction.symbol = symbol;
        transaction.approvals = 0;
        transaction.executed = false;
        ++tokenTransactionId;
        tokenTransactions[tokenTransactionId] = transaction;

        return tokenTransactionId;
    }

    function transferToken(
        address origin,
        address destination,
        string calldata symbol,
        uint256 amount
    )
        public
        onlyExistedTokens(symbol)
        hasEnoughTokens(origin, symbol, amount)
        hasPermissionOnTheAccount(origin, symbol, amount)
        returns (uint256)
    {
        (, uint256 tokenTransactionId) = _createTokenTransaction(
            origin,
            destination,
            symbol,
            amount
        );
        return tokenTransactionId;
    }

    function _createTokenTransaction(
        address origin,
        address destination,
        string calldata symbol,
        uint256 amount
    )
        private
        returns (
            TokenTransaction memory tokenTransaction,
            uint256 tokenTransactionId
        )
    {
        TokenTransaction memory transaction;
        transaction.sender = msg.sender;
        transaction.origin = origin;
        transaction.destination = destination;
        transaction.value = amount;
        transaction.symbol = symbol;
        transaction.approvals = 0;
        transaction.executed = false;
        ++tokenTransactionId;
        tokenTransactions[tokenTransactionId] = transaction;
        return (transaction, tokenTransactionId);
    }

    function approveTransaction(uint256 transactionId) public {
        TokenTransaction storage transaction = tokenTransactions[transactionId];

        require(
            transaction.executed == false && transaction.sender != address(0),
            "You can not approve this transaction"
        );
        require(
            permissions[transaction.origin][transaction.symbol][msg.sender] ==
                true,
            "You do not have permission to approve this transaction"
        );
        require(
            addressAlreadyApproved[transaction.origin][transaction.symbol][
                msg.sender
            ] == false,
            "You have already approve this transaction"
        );
        ++transaction.approvals;
        emit ApproveTokenTransaction(
            transaction.sender,
            transaction.origin,
            transaction.destination,
            transaction.value,
            transaction.symbol,
            transaction.approvals
        );
        addressAlreadyApproved[transaction.origin][transaction.symbol][
            msg.sender
        ] = true;
        if (transaction.approvals >= countOfApprovals) {
            _transferTokens(
                transaction.origin,
                transaction.destination,
                transaction.symbol,
                transaction.value
            );
            transaction.executed = true;
            emit ExecuteTokenTransaction(
                transaction.sender,
                transaction.origin,
                transaction.destination,
                transaction.value,
                transaction.symbol,
                transaction.approvals
            );
        }
    }
}
