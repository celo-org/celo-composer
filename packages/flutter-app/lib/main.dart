import 'package:flutter/material.dart';
import 'package:flutter_web3/controllers/theme_controller.dart';
import 'package:flutter_web3/screens/home_screen.dart';
import 'package:flutter_web3/utils/theme_config.dart';
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
      title: 'Celo Composer - Flutter',
      debugShowCheckedModeBanner: false,
      theme: ThemeConfig.lightTheme.copyWith(brightness: Brightness.light),
      darkTheme: ThemeConfig.darkTheme.copyWith(brightness: Brightness.dark),
      themeMode: themeController.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: const Homescreen(),
    );
  }
}
