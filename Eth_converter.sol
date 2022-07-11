// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed_eth_usd;
    AggregatorV3Interface internal priceFeed_btc_eth;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD BTC/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     * Address: 0xF7904a295A029a3aBDFFB6F12755974a958C7C25 
     */
    constructor() {
        priceFeed_eth_usd = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        priceFeed_btc_eth = AggregatorV3Interface(0xF7904a295A029a3aBDFFB6F12755974a958C7C25);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice_eth_usd() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed_eth_usd.latestRoundData();
        return price;
    }
    function getLatestPrice_btc_usd() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed_btc_eth.latestRoundData();
        return price;
    }

    function convertETH(uint _amount) public view returns(uint256){
        uint256 eth_price = uint256(getLatestPrice_eth_usd());
        uint256 eth_amount_usd = (eth_price * _amount);
        return eth_amount_usd;
    }
}
