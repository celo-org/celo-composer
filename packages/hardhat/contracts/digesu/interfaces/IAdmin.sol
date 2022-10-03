// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import ".Common.sol";

/** @title

 */ 
interface IAdmin is Common {
  function createAccount() external payable returns (bool);
  function createBranchUpPublic(
    uint quorum, 
    uint cashOutPeriodPerHead, 
    string memory assetToUse,
    address asset)  returns (bool);
  function createBranchUpPrivate(addrees[] memory participants, uint cashOutPeriodPerHead, uint8 currencyToUse)  returns (bool);
  function deposit() external;
  function getFinance() external;
  function payback() external;
  function liquidate() external;

  ///@notice READ-ONLY
  function roundUp() external;
  function getQuorum() external view returns(uint8);
  function getCurrentPoolSize() external view returns(uint256);
  function getOwings() external view returns(uint256);
  function getCurrentGFer() external view returns (address);
  function getNextGFer() external view returns (address);
  function getPosition(address who) external view returns (uint8);
  function supportedToken(address which) external view returns(bool);
  function joinABand(uint96 poolId) external payable;

  // // Structs
  struct Pool{
   Data data;
   address[] systems;
   Miscellaneous otherData;
  }

  struct Data {
    address next;
    address asset;
    uint8 quorum;
    uint8 picker;
    uint8 allGh;
    uint16 collateralRatio;
    uint32 duration;
    uint unit;
    uint currentPoolValue;
    Mode mode;
    Currency currency;
  }

  // Platform commission in %
  struct Miscellaneous {
    uint8 platformRate;
    uint8 penaltyRate;
  }

  // // Errors
  error MaxParticipantsExceeded();
  error PoolFilled();
  event PoolCreated(uint96 poolId, uint8 position, address _msgSender());
  
}