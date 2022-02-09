// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Token
///+interfaces
{
    // Allow SafeMath functions to be called for all uint256 types
    using SafeMath for uint256; 

    // Account used to deploy contract
    address private contractOwner;         

    string public name;
    string public symbol;
    uint256 public decimals;
    
    // Token balance for each address
    mapping(address => uint256) balances;              

    // Approval granted to transfer tokens by one address to another address                 
    mapping (address => mapping (address => uint256)) internal allowed; 

    // Tokens currently in circulation (you'll need to update this if you create more tokens)
    uint256 public total;                  

    // Tokens created when contract was deployed                             
    uint256 public initialSupply;         

    // Multiplier to convert to smallest unit                              
    uint256 public UNIT_MULTIPLIER;                                     

    constructor() {
        contractOwner = msg.sender;       

        name = "Token";             
        symbol = "TKN";           
        decimals = 18;     

        // // Multiplier to convert to smallest unit
        UNIT_MULTIPLIER = 10 ** uint256(decimals); 

        uint256 supply = 1000;       
        total = supply.mul(UNIT_MULTIPLIER);
        initialSupply = total;

        // // Assign entire initial supply to contract owner
        balances[contractOwner] = total;    
    }

    // Fired when an account authorizes another account to spend tokens on its behalf

    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Fired when tokens are transferred from one account to another
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
    * @dev Total supply of tokens
    */
    function totalSupply() external view returns (uint256) {
        return total;
    }

    /**
    * @dev Gets the balance of the calling address.
    *
    * @return An uint256 representing the amount owned by the calling address
    */
    function balance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    /**
    * @dev Gets the balance of the specified address.
    *
    * @param owner The address to query the balance of
    * @return An uint256 representing the amount owned by the passed address
    */
    function balanceOf(address owner) public view returns (uint256) {
        return balances[owner];
    }

    /**
    * @dev Transfers token for a specified address
    *
    * @param to The address to transfer to.
    * @param value The amount to be transferred.
    * @return A bool indicating if the transfer was successful.
    */
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0));
        require(to != msg.sender);
        require(value <= balanceOf(msg.sender));                                         

        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    /**
    * @dev Transfers tokens from one address to another
    *
    * @param from address The address which you want to send tokens from
    * @param to address The address which you want to transfer to
    * @param value uint256 the amount of tokens to be transferred
    * @return A bool indicating if the transfer was successful.
    */
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(from != address(0));
        require(value <= allowed[from][msg.sender]);
        require(value <= balanceOf(from));                                         
        require(to != address(0));
        require(from != to);

        balances[from] = balances[from].sub(value);
        balances[to] = balances[to].add(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        emit Transfer(from, to, value);
        return true;
    }

    /**
    * @dev Checks the amount of tokens that an owner allowed to a spender.
    *
    * @param owner address The address which owns the funds.
    * @param spender address The address which will spend the funds.
    * @return A uint256 specifying the amount of tokens still available for the spender.
    */
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowed[owner][spender];
    }

    /**
    * @dev Approves the passed address to spend the specified amount of tokens 
    *      on behalf of msg.sender.
    *
    * @param spender The address which will spend the funds.
    * @param value The amount of tokens to be spent.
    * @return A bool indicating success (always returns true)
    */
    function approve(address spender, uint256 value) public returns (bool) {
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
}   