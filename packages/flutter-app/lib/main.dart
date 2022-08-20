import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web3/controllers/theme_controller.dart';
import 'package:flutter_web3/controllers/wallet_controller.dart';
import 'package:flutter_web3/screens/index.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<ThemeController>(
          create: (_) => ThemeController(),
        ),
        ChangeNotifierProvider<WalletController>(
          create: (_) => WalletController(),
        )
      ],
      child: EasyLocalization(
        supportedLocales: const [Locale('en', 'US'), Locale('fr', 'FR')],
        path: 'assets/lang', // <-- change the path of the translation files
        fallbackLocale: const Locale('en', 'US'),
        child: const App(),
      ),
    ),
  );
}

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ThemeController themeController = context.watch<ThemeController>();
    return MaterialApp(
      title: AllStrings().celoComposer,
      debugShowCheckedModeBanner: false,
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      theme: ThemeConfig.lightTheme.copyWith(brightness: Brightness.light),
      darkTheme: ThemeConfig.darkTheme.copyWith(brightness: Brightness.dark),
      themeMode: themeController.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: const SplashScreen(),
      initialRoute: SplashScreen.id,
      routes: routes,
    );
  }
}
