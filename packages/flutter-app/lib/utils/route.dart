import 'package:flutter/material.dart';
import 'package:flutter_web3/screens/index.dart';

final Map<String, WidgetBuilder> routes = {
  SplashScreen.id: (context) => const SplashScreen(),
  Homescreen.id: (context) => const Homescreen()
};
