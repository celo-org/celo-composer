import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_walletconnect/services/walletconnect_service.dart';
import 'package:flutter_web3/controllers/theme_controller.dart';
import 'package:flutter_web3/extensions/index.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:flutter_web3/widgets/index.dart';
import 'package:flutter_web3/utils/image_constants.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:web3dart/web3dart.dart';

class Homescreen extends StatefulWidget {
  static const String id = 'home_screen';
  const Homescreen({Key? key}) : super(key: key);

  @override
  State<Homescreen> createState() => _HomescreenState();
}

class _HomescreenState extends State<Homescreen> with WidgetsBindingObserver {
  bool balRefresh = false;
  final TextEditingController _amountCtrl = TextEditingController();
  final TextEditingController _addressCtrl = TextEditingController();
  final formKey = GlobalKey<FormState>();

  init() async {
    try {
      await FlutterWalletConnect.instance.initWalletConnect();
    } catch (e) {
      //
      logger.d("$e");
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    init();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    FlutterWalletConnect controller = FlutterWalletConnect.instance;
    DateFormat dateFormat = DateFormat("HH:mm:ss");
    String dateString = dateFormat.format(DateTime.now());
    logger.d("$dateString AppLifecycleState: ${state.toString()}.");
    if (state == AppLifecycleState.resumed && mounted) {
      // If we have a configured connection but the websocket is down try once to reconnect
      if (controller.walletConnect.connected &&
          controller.walletConnect.bridgeConnected == false) {
        logger.w(
            '$dateString  Wallet connected, but transport is down.  Attempt to recover.');
        controller.walletConnect.reconnect();
      }
    }
  }

  @override
  void dispose() {
    super.dispose();
    // Remove observer for app lifecycle changes.
    WidgetsBinding.instance.removeObserver(this);
  }

  @override
  Widget build(BuildContext context) {
    FlutterWalletConnect controller = FlutterWalletConnect.instance;
    ThemeController themeController = context.watch<ThemeController>();
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: GestureDetector(
        onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
        child: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(left: 20, right: 20, top: 10),
                  child: Column(
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Image.asset(
                            AllImages().celoLogo,
                            width: 100,
                          ),
                          CustomToggle(
                              activeIcon: const Icon(
                                Icons.dark_mode,
                                color: Colors.white,
                              ),
                              inactiveIcon: const Icon(
                                Icons.light_mode,
                                color: Colors.white,
                              ),
                              width: 60,
                              height: 30,
                              toggleSize: 20,
                              value: themeController.isDarkMode,
                              onToggle: (value) {
                                themeController.updateTheme(value);
                              })
                        ],
                      ),
                    ],
                  ),
                ),
                controller.account != null
                    ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.grey.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 20,
                            ),
                            margin: const EdgeInsets.symmetric(
                              horizontal: 20,
                            ),
                            child: Text(
                              controller.account!,
                              style: Theme.of(context).textTheme.headline1,
                              textAlign: TextAlign.center,
                            ),
                          ),
                          CustomHeight(
                            height: context.screenHeight(0.15),
                          ),
                          Container(
                              decoration: BoxDecoration(
                                color: Colors.grey.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 20,
                              ),
                              margin: const EdgeInsets.symmetric(
                                horizontal: 20,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        "Balance : ${controller.bal.getValueInUnit(EtherUnit.ether)}",
                                        style: Theme.of(context)
                                            .textTheme
                                            .headline4,
                                      ),
                                      GestureDetector(
                                        onTap: () async {
                                          setState(() {
                                            balRefresh = true;
                                          });
                                          await FlutterWalletConnect()
                                              .getBalance();
                                          setState(() {
                                            balRefresh = false;
                                          });
                                        },
                                        child: balRefresh
                                            ? const CircularProgressIndicator()
                                            : Text(
                                                AllStrings().refresh,
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .bodyText2!
                                                    .copyWith(
                                                      color: Colors.blue,
                                                      fontSize: 13,
                                                    ),
                                              ),
                                      ),
                                    ],
                                  )
                                ],
                              )),
                          Form(
                            key: formKey,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 20,
                              ),
                              margin: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 20,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.grey.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(AllStrings().sendToken,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyText1),
                                  const Height10(),
                                  CustomTextField(
                                    controller: _amountCtrl,
                                    filled: true,
                                    labelText: AllStrings().amount,
                                    validator: (String? value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Amount is required';
                                      } else if (int.parse(value) == 0) {
                                        return 'Amount must be greater 0';
                                      }
                                      return null;
                                    },
                                    filledColor: Colors.grey.withOpacity(0.1),
                                    inputFormatters: [
                                      FilteringTextInputFormatter.allow(
                                          RegExp('[0-9.,]+')),
                                    ],
                                  ),
                                  const Height10(),
                                  CustomTextField(
                                    controller: _addressCtrl,
                                    filled: true,
                                    validator: (String? value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Address is required';
                                      }
                                      return null;
                                    },
                                    labelText: AllStrings().address,
                                    filledColor: Colors.grey.withOpacity(0.1),
                                  )
                                ],
                              ),
                            ),
                          ),
                          const Height10(),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              PrimaryButton(
                                text: AllStrings().send,
                                onPressed: () async {
                                  if (!formKey.currentState!.validate()) {
                                    return;
                                  }
                                  if (_amountCtrl.text.isNotEmpty &&
                                      _addressCtrl.text.isNotEmpty) {
                                    await controller.sendToken(
                                        "", _amountCtrl.text);
                                    _amountCtrl.text = "";
                                    setState(() {});
                                    sleep(const Duration(seconds: 3));
                                    setState(() {
                                      balRefresh = true;
                                    });
                                    await FlutterWalletConnect().getBalance();
                                    setState(() {
                                      balRefresh = false;
                                    });
                                  }
                                },
                                loading: false,
                              ),
                              const Width10(),
                              PrimaryButton(
                                text: AllStrings().receive,
                                onPressed: () {
                                  showDialog(
                                      context: context,
                                      builder: (context) => ReceiveCard(
                                            address: controller.account,
                                          ));
                                },
                                bgColor: ColorConstants.secondaryAppColor,
                                loading: false,
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                        ],
                      )
                    : Column(
                        children: [
                          Text(
                            AllStrings().celoComposer,
                            textAlign: TextAlign.center,
                            style:
                                Theme.of(context).textTheme.headline1!.copyWith(
                                      fontSize: 40,
                                      fontWeight: FontWeight.w600,
                                    ),
                          ),
                          Text(
                            AllStrings().flutter,
                            textAlign: TextAlign.center,
                            style:
                                Theme.of(context).textTheme.headline1!.copyWith(
                                      color: ColorConstants.primaryAppColor,
                                      fontSize: 40,
                                      fontWeight: FontWeight.w600,
                                    ),
                          ),
                          Text(
                            'Connect wallet to continue',
                            style: Theme.of(context)
                                .textTheme
                                .bodyText1!
                                .copyWith(fontSize: 20),
                          ),
                        ],
                      ),
                Column(
                  children: [
                    controller.account != null
                        ? PrimaryButton(
                            text: AllStrings().disconnect,
                            onPressed: () async {
                              if (controller.walletConnect.connected) {
                                logger.d('Killing session');
                                controller.walletConnect.killSession();
                                setState(() {
                                  controller.statusMessage =
                                      'Wallet Disconnected';
                                });
                              }
                            },
                            loading: false,
                            bgColor: Colors.red,
                          )
                        : PrimaryButton(
                            text: AllStrings().connectWallet,
                            onPressed: () async {
                              try {
                                await controller
                                    .createWalletConnectSession(context);
                                setState(() {});
                              } catch (e) {
                                logger.d(e);
                              }
                            },
                            loading: false,
                          ),
                    const Height10()
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
