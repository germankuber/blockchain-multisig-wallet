//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./CoreData.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract MyMultiSignWalletEth is Ownable {
    mapping(address => uint256) public userEthBalance;

    function depositEth(uint256 value)
        public
        payable
        returns (uint256 currentValueOfAddress)
    {
        require(value == msg.value, "You have to send the same value");
        userEthBalance[msg.sender] += msg.value;

        return userEthBalance[msg.sender];
    }

    function withdrawEth(uint256 value)
        public
        payable
        returns (uint256 currentValueOfAddress)
    {
        require(
            userEthBalance[msg.sender] >= value,
            "You do not have enough eth"
        );
        userEthBalance[msg.sender] -= value;
        payable(msg.sender).transfer(value);
        return userEthBalance[msg.sender];
    }
}
