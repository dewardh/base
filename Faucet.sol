// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyToken.sol";

contract Faucet {
    MyToken public token;
    uint256 public amountAllowed = 100 * 10 ** 18; // Количество токенов для раздачи
    mapping(address => bool) public requestedAddresses;

    constructor(address _tokenAddress) {
        token = MyToken(_tokenAddress);
    }

    function requestTokens() public {
        require(requestedAddresses[msg.sender] == false, "Already requested tokens");
        require(token.balanceOf(address(this)) >= amountAllowed, "Not enough tokens in the faucet");

        token.transfer(msg.sender, amountAllowed);
        requestedAddresses[msg.sender] = true;
    }
}
