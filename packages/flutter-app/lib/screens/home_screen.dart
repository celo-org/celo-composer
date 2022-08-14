import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web3/controllers/wallet_controller.dart';
import 'package:flutter_web3/screens/home/index.dart';
import 'package:flutter_web3/screens/home/setting.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:provider/provider.dart';

class Homescreen extends StatefulWidget {
  static const String id = 'home_screen';
  const Homescreen({Key? key}) : super(key: key);

  @override
  State<Homescreen> createState() => _HomescreenState();
}

class _HomescreenState extends State<Homescreen> with WidgetsBindingObserver {
  int _index = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {}

  @override
  void dispose() {
    super.dispose();
    // Remove observer for app lifecycle changes.
    WidgetsBinding.instance.removeObserver(this);
  }

  final List<Widget> screens = [
    const IndexPage(),
    const SettingPage(),
  ];

  @override
  Widget build(BuildContext context) {
    WalletController walletController = context.watch<WalletController>();
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: GestureDetector(
        onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
        child: SafeArea(
          child: Container(
            color: Theme.of(context).backgroundColor,
            child: screens[walletController.bottomNavbarIndex],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        enableFeedback: true,
        showSelectedLabels: true,
        showUnselectedLabels: true,
        selectedFontSize: 12,
        unselectedFontSize: 12,
        selectedLabelStyle:
            Theme.of(context).textTheme.bodyText1!.copyWith(fontSize: 12),
        unselectedLabelStyle:
            Theme.of(context).textTheme.bodyText1!.copyWith(fontSize: 12),
        type: BottomNavigationBarType.fixed,
        currentIndex: walletController.bottomNavbarIndex,
        onTap: (int value) {
          if (value == 1 && walletController.publicWalletAddress == null) {
            showToast('Connect wallet to continue', context);
            return;
          }
          walletController.updateBottomNavbarIndex(value);
        },
        iconSize: 20,
        backgroundColor:
            Theme.of(context).bottomNavigationBarTheme.backgroundColor,
        selectedItemColor: ColorConstants.primaryAppColor,
        unselectedItemColor: Theme.of(context).brightness == Brightness.dark
            ? Colors.white
            : null,
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
              icon: const Icon(Icons.home), label: 'home'.tr()),
          BottomNavigationBarItem(
              icon: const Icon(Icons.settings), label: 'setting'.tr()),
        ],
      ),
    );
  }
}
