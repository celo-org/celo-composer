// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SimpleProxyContract is Ownable {
    using SafeMath for uint256;
    IERC20 cont;
    address tokenAddress;
    address[] walletAddresses;

    event ReceivedToken(address _from, uint256 _tokens);
    event Distributed(address _owner, uint256 _token);
    event AddedMember(address _member);
    event SetERCToken(address token);

    function setTokenAddress(address _tokenAddress)
        external
        onlyOwner
        returns (bool)
    {
        assert(_tokenAddress != address(0));
        tokenAddress = _tokenAddress;
        cont = IERC20(_tokenAddress);
        emit SetERCToken(_tokenAddress);
        return true;
    }

    function setWalletMembers(address[] calldata members)
        external
        onlyOwner
        returns (bool)
    {
        for (uint256 i = 0; i < members.length; i++) {
            assert(members[i] != address(0));
            walletAddresses.push(members[i]);
            emit AddedMember(members[i]);
        }
        return true;
    }

    function sendTokens(address _from, uint256 tokens)
        external
        payable
        returns (bool)
    {
        uint256 split;
        assert(walletAddresses.length > 0);
        assert(tokenAddress != address(0));
        //if(tokens < walletAddresses.length) throw;
        assert(tokens >= walletAddresses.length);

        if (cont.balanceOf(_from) < tokens) revert();

        split = tokens.div(walletAddresses.length);
        for (uint256 i = 0; i < walletAddresses.length; i++) {
            if (cont.transferFrom(_from, walletAddresses[i], split)) {
                emit Distributed(walletAddresses[i], split);
            }
        }
    }

    function balanceOf(address _account) external returns (uint256) {
        return cont.balanceOf(_account);
    }

    function addMember(address _account) external onlyOwner returns (bool) {
        assert(_account != address(0));
        walletAddresses.push(_account);
        emit AddedMember(_account);
        return true;
    }

    function totalMembers() external returns (uint256) {
        return walletAddresses.length;
    }

    function getTokenAddress() external returns (address) {
        return tokenAddress;
    }
}
