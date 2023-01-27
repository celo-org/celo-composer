import 'package:external_app_launcher/external_app_launcher.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_celo_composer/internal/wallet_external_configuration.dart';
import 'package:flutter_celo_composer/module/auth/service/cubit/auth_cubit.dart';
import 'package:flutter_celo_composer/module/home/interfaces/screens/home_screen.dart';
import 'package:url_launcher/url_launcher_string.dart';

class AuthenticationScreen extends StatefulWidget {
  const AuthenticationScreen({Key? key}) : super(key: key);

  @override
  State<AuthenticationScreen> createState() => _AuthenticationScreenState();
}

class _AuthenticationScreenState extends State<AuthenticationScreen> {
  Future<void> _launchApp() async {
    final bool isInstalled = await LaunchApp.isAppInstalled(
      androidPackageName: metaMaskPackageName,
      iosUrlScheme: metamaskWalletScheme,
    );

    /// If there is an exisitng app, just launch the app.
    if (isInstalled) {
      if (!mounted) return;
      context.read<AuthCubit>().loginWithMetamask();
      return;
    }

    /// If there is no exisitng app, launch app store.
    await LaunchApp.openApp(
      androidPackageName: metaMaskPackageName,
      iosUrlScheme: metamaskWalletScheme,
      appStoreLink: metamaskAppsStoreLink,
    );
  }

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback(
        (_) => context.read<AuthCubit>().initiateListeners());
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final double width = MediaQuery.of(context).size.width;
    final double height = MediaQuery.of(context).size.height;

    return BlocListener<AuthCubit, AuthState>(
      listener: (BuildContext context, AuthState state) {
        if (state is EstablishConnectionSuccess) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute<void>(
              builder: (BuildContext context) => HomeScreen(
                session: state.session,
                connector: state.connector,
                uri: state.uri,
              ),
            ),
          );
        } else if (state is LoginWithMetamaskSuccess) {
          launchUrlString(state.url, mode: LaunchMode.externalApplication);
        } else if (state is LoginWithMetamaskFailed) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: theme.colorScheme.error,
            ),
          );
        }
      },
      child: SafeArea(
        child: Scaffold(
          backgroundColor: const Color(0xFFFFFFFF),
          body: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Container(
                width: double.infinity,
                height: 70,
                color: const Color(0xFFFCFF52),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Image.asset(
                    'assets/images/logo.png',
                    width: 16,
                  ),
                ),
              ),
              Expanded(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: ElevatedButton.icon(
                      onPressed: () => _launchApp(),
                      icon: Image.asset(
                        'assets/images/metamask-logo.png',
                        width: 16,
                      ),
                      label: Text(
                        'Login with Metamask',
                        style: theme.textTheme.titleMedium
                            ?.copyWith(color: Colors.black),
                      ),
                      style: ButtonStyle(
                        elevation: MaterialStateProperty.all(0),
                        backgroundColor: MaterialStateProperty.all(
                          Colors.grey.shade300,
                        ),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
