//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// currently it only works with node v16
import "redstone-evm-connector/lib/contracts/message-based/PriceAware.sol";

// You can find more details about RedStone oracles here: https://tinyurl.com/redstone-celo-docs

/**
 * @title Oracle
 * @dev Read data from RedStone oracle protocol
 */
contract Oracle is PriceAware {
    /**
     * @dev Calculates amount of CELO tokens equal to a given USD amount
     * @return amount of CELO tokens corresponding to a given USD amount
     */
    function getCELOAmountForUSDAmount(uint256 usdAmount)
        public
        view
        returns (uint256)
    {
        // You can use `getPriceFromMsg` in non-view contract functions as well
        // But you always need to wrap your ethers.js contract instance using RedStone wrapper
        // in your JS interface
        uint256 celoPrice = getPriceFromMsg(bytes32("CELO"));
        return (usdAmount * (10**8)) / celoPrice;
    }

    function isSignerAuthorized(address _receviedSigner)
        public
        view
        virtual
        override
        returns (bool)
    {
        // You can check check evm addresses for providers at: https://api.redstone.finance/providers
        return _receviedSigner == 0x0C39486f770B26F5527BBBf942726537986Cd7eb; // redstone main demo provider
    }
}
