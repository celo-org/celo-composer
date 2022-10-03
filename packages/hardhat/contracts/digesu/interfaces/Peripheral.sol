// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Params.sol";

interface Peripherals is Params  {
  // Functions circuit breaker
  enum FunTag { ADD, GET, PAYBACK, COMPLETE }

  enum TokenSelector { USDT, BUSD }
  //Function statuses 
  enum Status { LOCKED, OPEN }

  /**
    Band Mode:
      NONSTRICT -> Public band.
      STRICT -> Private band.
  */
  enum Mode { NONSTRICT, STRICT }

  //Member data
  struct Member {
    Get get;
    Post post;
  }

  /**
    Band information
  */
  struct Pool {
    Uints uints;
    Uint256s uint256s;
    Addresses addrs;
    Member[50] mems;
    uint8 allGh;
  }

  struct P2 {
    uint64 pid;
    uint256 value;
    address newUser;
  }

  struct P3 {
    address gh;
    uint8 position;
    uint64 poolId;
    uint256 owings;
    uint256 colBal;
  }
  
  struct Uint256s {
    uint256 unit;
    uint256 receivable;
    uint256 currentPool;
    uint256 tokenPrice;
  }

  struct Uints {
    Mode mode;
    uint8 quorum;
    uint8 tracker;
    uint16 ccr; // colCoverageRatio
    uint32 duration;
  }
  
  struct Addresses {
    address creator;
    address trustee;
    address currentPaid;
  }

  struct Get {
    uint32 erp;
    uint32 turnTime;
    uint256 colBals;
    uint256 owings;
  }

  struct Post {
    bool hasGH;
    address addr;
  }

  struct MemData {
    uint8 expPos;
    uint8 actPos;
    uint64 pid;
    uint owings;
    address who;
    uint ret1;
    Member expected;
    Member actual;
  }

  // For dormant pools
  struct Dormant {
    address[50][] addrHistory;
    address trustee;
    uint64 poolId;
  }

  // Public state variables;
  struct PublicData {
    address feeTo;
    address token;
    uint8 penFee;
    uint8 makerFee;
    uint64 dormant;
  }
}