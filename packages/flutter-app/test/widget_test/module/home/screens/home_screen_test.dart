import 'package:bloc_test/bloc_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_celo_composer/infrastructures/service/cubit/web3_cubit.dart';
import 'package:flutter_celo_composer/internal/web3_utils.dart';
import 'package:flutter_celo_composer/module/home/interfaces/screens/home_screen.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';

class MockWeb3Cubit extends MockCubit<Web3State> implements Web3Cubit {}

class MockWalletConnect extends Mock implements WalletConnect {}

void main() {
  late MockWeb3Cubit mockWeb3Cubit;
  late MockWalletConnect mockWalletConnect;

  setUp(() {
    mockWeb3Cubit = MockWeb3Cubit();
    mockWalletConnect = MockWalletConnect();
  });

  Future<void> pumpWidget(WidgetTester tester) async => tester.pumpWidget(
        MaterialApp(
          home: BlocProvider<Web3Cubit>(
            create: (BuildContext context) => mockWeb3Cubit,
            child: HomeScreen(
              connector: mockWalletConnect,
              session: SessionStatus(
                accounts: <String>[],
                chainId: 1,
              ),
              uri: '',
            ),
          ),
        ),
      );
  group('Home Screen.', () {
    group('Header Content.', () {
      const String accountAddress = 'xxxxxxxxxx';
      const int chainId = 5;
      testWidgets('Account address should be visible.',
          (WidgetTester tester) async {
        when(() => mockWeb3Cubit.state).thenReturn(const Web3State());
        whenListen(
          mockWeb3Cubit,
          Stream<Web3State>.fromIterable(
            <Web3State>[
              InitializeProviderSuccess(
                accountAddress: accountAddress,
                networkName: getNetworkName(chainId),
              )
            ],
          ),
        );
        await pumpWidget(tester);
        await tester.pump();

        expect(find.textContaining('Account Address'), findsOneWidget);
        expect(find.textContaining(accountAddress), findsOneWidget);
      });
      testWidgets('Network name of chain ID should be visible.',
          (WidgetTester tester) async {
        when(() => mockWeb3Cubit.state).thenReturn(const Web3State());
        final String networkName = getNetworkName(chainId);
        whenListen(
          mockWeb3Cubit,
          Stream<Web3State>.fromIterable(
            <Web3State>[
              InitializeProviderSuccess(
                accountAddress: accountAddress,
                networkName: networkName,
              )
            ],
          ),
        );
        await pumpWidget(tester);
        await tester.pump();

        expect(find.textContaining('Chain'), findsOneWidget);
        expect(find.textContaining(networkName), findsOneWidget);
      });
    });
    group('Body Content.', () {
      testWidgets(
          'Greetings Content on loading should show linear progress indicator.',
          (WidgetTester tester) async {
        when(() => mockWeb3Cubit.state).thenReturn(const Web3State());

        whenListen(
          mockWeb3Cubit,
          Stream<Web3State>.fromIterable(
            <Web3State>[
              FetchGreetingLoading(),
            ],
          ),
        );
        await pumpWidget(tester);
        await tester.pump();

        expect(find.byType(LinearProgressIndicator), findsOneWidget);
      });
      testWidgets(
          'Greetings Content on success should show the greetings message.',
          (WidgetTester tester) async {
        const String message = 'Hello this is the updated greetings';

        when(() => mockWeb3Cubit.state).thenReturn(const Web3State());

        whenListen(
          mockWeb3Cubit,
          Stream<Web3State>.fromIterable(
            <Web3State>[
              const FetchGreetingSuccess(message: message),
            ],
          ),
        );
        await pumpWidget(tester);
        await tester.pump();

        expect(find.textContaining(message), findsOneWidget);
      });

      group('Update section.', () {
        testWidgets(
            'Update text field should be visible and also the button update greetings',
            (WidgetTester tester) async {
          when(() => mockWeb3Cubit.state).thenReturn(const Web3State());

          await pumpWidget(tester);
          await tester.pump();

          expect(find.byType(TextField), findsOneWidget);

          /// Update button find using by icon
          expect(find.byIcon(Icons.edit), findsOneWidget);
        });
        testWidgets(
            'On click edit button should trigger updateGreeting function inside cubit.',
            (WidgetTester tester) async {
          when(() => mockWeb3Cubit.state).thenReturn(const Web3State());
          when(() => mockWeb3Cubit.updateGreeting(any()))
              .thenAnswer((_) async {});

          await pumpWidget(tester);
          await tester.pump();

          /// Update button find using by icon
          final Finder updateBtn = find.byIcon(Icons.edit);
          expect(updateBtn, findsOneWidget);

          await tester.tap(updateBtn);
          await tester.pump();

          verify(
            () => mockWeb3Cubit.updateGreeting(any()),
          ).called(1);
        });

        testWidgets('On fail update it should show snackbar and related error.',
            (WidgetTester tester) async {
          when(() => mockWeb3Cubit.state).thenReturn(const Web3State());
          when(() => mockWeb3Cubit.updateGreeting(any()))
              .thenAnswer((_) async {});
          const String errorCode = '404';
          const String errorMessage = 'Something went wrong';
          whenListen(
            mockWeb3Cubit,
            Stream<Web3State>.fromIterable(
              <Web3State>[
                const FetchGreetingFailed(
                    errorCode: errorCode, message: errorMessage),
              ],
            ),
          );

          await pumpWidget(tester);
          await tester.pump();

          expect(
            find.ancestor(
                matching: find.byType(SnackBar), of: find.text(errorMessage)),
            findsOneWidget,
          );
        });
      });

      testWidgets(
          'On click disconnect button should trigger closeConnection function.',
          (WidgetTester tester) async {
        when(() => mockWeb3Cubit.state).thenReturn(const Web3State());
        when(() => mockWeb3Cubit.closeConnection()).thenAnswer((_) async {});

        await pumpWidget(tester);
        await tester.pump();

        /// Update button find using by icon
        final Finder disconnectBtn = find.byIcon(Icons.power_settings_new);
        expect(disconnectBtn, findsOneWidget);

        await tester.tap(disconnectBtn);
        await tester.pump();

        verify(
          () => mockWeb3Cubit.closeConnection(),
        ).called(1);
      });
    });
  });
}
