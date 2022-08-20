// Generated code, do not modify. Run `build_runner build` to re-generate!
// @dart=2.12
import 'dart:typed_data' as i2;

import 'package:web3dart/web3dart.dart' as i1;

final _contractAbi = i1.ContractAbi.fromJson(
    '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256[]","name":"_tokenList","type":"uint256[]"}],"name":"checkOwnerOfTokenList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
    'Stream_chicken_2');

class StreamChicken2Contract extends i1.GeneratedContract {
  StreamChicken2Contract({required i1.EthereumAddress address, required i1.Web3Client client, int? chainId})
      : super(i1.DeployedContract(_contractAbi, address), client, chainId);

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> approve(i1.EthereumAddress to, BigInt tokenId,
      {required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[1];
    assert(checkSignature(function, '095ea7b3'));
    final params = [to, tokenId];
    return write(credentials, transaction, function, params);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<BigInt> balanceOf(i1.EthereumAddress owner, {i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[2];
    assert(checkSignature(function, '70a08231'));
    final params = [owner];
    final response = await read(function, params, atBlock);
    return (response[0] as BigInt);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<bool> checkOwnerOfTokenList(i1.EthereumAddress owner, List<BigInt> _tokenList,
      {i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[3];
    assert(checkSignature(function, 'dcfd284c'));
    final params = [owner, _tokenList];
    final response = await read(function, params, atBlock);
    return (response[0] as bool);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<i1.EthereumAddress> getApproved(BigInt tokenId, {i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[4];
    assert(checkSignature(function, '081812fc'));
    final params = [tokenId];
    final response = await read(function, params, atBlock);
    return (response[0] as i1.EthereumAddress);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<bool> isApprovedForAll(i1.EthereumAddress owner, i1.EthereumAddress operator,
      {i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[5];
    assert(checkSignature(function, 'e985e9c5'));
    final params = [owner, operator];
    final response = await read(function, params, atBlock);
    return (response[0] as bool);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<String> name({i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[6];
    assert(checkSignature(function, '06fdde03'));
    final params = [];
    final response = await read(function, params, atBlock);
    return (response[0] as String);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<i1.EthereumAddress> owner({i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[7];
    assert(checkSignature(function, '8da5cb5b'));
    final params = [];
    final response = await read(function, params, atBlock);
    return (response[0] as i1.EthereumAddress);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<i1.EthereumAddress> ownerOf(BigInt tokenId, {i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[8];
    assert(checkSignature(function, '6352211e'));
    final params = [tokenId];
    final response = await read(function, params, atBlock);
    return (response[0] as i1.EthereumAddress);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> renounceOwnership({required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[9];
    assert(checkSignature(function, '715018a6'));
    final params = [];
    return write(credentials, transaction, function, params);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> safeMint(i1.EthereumAddress to, String uri,
      {required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[10];
    assert(checkSignature(function, 'd204c45e'));
    final params = [to, uri];
    return write(credentials, transaction, function, params);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> safeTransferFrom(i1.EthereumAddress from, i1.EthereumAddress to, BigInt tokenId,
      {required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[11];
    assert(checkSignature(function, '42842e0e'));
    final params = [from, to, tokenId];
    return write(credentials, transaction, function, params);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> safeTransferFrom$2(
      i1.EthereumAddress from, i1.EthereumAddress to, BigInt tokenId, i2.Uint8List _data,
      {required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[12];
    assert(checkSignature(function, 'b88d4fde'));
    final params = [from, to, tokenId, _data];
    return write(credentials, transaction, function, params);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> setApprovalForAll(i1.EthereumAddress operator, bool approved,
      {required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[13];
    assert(checkSignature(function, 'a22cb465'));
    final params = [operator, approved];
    return write(credentials, transaction, function, params);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<bool> supportsInterface(i2.Uint8List interfaceId, {i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[14];
    assert(checkSignature(function, '01ffc9a7'));
    final params = [interfaceId];
    final response = await read(function, params, atBlock);
    return (response[0] as bool);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<String> symbol({i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[15];
    assert(checkSignature(function, '95d89b41'));
    final params = [];
    final response = await read(function, params, atBlock);
    return (response[0] as String);
  }

  /// The optional [atBlock] parameter can be used to view historical data. When
  /// set, the function will be evaluated in the specified block. By default, the
  /// latest on-chain block will be used.
  Future<String> tokenURI(BigInt tokenId, {i1.BlockNum? atBlock}) async {
    final function = self.abi.functions[16];
    assert(checkSignature(function, 'c87b56dd'));
    final params = [tokenId];
    final response = await read(function, params, atBlock);
    return (response[0] as String);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> transferFrom(i1.EthereumAddress from, i1.EthereumAddress to, BigInt tokenId,
      {required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[17];
    assert(checkSignature(function, '23b872dd'));
    final params = [from, to, tokenId];
    return write(credentials, transaction, function, params);
  }

  /// The optional [transaction] parameter can be used to override parameters
  /// like the gas price, nonce and max gas. The `data` and `to` fields will be
  /// set by the contract.
  Future<String> transferOwnership(i1.EthereumAddress newOwner,
      {required i1.Credentials credentials, i1.Transaction? transaction}) async {
    final function = self.abi.functions[18];
    assert(checkSignature(function, 'f2fde38b'));
    final params = [newOwner];
    return write(credentials, transaction, function, params);
  }

  /// Returns a live stream of all Approval events emitted by this contract.
  Stream<Approval> approvalEvents({i1.BlockNum? fromBlock, i1.BlockNum? toBlock}) {
    final event = self.event('Approval');
    final filter = i1.FilterOptions.events(contract: self, event: event, fromBlock: fromBlock, toBlock: toBlock);
    return client.events(filter).map((i1.FilterEvent result) {
      final decoded = event.decodeResults(result.topics!, result.data!);
      return Approval(decoded);
    });
  }

  /// Returns a live stream of all ApprovalForAll events emitted by this contract.
  Stream<ApprovalForAll> approvalForAllEvents({i1.BlockNum? fromBlock, i1.BlockNum? toBlock}) {
    final event = self.event('ApprovalForAll');
    final filter = i1.FilterOptions.events(contract: self, event: event, fromBlock: fromBlock, toBlock: toBlock);
    return client.events(filter).map((i1.FilterEvent result) {
      final decoded = event.decodeResults(result.topics!, result.data!);
      return ApprovalForAll(decoded);
    });
  }

  /// Returns a live stream of all OwnershipTransferred events emitted by this contract.
  Stream<OwnershipTransferred> ownershipTransferredEvents({i1.BlockNum? fromBlock, i1.BlockNum? toBlock}) {
    final event = self.event('OwnershipTransferred');
    final filter = i1.FilterOptions.events(contract: self, event: event, fromBlock: fromBlock, toBlock: toBlock);
    return client.events(filter).map((i1.FilterEvent result) {
      final decoded = event.decodeResults(result.topics!, result.data!);
      return OwnershipTransferred(decoded);
    });
  }

  /// Returns a live stream of all Transfer events emitted by this contract.
  Stream<Transfer> transferEvents({i1.BlockNum? fromBlock, i1.BlockNum? toBlock}) {
    final event = self.event('Transfer');
    final filter = i1.FilterOptions.events(contract: self, event: event, fromBlock: fromBlock, toBlock: toBlock);
    return client.events(filter).map((i1.FilterEvent result) {
      final decoded = event.decodeResults(result.topics!, result.data!);
      return Transfer(decoded);
    });
  }
}

class Approval {
  Approval(List<dynamic> response)
      : owner = (response[0] as i1.EthereumAddress),
        approved = (response[1] as i1.EthereumAddress),
        tokenId = (response[2] as BigInt);

  final i1.EthereumAddress owner;

  final i1.EthereumAddress approved;

  final BigInt tokenId;
}

class ApprovalForAll {
  ApprovalForAll(List<dynamic> response)
      : owner = (response[0] as i1.EthereumAddress),
        operator = (response[1] as i1.EthereumAddress),
        approved = (response[2] as bool);

  final i1.EthereumAddress owner;

  final i1.EthereumAddress operator;

  final bool approved;
}

class OwnershipTransferred {
  OwnershipTransferred(List<dynamic> response)
      : previousOwner = (response[0] as i1.EthereumAddress),
        newOwner = (response[1] as i1.EthereumAddress);

  final i1.EthereumAddress previousOwner;

  final i1.EthereumAddress newOwner;
}

class Transfer {
  Transfer(List<dynamic> response)
      : from = (response[0] as i1.EthereumAddress),
        to = (response[1] as i1.EthereumAddress),
        tokenId = (response[2] as BigInt);

  final i1.EthereumAddress from;

  final i1.EthereumAddress to;

  final BigInt tokenId;
}