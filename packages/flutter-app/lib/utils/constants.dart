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
  static Color whiteColor = const Color(0xFFF5F5F5);
  static Color lightScaffoldBackgroundColor = const Color(0xFFF5F5F5);
  static Color darkScaffoldBackgroundColor = const Color(0xFF1D1D1D);

  static Color primaryAppColor = const Color(0xFF37CF7C);
  static Color primaryBlackAppColor = const Color(0xFF37CF7C);

  static Color secondaryAppColor = const Color(0xFFFACD5C);
  static Color secondaryBlackAppColor = const Color(0xFFFACD5C);
}
