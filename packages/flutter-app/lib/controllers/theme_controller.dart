import 'package:flutter/material.dart';

class ThemeController extends ChangeNotifier {
  bool isDarkMode = true;

  void updateTheme(bool isDarkMode) {
    this.isDarkMode = isDarkMode;
    notifyListeners();
  }
}
