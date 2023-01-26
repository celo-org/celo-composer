import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_celo_composer/internal/ethereum_credentials.dart';
import 'package:flutter_celo_composer/internal/web3_contract.dart';
import 'package:flutter_celo_composer/internal/web3_utils.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';
import 'package:web3dart/web3dart.dart';

part 'web3_state.dart';

class Web3Cubit extends Cubit<Web3State> {
  Web3Cubit({
    required this.web3Client,
    required this.greeterContract,
  }) : super(const Web3State());

  // core declarations
  final Web3Client web3Client;
  final DeployedContract greeterContract;
  late String sender;
  late SessionStatus sessionStatus;
  late EthereumWalletConnectProvider provider;
  late WalletConnect walletConnector;
  late WalletConnectEthereumCredentials wcCredentials;

  // contract-specific declarations
  late Timer fetchGreetingTimer;

  /// Terminates metamask, provider, contract connections
  void closeConnection() {
    fetchGreetingTimer.cancel();
    walletConnector.killSession();
    walletConnector.close();

    emit(SessionTerminated());
  }

  /// Initialize provider provided by [session] and [connector]
  void initializeProvider({
    required WalletConnect connector,
    required SessionStatus session,
  }) {
    walletConnector = connector;
    sessionStatus = session;
    sender = connector.session.accounts[0];
    provider = EthereumWalletConnectProvider(connector);
    wcCredentials = WalletConnectEthereumCredentials(provider: provider);

    /// periodically fetch greeting from chain
    fetchGreetingTimer =
        Timer.periodic(const Duration(seconds: 5), (_) => fetchGreeting());
    emit(InitializeProviderSuccess(
        accountAddress: sender, networkName: getNetworkName(session.chainId)));
  }

  /// Greeter contract

  /// Get greeting from
  Future<void> fetchGreeting() async {
    try {
      List<dynamic> response = await web3Client.call(
        contract: greeterContract,
        function: greeterContract.function(greetFunction),
        params: <dynamic>[],
      );
      emit(FetchGreetingSuccess(message: response[0]));
    } catch (e) {
      emit(FetchGreetingFailed(errorCode: '', message: e.toString()));
    }
  }

  /// Update greeter contract with provided [text]
  Future<void> updateGreeting(String text) async {
    emit(UpdateGreetingLoading());
    try {
      String txnHash = await web3Client.sendTransaction(
        wcCredentials,
        Transaction.callContract(
          contract: greeterContract,
          function: greeterContract.function(setGreetingFunction),
          from: EthereumAddress.fromHex(sender),
          parameters: <String>[text],
        ),
        chainId: sessionStatus.chainId,
      );

      late Timer txnTimer;
      txnTimer = Timer.periodic(
          Duration(milliseconds: getBlockTime(sessionStatus.chainId)),
          (_) async {
        TransactionReceipt? t = await web3Client.getTransactionReceipt(txnHash);
        if (t != null) {
          emit(const UpdateGreetingSuccess());
          fetchGreeting();
          txnTimer.cancel();
        }
      });
    } catch (e) {
      emit(UpdateGreetingFailed(errorCode: '', message: e.toString()));
    }
  }

  /// TODO: <another> contract
  /// You can add and specify more contracts here
}
