// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/finance/VestingWallet.sol";

contract SimpleVestingWallet is VestingWallet {
    constructor(address beneficiaryAddress, uint64 durationSeconds)
        VestingWallet(
            beneficiaryAddress,
            uint64(block.timestamp),
            uint64(durationSeconds)
        )
    {}

    function releaseToken() public virtual {
        require(checkExpiry(), "Expired!");
        release();
    }

    function checkExpiry() public view returns (bool success) {
        uint256 x = VestingWallet.start() + VestingWallet.duration();
        if (x >= uint256(block.timestamp)) {
            return true;
        } else {
            return false;
        }
    }
}
