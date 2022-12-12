//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";

// You can find more details about RedStone oracles here: https://tinyurl.com/redstone-celo-docs

/**
 * @title Oracle
 * @dev Read data from RedStone oracle protocol
 */
contract Oracle is MainDemoConsumerBase {
    /**
     * Returns the latest price of STX stocks
     */
    function getLatestCeloPrice() public view returns (uint256) {
        bytes32 dataFeedId = bytes32("CELO");
        return getOracleNumericValueFromTxMsg(dataFeedId);
    }
}
