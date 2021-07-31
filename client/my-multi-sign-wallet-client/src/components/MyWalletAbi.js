const myWalletAbi = [
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_countOfApprovals",
                "type": "uint8"
        }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "creationAddress",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
        },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        }
        ],
        "name": "AddNewToken",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "address",
                "name": "origin",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "address",
                "name": "destination",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
        },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "approvals",
                "type": "uint8"
        }
        ],
        "name": "ApproveTokenTransaction",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbolOfTokenToDeposit",
                "type": "string"
        },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
        }
        ],
        "name": "DepositToken",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "address",
                "name": "origin",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "address",
                "name": "destination",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
        },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "approvals",
                "type": "uint8"
        }
        ],
        "name": "ExecuteTokenTransaction",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
            },
                    {
                        "internalType": "address",
                        "name": "origin",
                        "type": "address"
            },
                    {
                        "internalType": "address",
                        "name": "destination",
                        "type": "address"
            },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
            },
                    {
                        "internalType": "string",
                        "name": "symbol",
                        "type": "string"
            },
                    {
                        "internalType": "uint8",
                        "name": "approvals",
                        "type": "uint8"
            },
                    {
                        "internalType": "bool",
                        "name": "executed",
                        "type": "bool"
            }
                ],
                "indexed": false,
                "internalType": "struct CoreData.TokenTransaction",
                "name": "transaction",
                "type": "tuple"
        }
        ],
        "name": "NewTokenTransaction",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
        },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
        }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "origin",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "address",
                "name": "destination",
                "type": "address"
        },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbolOfTokenToTransfer",
                "type": "string"
        },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
        }
        ],
        "name": "TransferTokens",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
        },
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
        },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        }
        ],
        "name": "addToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
        },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
        },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
        }
        ],
        "name": "addressAlreadyApproved",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "internalType": "address",
                "name": "addressToAllow",
                "type": "address"
        }
        ],
        "name": "allowUserToManageMyTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "transactionId",
                "type": "uint256"
        }
        ],
        "name": "approveTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "internalType": "address",
                "name": "addressToAllow",
                "type": "address"
        }
        ],
        "name": "blockUserToManageMyTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "symbolOfTokenToDeposit",
                "type": "string"
        },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
        }
        ],
        "name": "depositToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
        },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
        },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
        }
        ],
        "name": "permissions",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
        }
        ],
        "name": "tokenTransactions",
        "outputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
        },
            {
                "internalType": "address",
                "name": "origin",
                "type": "address"
        },
            {
                "internalType": "address",
                "name": "destination",
                "type": "address"
        },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
        },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "internalType": "uint8",
                "name": "approvals",
                "type": "uint8"
        },
            {
                "internalType": "bool",
                "name": "executed",
                "type": "bool"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
        }
        ],
        "name": "tokens",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
        },
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
        },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "internalType": "bool",
                "name": "exist",
                "type": "bool"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
        }
        ],
        "name": "tokensBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
        }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "origin",
                "type": "address"
        },
            {
                "internalType": "address",
                "name": "destination",
                "type": "address"
        },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
        }
        ],
        "name": "transferToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
        }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
        }
        ],
        "name": "userEthBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
        },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
        }
        ],
        "name": "userTokenBalancePerToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
        },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
        }
        ],
        "name": "withdrawToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
        }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

module.exports = { myWalletAbi };