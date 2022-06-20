import 'dart:io';
import 'dart:typed_data';

import 'package:url_launcher/url_launcher.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';
import 'package:web3dart/src/crypto/secp256k1.dart';
import 'package:web3dart/web3dart.dart';

class CustomCredentials implements CustomTransactionSender {
  final WalletConnect walletConnect;

  CustomCredentials(this.walletConnect);

  @override
  Future<EthereumAddress> extractAddress() async {
    EthereumAddress address =
        EthereumAddress.fromHex(walletConnect.session.accounts[0]);
    return address;
  }

  @override
  bool get isolateSafe => throw UnimplementedError();

  @override
  Future<Uint8List> sign(Uint8List payload,
      {int? chainId, bool isEIP1559 = false}) {
    // TODO: implement sign
    throw UnimplementedError();
  }

  @override
  Future<Uint8List> signPersonalMessage(Uint8List payload, {int? chainId}) {
    // TODO: implement signPersonalMessage
    throw UnimplementedError();
  }

  @override
  Future<String> sendTransaction(Transaction transaction) async {
    String walletConnectTopicVersion =
        'wc:${walletConnect.session.handshakeTopic}@${walletConnect.session.version}';
    String walletConnectUri = '';

    // Android OS helps the user choose their wallet
    walletConnectUri = walletConnectTopicVersion;

    bool result = await launchUrl(Uri.parse(walletConnectUri),
        mode: LaunchMode.externalApplication);
    if (result == false) {
      // Application specific link didn't work, so we may redirect to the app store to get a wallet
      result = await launchUrl(Uri.parse(walletConnectUri));
      if (result == false) {
        print('Could not launch $walletConnectUri');
      }
    }
    sleep(const Duration(milliseconds: 5000));
    dynamic requestResult = await walletConnect.sendCustomRequest(
      method: "eth_sendTransaction",
      params: <dynamic>[
        {
          "from":
              EthereumAddress.fromHex(walletConnect.session.accounts[0]).hex,
          "to": "0x916E1b5b57DCE7F2f11085a2d259a5D562dc7295",
          "value":
              transaction.value!.getInWei.toRadixString(16), // 2441406250 279
        }
      ],
    );
    return "";
  }

  @override
  Future<MsgSignature> signToSignature(Uint8List payload,
      {int? chainId, bool isEIP1559 = false}) {
    // TODO: implement signToSignature
    throw UnimplementedError();
  }
}
