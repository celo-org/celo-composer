// contracts/SupportToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice A simple ERC20 Token implementation that also accepts donation for the project
 */
contract SupportToken is ERC20 {
    uint sentIn;
    address payable owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC20("Support Token", "STT") {
        /// @notice mint 10000 tokens to the owner
        _mint(msg.sender, 10000e18);
        owner = payable(msg.sender);
        sentIn = 0;
    }

    function acceptDonation(uint amount)
        public
        payable
        returns (bool accepted)
    {
        require(amount == msg.value, "Invalid amount!");

        sentIn += msg.value;

        return true;
    }

    function withdrawChest() public onlyOwner returns (bool) {
        bool success = owner.send(address(this).balance);

        if (success) return true;

        return false;
    }
}
