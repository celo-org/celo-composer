//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    event newGreeting(string greeting, address sender);

    string private greeting;

    constructor(string memory _greet) {
        console.log("Deploying a Greeter with greeting:", _greet);
        greeting = _greet;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string calldata _greeting) external {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
        emit newGreeting(_greeting, msg.sender);
    }

    // function greetingsAvailable() public returns (string memory,string memory, string memory){
    //     return ("Morning sunshine", "Good day", "Have a nice night");
    // }
}
