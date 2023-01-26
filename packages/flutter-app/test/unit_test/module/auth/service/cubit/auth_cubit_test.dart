import 'package:flutter_celo_composer/infrastructures/repository/secure_storage_repository.dart';
import 'package:flutter_celo_composer/module/auth/service/cubit/auth_cubit.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:walletconnect_dart/src/utils/event.dart';
import 'package:walletconnect_dart/src/utils/event_bus.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';

class MockSecureStorageRepository extends Mock
    implements SecureStorageRepository {}

class MockWalletConnect extends Mock implements WalletConnect {
  final EventBus eventBus = EventBus();
  @override
  void on<T>(String eventName, OnEvent<T> callback) {
    eventBus
        .on<Event<T>>()
        .where((Event<T> event) => event.name == eventName)
        .listen((Event<T> event) => callback(event.data));
  }
}

void main() {
  late MockSecureStorageRepository mockSecureStorageRepository;
  late MockWalletConnect mockWalletConnect;

  const List<String> accounts = <String>[];
  const int chainId = 1;

  setUp(() {
    mockSecureStorageRepository = MockSecureStorageRepository();
    mockWalletConnect = MockWalletConnect();
  });
  group('Auth cubit.', () {
    group('Initiate Listener', () {
      test(
          'On listen to Connect. Triggers write and emits EstablishConnectionSuccess.',
          () {
        when(() => mockWalletConnect.approveSession(
            accounts: accounts, chainId: chainId)).thenAnswer(
          (_) async => mockWalletConnect.eventBus.fire(
            Event<SessionStatus>(
              'connect',
              SessionStatus(
                chainId: chainId,
                accounts: accounts,
              ),
            ),
          ),
        );

        when(() => mockWalletConnect.connected).thenReturn(false);

        final AuthCubit cubit = AuthCubit(
          storage: mockSecureStorageRepository,
          connector: mockWalletConnect,
        );
        cubit.initiateListeners();
        mockWalletConnect.approveSession(accounts: accounts, chainId: chainId);

        cubit.stream.listen((AuthState state) {
          expect(state.runtimeType, EstablishConnectionSuccess);
        });
      });
      test(
          'On listen to Disconnect. Triggers write and emits SessionDisconnected.',
          () {
        when(() => mockWalletConnect.rejectSession()).thenAnswer((_) async =>
            mockWalletConnect.eventBus
                .fire(Event<String>('disconnect', 'Session Rejected')));
        when(() => mockWalletConnect.connected).thenReturn(false);

        final AuthCubit cubit = AuthCubit(
          storage: mockSecureStorageRepository,
          connector: mockWalletConnect,
        );
        cubit.initiateListeners();
        mockWalletConnect.rejectSession();

        cubit.stream.listen((AuthState state) {
          expect(state.runtimeType, SessionDisconnected);
        });
      });
    });

    group('loginWithMetamask.', () {
      test('On Successful login it should emit LoginWithMetamaskSuccess.', () {
        when(() => mockWalletConnect.connected).thenReturn(false);
        when(() => mockWalletConnect.bridgeConnected).thenReturn(false);

        when(() =>
            mockWalletConnect.createSession(
                chainId: any(named: 'chainId'),
                onDisplayUri: any(named: 'onDisplayUri'))).thenAnswer(
            (_) async => SessionStatus(accounts: accounts, chainId: chainId));

        final AuthCubit cubit = AuthCubit(
          storage: mockSecureStorageRepository,
          connector: mockWalletConnect,
        );
        cubit.loginWithMetamask();

        cubit.stream.listen((AuthState state) {
          expect(state.runtimeType, LoginWithMetamaskSuccess);
        });
      });
      test('On Failed login it should emit LoginWithMetamaskFailed.', () {
        when(() => mockWalletConnect.connected).thenReturn(false);
        when(() => mockWalletConnect.bridgeConnected).thenReturn(false);

        when(() => mockWalletConnect.createSession(
                chainId: any(named: 'chainId'),
                onDisplayUri: any(named: 'onDisplayUri')))
            .thenThrow('Something went wrong.');

        final AuthCubit cubit = AuthCubit(
          storage: mockSecureStorageRepository,
          connector: mockWalletConnect,
        );
        cubit.loginWithMetamask();

        cubit.stream.listen((AuthState state) {
          expect(state.runtimeType, LoginWithMetamaskFailed);
        });
      });
    });
  });
}
