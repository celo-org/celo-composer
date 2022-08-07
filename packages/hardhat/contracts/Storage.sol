// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {
  event NewNumber(uint256 number, address sender);

  uint256 private _number = 1;

  /**
   * @dev Store value in variable
   * @param num value to store
   */
  function store(uint256 num) external {
    _number = num;
    emit NewNumber(num, msg.sender);
  }

  /**
   * @dev Return value
   * @return value of 'number'
   */
  function retrieve() public view returns (uint256) {
    return _number;
  }
}
