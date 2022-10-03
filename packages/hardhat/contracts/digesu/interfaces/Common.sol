// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface Common {
  enum Currency { NATIVE, ERC20 }
  enum Mode { PUBLIC, PRIVATE }
  
  struct Info {
    uint8 position;
    uint32 expectedRepaymentDate;
    uint32 turnTime;
    uint256 owings;
    uint256 reward;
    uint256 share;
    bool isAdmin;
    bool isMember;
    Other other;
  }

  struct Other {
    Currency inuse;
    uint commission;
  } 
}
