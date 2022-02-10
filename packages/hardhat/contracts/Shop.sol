// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Shop {

    // Account used to deploy contract
    address owner;

    // Possible states for each item
    uint public skuCount;

    // Possible states for each item
    enum State { ForSale, Sold, Shipped }

    // Definition for items in the shop
    struct Item {
        string name;
        uint sku;
        uint price;
        State state;
        address seller;
        address buyer;
    }

    // Assigns uint for each item
    mapping (uint => Item) items;

    // Fired when the owner adds an item to the shop
    event ForSale(uint skuCount);
    
    // Fired when a buyer purchases an item in the shop
    event Sold(uint sku);
    
    // Fired when the owner ships an item to the buyer
    event Shipped(uint sku);

    // Checks that the caller is the owner of the shop
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Verifies that the caller is the owner of the address
    modifier verifyCaller(address _address) {
        require(msg.sender == _address);
        _;
    }

    // Checks that the buyer paid the correct amount for an item
    modifier paidEnough(uint _price) {
        require(msg.value >= _price);
        _;
    }

    // Checks that an item is for sale
    modifier forSale(uint _sku) {
        require(items[_sku].state == State.ForSale);
        _;
    }

    // Checks whether an item has been sold
    modifier sold(uint _sku) {
        require(items[_sku].state == State.Sold);
        _;
    }

    // Checks the value of an item
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

    /**
    * @dev Adds an item to the shop directory
    *
    * @param _name The name of the item in the shop
    * @param _price The price of the item in the shop
    */

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

    /**
    * @dev Purchases an item from the shop
    *
    * @param sku SKU of the item in the shop
    */

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

    /**
    * @dev Ships item to the buyer
    *
    * @param sku SKU of the item in the shop 
    */

    function shipItem(uint sku) public
        sold(sku)
        verifyCaller(items[sku].seller) {
        items[sku].state = State.Shipped;

        emit Shipped(sku);
    }

    /**
    * @dev View item details from a given SKU 
    *
    * @param sku SKU of the item in the shop 
    * @return A array containing the name, sku, price, state, seller, and buyer of the item
    */

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