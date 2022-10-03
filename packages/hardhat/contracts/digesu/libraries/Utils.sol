    // SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../token/IERC20.sol";
import "../interfaces/Params.sol";
import "./Address.sol";
import "../interfaces/ICommonParam.sol";
import "./SafeMath.sol";

library Utils {
    using SafeMath for uint256;

    ///@dev Requires the three conditions to be true
    function assertChained3(bool a, bool b, bool c, string memory errorMessage) internal pure {
        require(a && b && c, errorMessage);
    }

    ///@dev Requires the three conditions to be true
    function assertChained4(bool a, bool b, bool c, bool d, string memory errorMessage) internal pure {
        require(a && b && c && d, errorMessage);
    }

    ///@dev Requires the three conditions to be true 
    function assertChained2(bool a, bool b, string memory errorMessage) internal pure {
        require(a && b, errorMessage);
    }

    ///@dev Requires the three conditions to be true 
    function assertEither(bool a, bool b, string memory errorMessage) internal pure {
        require(a || b, errorMessage);
    }

    ///@dev Requires conditions to be true 
    function assertUnchained(bool condition, bool expected, string memory errorMessage) internal pure {
        if(condition != expected) revert (errorMessage);
        // require(condition, errorMessage);
    }

    ///@dev Requires conditions to be true 
    function assertNotUnchained(bool condition, string memory errorMessage) internal pure {
        require(!condition, errorMessage);
    }

    ///@dev Asserts condition is true, and the callback is executed
    function ifTrueCallBack(bool condition, function(uint64, address) internal callback, uint64 pid, address user) internal {
        if(condition) callback(pid, user);
    }

    // Simple arithmetic : Multiplication and division
    function mulDivOp(uint256 value, uint8 numerator) internal pure returns (uint) {
        if(value == 0 || numerator == 0) return 0; 
        return (value * numerator) / 100;
    }

    
    /**
        @dev Computes maker fee.
        @return MakerFee plus Amount. 
            Note : Maker rate must be in denomination of 1000 e.g 1010, 1100 etc.
        Example: 1015 = 1.5%. 1150 = 15%, 1500 = 150%.
    */
    function computeMakerFee(uint16 makerRate, uint amount) internal pure returns (uint _return) {
        _return = uint(makerRate).mul(10 ** 10).div(1000).mul(amount).div(10 ** 10).add(amount);
    }

    function assertPoolValue(uint currentPoolValue, uint unit, uint8 quorum) internal pure {
      bool(currentPoolValue >= (pool.data.unit * pool.data.quorum)).assertUnchained(true, "");
  }
}
  