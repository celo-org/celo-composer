import 'package:bloc_test/bloc_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_celo_composer/infrastructures/service/cubit/secure_storage_cubit.dart';
import 'package:flutter_celo_composer/infrastructures/service/cubit/web3_cubit.dart';
import 'package:flutter_celo_composer/module/auth/interfaces/screens/authentication_screen.dart';
import 'package:flutter_celo_composer/module/auth/service/cubit/auth_cubit.dart';
import 'package:flutter_celo_composer/test/main_test.dart';
import 'package:flutter_celo_composer/test/observer_tester.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';

class MockAuthCubit extends MockCubit<AuthState> implements AuthCubit {}

class MockSecureStorageCubit extends Mock implements SecureStorageCubit {}

class MockWalletConnect extends Mock implements WalletConnect {
  @override
  bool get connected => true;
}

class MockWeb3Cubit extends MockCubit<Web3State> implements Web3Cubit {}

void main() {
  late MockAuthCubit mockAuthCubit;
  late MockSecureStorageCubit mockSecureStorageCubit;
  late MockWeb3Cubit mockWeb3Cubit;

  final List<String> connectWalletOptions = <String>['Login with Metamask'];

  setUp(() {
    mockAuthCubit = MockAuthCubit();
    mockSecureStorageCubit = MockSecureStorageCubit();
    mockWeb3Cubit = MockWeb3Cubit();
  });
  Future<void> pumpWidget(
    WidgetTester tester, {
    NavigatorObserver? observer,
  }) async =>
      tester.pumpWidget(
        MultiBlocProvider(
          providers: <BlocProvider<dynamic>>[
            BlocProvider<AuthCubit>(
              create: (BuildContext context) => mockAuthCubit,
            ),
            BlocProvider<SecureStorageCubit>(
              create: (BuildContext context) => mockSecureStorageCubit,
            ),
            BlocProvider<Web3Cubit>(
              create: (BuildContext context) => mockWeb3Cubit,
            ),
          ],
          child: universalPumper(
            const AuthenticationScreen(),
            observer: observer,
          ),
        ),
      );
  void listenStub() {
    when(() => mockAuthCubit.state).thenReturn(const AuthState());
    when(() => mockSecureStorageCubit.read(key: any(named: 'key')))
        .thenAnswer((_) async => '');
  }

  group('Authentication screen.', () {
    testWidgets(
        'If there is a previous connection it should navigate directly to home screen.',
        (WidgetTester tester) async {
      bool isNavigatedToHomeScreen = false;

      final TestObserver observer = TestObserver()
        ..onReplaced = (Route<dynamic>? route, Route<dynamic>? previousRoute) =>
            isNavigatedToHomeScreen = true;
      when(() => mockWeb3Cubit.state).thenReturn(const Web3State());

      whenListen(
        mockAuthCubit,
        Stream<AuthState>.fromIterable(<AuthState>[
          EstablishConnectionSuccess(
            connector: MockWalletConnect(),
            session: SessionStatus(
              chainId: 1,
              accounts: <String>[],
            ),
            uri: '',
          ),
        ]),
        initialState: const AuthState(),
      );

      await pumpWidget(
        tester,
        observer: observer,
      );
      await tester.pump();

      expect(isNavigatedToHomeScreen, isTrue);
    });

    testWidgets(
        'If there is no previous connection, there should be a login selection.',
        (WidgetTester tester) async {
      listenStub();

      await pumpWidget(tester);
      await tester.pumpAndSettle();

      for (String option in connectWalletOptions) {
        expect(find.text(option), findsOneWidget);
      }
    });
    testWidgets('Connect options should be clickable.',
        (WidgetTester tester) async {
      bool isTriggerLoginWithMetamask = false;
      listenStub();

      when(() => mockAuthCubit.loginWithMetamask())
          .thenAnswer((_) async => isTriggerLoginWithMetamask = true);

      await pumpWidget(tester);
      await tester.pumpAndSettle();

      for (String option in connectWalletOptions) {
        await tester.tap(find.text(option));
        await tester.pump();

        expect(isTriggerLoginWithMetamask, isTrue);
        verify(() => mockAuthCubit.loginWithMetamask()).called(1);
      }
    });
  });
}
