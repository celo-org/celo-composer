//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    event NewGreeting(string greeting, address sender);

    string private _greeting;

    constructor(string memory _greet) {
        console.log("Deploying a Greeter with greeting:", _greet);
        _greeting = _greet;
    }

    function greet() public view returns (string memory) {
        return _greeting;
    }

    function setGreeting(string calldata greeting) external {
        console.log("Changing greeting from '%s' to '%s'", _greeting, greeting);
        _greeting = greeting;
        emit NewGreeting(_greeting, msg.sender);
    }
}
