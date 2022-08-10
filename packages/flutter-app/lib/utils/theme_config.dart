import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web3/utils/constants.dart';

class ThemeConfig {
  static ThemeData createTheme({
    Brightness? brightness,
    required Color background,
    required Color primaryText,
    required Color secondaryText,
    required Color accentColor,
    required Color divider,
    required Color buttonBackground,
    required Color buttonText,
    required Color cardBackground,
    required Color disabled,
    required Color error,
  }) {
    final baseTextTheme = brightness == Brightness.dark
        ? Typography.blackMountainView
        : Typography.whiteMountainView;

    return ThemeData(
      canvasColor: background,
      cardColor: background,
      dividerColor: divider,
      dividerTheme: DividerThemeData(
        color: divider,
        space: 1,
        thickness: 1,
      ),
      cardTheme: CardTheme(
        color: cardBackground,
        margin: EdgeInsets.zero,
        clipBehavior: Clip.antiAliasWithSaveLayer,
      ),
      backgroundColor: background,
      primaryColor: accentColor,
      toggleableActiveColor: accentColor,
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: Colors.amber,
      ),
      appBarTheme: AppBarTheme(
        color: cardBackground,
        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
        toolbarTextStyle: TextTheme(
          bodyText1: baseTextTheme.bodyText1?.copyWith(
            color: Colors.white,
            fontSize: 24,
          ),
        ).bodyText2,
        titleTextStyle: TextTheme(
          bodyText1: baseTextTheme.bodyText1?.copyWith(
            color: Colors.white,
            fontSize: 24,
          ),
        ).headline6,
      ),
      iconTheme: IconThemeData(
        color: accentColor,
        size: 16.0,
      ),
      errorColor: error,
      buttonTheme: ButtonThemeData(
        textTheme: ButtonTextTheme.primary,
        colorScheme: ColorScheme(
          brightness: brightness ?? Brightness.light,
          primary: accentColor,
          secondary: accentColor,
          surface: background,
          background: background,
          error: error,
          onPrimary: buttonText,
          onSecondary: buttonText,
          onSurface: buttonText,
          onBackground: buttonText,
          onError: buttonText,
        ),
        padding: const EdgeInsets.all(16.0),
      ),
      cupertinoOverrideTheme: CupertinoThemeData(
        brightness: brightness,
        primaryColor: accentColor,
      ),
      inputDecorationTheme: InputDecorationTheme(
        errorStyle: TextStyle(color: error),
        labelStyle: TextStyle(
          fontFamily: '',
          fontWeight: FontWeight.w600,
          fontSize: 16.0,
          color: primaryText,
        ),
        hintStyle: TextStyle(
          color: secondaryText,
          fontSize: 13.0,
          fontWeight: FontWeight.w300,
        ),
      ),
      fontFamily: 'Poppins',
      textTheme: TextTheme(
        headline1: baseTextTheme.headline1?.copyWith(
          color: primaryText,
          fontSize: 34.0,
          fontWeight: FontWeight.bold,
          fontFamily: 'Poppins',
        ),
        headline2: baseTextTheme.headline2?.copyWith(
          color: primaryText,
          fontSize: 22,
          fontWeight: FontWeight.bold,
          fontFamily: 'Poppins',
        ),
        headline3: baseTextTheme.headline3?.copyWith(
          color: secondaryText,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          fontFamily: 'Poppins',
        ),
        headline4: baseTextTheme.headline4?.copyWith(
          color: primaryText,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          fontFamily: 'Poppins',
        ),
        headline5: baseTextTheme.headline5?.copyWith(
          color: primaryText,
          fontSize: 16,
          fontWeight: FontWeight.w700,
          fontFamily: 'Poppins',
        ),
        headline6: baseTextTheme.headline6?.copyWith(
          color: primaryText,
          fontSize: 14,
          fontWeight: FontWeight.w700,
          fontFamily: 'Poppins',
        ),
        bodyText1: baseTextTheme.bodyText1?.copyWith(
          color: secondaryText,
          fontSize: 15,
          fontFamily: 'Poppins',
        ),
        bodyText2: baseTextTheme.bodyText2?.copyWith(
          color: primaryText,
          fontSize: 12,
          fontWeight: FontWeight.w400,
          fontFamily: 'Poppins',
        ),
        button: baseTextTheme.button?.copyWith(
          color: primaryText,
          fontSize: 12.0,
          fontWeight: FontWeight.w700,
          fontFamily: 'Poppins',
        ),
        caption: baseTextTheme.caption?.copyWith(
          color: primaryText,
          fontSize: 11.0,
          fontWeight: FontWeight.w300,
          fontFamily: 'Poppins',
        ),
        overline: baseTextTheme.overline?.copyWith(
          color: secondaryText,
          fontSize: 11.0,
          fontWeight: FontWeight.w500,
          fontFamily: 'Poppins',
        ),
        subtitle1: baseTextTheme.subtitle1?.copyWith(
          color: primaryText,
          fontSize: 16.0,
          fontWeight: FontWeight.w700,
          fontFamily: 'Poppins',
        ),
        subtitle2: baseTextTheme.subtitle2?.copyWith(
          color: secondaryText,
          fontSize: 11.0,
          fontWeight: FontWeight.w500,
          fontFamily: 'Poppins',
        ),
      ),
      colorScheme: ColorScheme.fromSwatch().copyWith(secondary: accentColor),
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: accentColor,
        selectionColor: accentColor,
        selectionHandleColor: accentColor,
      ),
    );
  }

  static ThemeData get lightTheme => createTheme(
        brightness: Brightness.light,
        background: ColorConstants.lightScaffoldBackgroundColor,
        cardBackground: Colors.amber,
        primaryText: ColorConstants.primaryAppColor,
        secondaryText: ColorConstants.secondaryAppColor,
        accentColor: ColorConstants.secondaryAppColor,
        divider: ColorConstants.secondaryAppColor,
        buttonBackground: ColorConstants.secondaryAppColor,
        buttonText: ColorConstants.secondaryAppColor,
        disabled: ColorConstants.secondaryAppColor,
        error: Colors.red,
      );

  static ThemeData get darkTheme => createTheme(
        brightness: Brightness.dark,
        background: ColorConstants.darkScaffoldBackgroundColor,
        cardBackground: Colors.grey,
        primaryText: ColorConstants.secondaryBlackAppColor,
        secondaryText: ColorConstants.secondaryBlackAppColor,
        accentColor: ColorConstants.secondaryBlackAppColor,
        divider: ColorConstants.secondaryBlackAppColor,
        buttonBackground: ColorConstants.secondaryBlackAppColor,
        buttonText: ColorConstants.secondaryBlackAppColor,
        disabled: ColorConstants.secondaryBlackAppColor,
        error: Colors.red,
      );
}
