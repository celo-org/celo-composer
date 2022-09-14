import 'dart:math';

import 'package:eip55/eip55.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web3/model/app_info.dart';
import 'package:flutter_web3/utils/helper.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';

class WalletController extends ChangeNotifier {
  bool balRefresh = false;
  int bottomNavbarIndex = 0;

  EtherAmount bal = EtherAmount.fromUnitAndValue(EtherUnit.wei, 0);

  final WalletConnectHelper walletConnectHelper = WalletConnectHelper(
    bridge: GlobalConstants.bridge,
    appInfo: AppInfo(
      name: GlobalConstants.name,
      description: GlobalConstants.name,
      url: GlobalConstants.url,
    ),
  );

  late Web3Client web3client;
  //late StreamChicken2Contract contract;

  bool isConnectWallet = false;
  String? publicWalletAddress;

  void connectWallet(context) async {
    isConnectWallet =
        await walletConnectHelper.initSession(context, chainId: 42220);
    if (isConnectWallet) {
      publicWalletAddress = walletConnectHelper
          .getEthereumCredentials()
          .getEthereumAddress()
          .toString();
      publicWalletAddress = toEIP55Address(publicWalletAddress!);

      // Init web3client
      initWeb3Client();

      // get Balance
      await getBalance();

      // Init contract
      //initContract();

      // Update ui
      notifyListeners();
    }
  }

  void updateBottomNavbarIndex(int value) {
    bottomNavbarIndex = value;
    notifyListeners();
  }

  // Disconnet wallet
  void disconnectWallet() {
    walletConnectHelper.dispose();
    isConnectWallet = false;
    publicWalletAddress = null;
    bottomNavbarIndex = 0;
    notifyListeners();
  }

  void initWeb3Client() {
    web3client = Web3Client(GlobalConstants.apiUrl, Client());
  }

  Future getBalance() async {
    var address =
        await walletConnectHelper.getEthereumCredentials().extractAddress();
    bal = await web3client.getBalance(address);
    notifyListeners();
  }

  // Send token
  Future<String> sendToken(String toAddress, String amount) async {
    final txBytes = await sendTransaction(toAddress, amount);
    return txBytes;
  }

  Future<String> sendTransaction(String toAddress, String amount) async {
    final transaction = Transaction(
      to: EthereumAddress.fromHex(toAddress),
      from: EthereumAddress.fromHex(publicWalletAddress!),
      value: EtherAmount.fromUnitAndValue(
        EtherUnit.wei,
        BigInt.from(double.parse(amount) * pow(10, 18)),
      ),
    );
    Credentials cred = walletConnectHelper.getEthereumCredentials();

    final txBytes = await web3client.sendTransaction(cred, transaction);
    return txBytes;
  }
}
