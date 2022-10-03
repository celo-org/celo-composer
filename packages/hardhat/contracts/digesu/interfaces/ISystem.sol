// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Common.sol";

interface ISystem is Common {
  error UnAuthorizedCaller();
  error InsufficientFund();
  error WithdrawalRestricted();
  error UnsupportedToken();

  function updateStatus(uint96 poolId) external returns(bool);
  function setCurrency(Currency touse) external returns (bool);
  function depositNative() external payable;
  function depositERC20Token(address erc20Address, uint amount) external;
  function withdrawNative(uint amount, address to) external;
  function getSubscriptionInfo(uint96 poolId) external view returns(Info memory);  
  function updatedWithdrawAllowance(CanWithdraw signal, bool value) external;
  function checkIfPreRegistered(uint96 poolId) external view returns(bool);
  function setPreRegistration(uint96 poolId) external returns(bool);
  function setTurntime(uint96 poolId, uint32 newTime) external;
  function setSubscrpition(uint96 poolId, Info memory info, Mode mode) external;
  function setWithdrawApproval(Currency _currency, bool value) external;
  function updatePositionAndTurn(uint96 poolId, uint8 position, uint32 turnTime) external;
  function updateStatus(uint96 poolId, bool isMember) external;

}
