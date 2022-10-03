// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import ".Common.sol";

/** @title

 */ 
interface IRouter is Common {
  enum FuncHandle { ADD, GET, PAY }
  enum Access { RESTRICTED, PERMITTED }

  // Transaction
  function deposit() external;
  function getFinance() external;
  function payback() external;
  function liquidate() external;

  // READ-ONLY
  function roundUp() external;
  function getQuorum() external view returns(uint8);
  function getCurrentPoolSize() external view returns(uint256);
  function getOwings() external view returns(uint256);
  function getCurrentGFer() external view returns (address);
  function getNextGFer() external view returns (address);
  function getPosition(address who) external view returns (uint8);
  function getStateDate() external returns(StateData memory)
  function supportedToken(address which) external view returns(bool);
  function addUser(address sysAddress) external payable;

  struct StateData {
    uint256 unitContribution;
    uint256 amountContributed;
    uint32 duration;
    uint8 picker;
    bool locker;
    Currency currency;
  }

  struct GetFinance {
    address current;
    address next;
  }
}