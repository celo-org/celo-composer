import 'package:flutter/services.dart';
import 'package:flutter_celo_composer/internal/walletconnect_session_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:walletconnect_dart/walletconnect_dart.dart';
import 'package:web3dart/web3dart.dart';

/// Return a wallet connect object with a session storage, to persist the wallet session.
Future<WalletConnect> get walletConnect async {
  final WalletConnectSecureStorage sessionStorage =
      WalletConnectSecureStorage();
  WalletConnectSession? session = await sessionStorage.getSession();

  final WalletConnect walletConnect = WalletConnect(
    session: session,
    sessionStorage: sessionStorage,
    bridge: 'https://bridge.walletconnect.org',
    clientMeta: const PeerMeta(
      name: 'Celo Composer',
      description:
          'A Flutter template for building amazing decentralized applications.',
      url: 'https://github.com/celo-org/celo-composer',
      icons: <String>[
        'https://images.ctfassets.net/wr0no19kwov9/5yVbTScDuXaZE0JL0w1kL0/f626c00085927069b473e684148c36f3/Union_1_.svg'
      ],
    ),
  );

  return walletConnect;
}

/// Get deployed greeter contract
Future<DeployedContract> get deployedGreeterContract async {
  const String abiDirectory = 'lib/contracts/staging/greeter.abi.json';
  final String contractAddress = dotenv.get('GREETER_CONTRACT_ADDRESS');
  String contractABI = await rootBundle.loadString(abiDirectory);

  final DeployedContract contract = DeployedContract(
    ContractAbi.fromJson(contractABI, 'Greeter'),
    EthereumAddress.fromHex(contractAddress),
  );

  return contract;
}

/// Return web3client object.
Web3Client get web3Client {
  return Web3Client(
    dotenv.get('ETHEREUM_RPC'), // Goerli RPC URL
    http.Client(),
  );
}
