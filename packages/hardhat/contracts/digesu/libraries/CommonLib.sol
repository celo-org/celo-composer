// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SafeMath.sol";
import "../../token/ICustom.sol";
import "../../token/IERC20.sol";

library CommonLib {
  using SafeMath for uint256;

  function notZeroAddress(address any) internal pure {
    require(any != address(0), "Any is zero address");
  }

  function notZeroAddress(address any) internal pure {
    require(any != address(0), "Any is zero address");
  }

  function shouldbeGreaterThan(uint256 actual, uint256 expected) internal pure {
    require(actual > expected, "Bad value");
  }


  function requireConditionIsTrue(bool condition, string memory errorMessasge) internal pure { require(condition, errorMessasge); }

  function addUint8(uint8 a, uint8 b) internal pure returns (uint8 _return) {
    unchecked {
      _return = a + b;
    }
  }

  function addUint256(uint a, uint b) internal pure returns (uint256 _return) {
    unchecked {
      _return = a + b;
    }
  }

  function addUint32(uint32 a, uint32 b) internal pure returns (uint32 _return) {
    unchecked {
      _return = a + b;
    }
  }

  function mulUint256(uint a, uint b) internal pure returns (uint256 _return) {
    unchecked {
      _return = a * b;
    }
  }

  /**
    @dev Computes platform fee.
    @return (MakerFee plus Amount, Amount to payback). 
      Note : Maker rate must be in denomination of 1000 e.g 1010, 1100 etc.
    Example: 1015 = 1.5%. 1150 = 15%, 1500 = 150% and so on.
  */
  function computeMakerFeeWithPaybackValue(uint8 rate, uint principal) internal pure returns (uint comm, uint payback) {
    comm = uint(rate).mul(10 ** 10).div(1000).mul(principal).div(10 ** 10);
    payback = comm.add(principal);
  }

  // Simple arithmetic : Multiplication and division
    function mulDivOp(uint256 value, uint8 numerator) internal pure returns (uint) {
      if(value == 0 || numerator == 0) return 0; 
      return (value * numerator) / 100;
    }
    
    // Enquire and return the collateral balances of `who` in QFT.
    function getCollateralBalance(address token, address who) internal view returns(uint256) {
      ICustom.AccountBalances memory acc = ICustom(token).accountBalances(who);

      return acc.spendable;
    }

    ///@dev Checks allowance from user `p1.from`
    function checkApproval(address token, address from, address to, uint256 amount) internal view returns(uint accepted) {
      uint approval = IERC20(token).allowance(from, to);
      require(approval >= amount, "Insufficient approval");
      accepted = approval;
    }

    ///@dev Withdraws allowance from user `p1.from`
    function checkAndApproveDeposit(address token, address from, address to, uint256 expected) internal returns (uint done) {
      expected = checkApproval(token, from, to, expected);
      IERC20(p1.token).transferFrom(p1.from, to, expected);
      done = expected;
    }

    ///@dev transfer Assets
    function transferAsset(address token, address to, uint256 amount) internal {
      IERC20(token).transfer(to, amount);
    }

    // Restricts `who` from moving token of amount `amount`
    function lockCollateral(address token, address target, uint amount) internal {
      ICustom(token).lockFor(target, amount);
    }

    // Restricts `who` from moving token of amount `amount`
    function unlockCollateral(ICommonParam.Param memory param, address token) internal {
      ICustom(token).unlockFor(param);
    }

    /** 
        Reward calculator
        ================
        o CA = User's contributed amount.
        o TC = Total contribution at the time of call.
        o TS = Total subscribers.
        o ERD = Expected repayment duration (in days).

        Reward = CA.div(TC).mul(TS).mul(ERD)
    
     */
    function computeReward(ICommonParam.Param memory param, ICommonParam.CR2 memory param2) internal pure returns (uint reward) {
      uint mantissa = 10**10;
      reward = param2.valueContributed.mul(mantissa).div(totalValueContributed).mul(subscribers).mul(param2.erd).div(mantissa);
    }

    // Restricts `who` from moving token of amount `amount`
    function moveCollateral(ICommonParam.MC memory param) internal {
      ICustom(token).unlockAndTransfer(param);
    }

    // Compute and return collateral value
    function computeCollateral(ICommonParam.CC memory param) internal returns (uint) {
        uint discAssetValueInETH;
        uint256 discAssetValueInToken = getCollateralBalance(ICommonParam.GCB(token, who, address(0), 0, 0, Params.CR(0, 0), Params.CR2(0, 0)));
        discAssetValueInETH = discAssetValueInToken * assetPriceInETH;
        assertUnchained(discAssetValueInETH >= loanValueInETH, "Insufficient Collateral");
        discAssetValueInToken = loanValueInETH / assetPriceInETH;
        uint ccr = (discAssetValueInETH * 100) / loanValueInETH;
        assertUnchained(ccr >= expectedCcr, "Ratio is low");
        lockCollateral(Params.GCB(token, who, address(0), discAssetValueInToken, 0, Params.CR(0, 0), Params.CR2(0, 0)));
        
        return discAssetValueInToken;
        // return Params.Return1(discAssetValueInETH, discAssetValueInToken, ccr);
    }

    ///@dev Distributes capital to all members, clears trustee.
    function _clearTrustee(address trustee, address[50] memory addresses)internal {
        Address.functionCall(trustee, abi.encodeWithSelector(bytes4(keccak256(bytes("distribute(address[])"))), addresses));
    }

}