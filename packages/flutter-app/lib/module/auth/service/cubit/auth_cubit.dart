import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_celo_composer/infrastructures/repository/interfaces/secure_storage_repository.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';

part 'auth_state.dart';

class AuthCubit extends Cubit<AuthState> {
  AuthCubit({required this.storage, required this.connector})
      : super(const AuthState());
  final ISecureStorageRepository storage;
  final WalletConnect connector;
  // ignore: unused_field
  dynamic _session;
  String walletConnectURI = '';

  void initiateListeners() {
    if (connector.connected) {
      emit(
        EstablishConnectionSuccess(
          session: SessionStatus(
              accounts: connector.session.accounts,
              chainId: connector.session.chainId),
          connector: connector,
          uri: connector.session.toUri(),
        ),
      );
      return;
    }
    connector.on('connect', (Object? session) async {
      emit(EstablishConnectionSuccess(
          session: session, connector: connector, uri: walletConnectURI));
    });
    connector.on('session_update', (Object? session) {
      _session = session;
    });
    connector.on('disconnect', (_) async {
      emit(SessionDisconnected());
    });
  }

  Future<void> loginWithMetamask() async {
    if (!connector.bridgeConnected) {
      connector.reconnect();
    }
    if (!connector.connected) {
      try {
        SessionStatus session =
            await connector.createSession(onDisplayUri: (String uri) async {
          walletConnectURI = uri;
          emit(LoginWithMetamaskSuccess(url: uri));
        });
        _session = session;
      } catch (e) {
        emit(LoginWithMetamaskFailed(errorCode: '', message: e.toString()));
      }
    }
  }
}
