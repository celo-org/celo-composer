// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Shop {
    address owner;
    uint public skuCount;

    enum State { ForSale, Sold, Shipped }

    struct Item {
        string name;
        uint sku;
        uint price;
        State state;
        address seller;
        address buyer;
    }

    mapping (uint => Item) items;

    event ForSale(uint skuCount);
    event Sold(uint sku);
    event Shipped(uint sku);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier verifyCaller(address _address) {
        require(msg.sender == _address);
        _;
    }

    modifier paidEnough(uint _price) {
        require(msg.value >= _price);
        _;
    }

    modifier forSale(uint _sku) {
        require(items[_sku].state == State.ForSale);
        _;
    }

    modifier sold(uint _sku) {
        require(items[_sku].state == State.Sold);
        _;
    }

    modifier checkValue(uint _sku) {
        _;
        uint _price = items[_sku].price;
        uint amountToRefund = msg.value - _price;
        payable(items[_sku].buyer).transfer(amountToRefund);
    }

    constructor() {
        owner = msg.sender;
        skuCount = 0;
    }

    function addItem(string memory _name, uint _price) public
        onlyOwner {
        skuCount = skuCount + 1;

        emit ForSale(skuCount);

        items[skuCount] = Item({
            name: _name,
            sku: skuCount,
            price: _price,
            state: State.ForSale,
            seller: msg.sender,
            buyer: address(0)
        });
    }

    function buyItem(uint sku) public payable
        forSale(sku)
        paidEnough(items[sku].price)
        checkValue(sku) {
        address buyer = msg.sender;
        uint price = items[sku].price;

        items[sku].buyer = buyer;
        items[sku].state = State.Sold;
        
        payable(items[sku].seller).transfer(price);

        emit Sold(sku);
    }

    function shipItem(uint sku) public
        sold(sku)
        verifyCaller(items[sku].seller) {
        items[sku].state = State.Shipped;

        emit Shipped(sku);
    }

    function fetchItem(uint _sku)
        public
        view
        returns (string memory name, uint sku, uint price, string memory stateIs, address seller, address buyer) {
        uint state;
        name = items[_sku].name;
        sku = items[_sku].sku;
        price = items[_sku].price;
        state = uint(items[_sku].state);

        if (state == 0) {
            stateIs = "For Sale";
        } else if (state == 1) {
            stateIs = "Sold";
        }

        seller = items[_sku].seller;
        buyer = items[_sku].buyer;
    }
}