import 'package:flutter/material.dart';
import 'package:flutter_web3/utils/simple_logger.dart';
import 'package:logger/logger.dart';

enum BlockchainFlavor {
  ropsten,
  rinkeby,
  ethMainNet,
  polygonMainNet,
  mumbai,
  unknown,
}

class GlobalConstants {
  static const String apiUrl = "https://forno.celo.org";
  static const String mainnetApiUrl = "https://forno.celo.org";
  static const String testnetApiUrl =
      "https://alfajores-forno.celo-testnet.org";
  static const String bridge = "https://bridge.walletconnect.org";
  static const String name = "Celo Composer - Flutter";
  static const String url = "https://celo.org";
  static const int chainId = 5;
  static const int testnetChainId = 44787;
  static const int mainnetChainId = 42220;
}

extension BlockchainFlavorExtention on BlockchainFlavor {
  static BlockchainFlavor fromChainId(int chainId) {
    switch (chainId) {
      case 80001:
        return BlockchainFlavor.mumbai;
      case 137:
        return BlockchainFlavor.polygonMainNet;
      case 3:
        return BlockchainFlavor.ropsten;
      case 4:
        return BlockchainFlavor.rinkeby;
      case 1:
        return BlockchainFlavor.ethMainNet;
      default:
        return BlockchainFlavor.unknown;
    }
  }
}

var logger = Logger(printer: SimpleLogPrinter(''));

class ColorConstants {
  static const Color whiteColor = Color(0xFFF5F5F5);
  static const Color lightScaffoldBackgroundColor = Color(0xFFF5F5F5);
  static const Color darkScaffoldBackgroundColor = Color(0xFF1D1D1D);

  static const Color primaryAppColor = Color(0xFF37CF7C);
  static const Color primaryBlackAppColor = Color(0xFF37CF7C);

  static const Color secondaryAppColor = Color(0xFFFACD5C);
  static const Color secondaryBlackAppColor = Color(0xFFFACD5C);
}
