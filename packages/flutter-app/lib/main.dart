import 'package:flutter/material.dart';
import 'package:flutter_web3/controllers/theme_controller.dart';
import 'package:flutter_web3/screens/index.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<ThemeController>(
          create: (_) => ThemeController(),
        )
      ],
      child: const App(),
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
      theme: ThemeConfig.lightTheme.copyWith(brightness: Brightness.light),
      darkTheme: ThemeConfig.darkTheme.copyWith(brightness: Brightness.dark),
      themeMode: themeController.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: const SplashScreen(),
      initialRoute: SplashScreen.id,
      routes: routes,
    );
  }
}
