import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_walletconnect/services/walletconnect_service.dart';
import 'package:flutter_web3/common/primary_button.dart';
import 'package:flutter_web3/utils/constants.dart';
import 'package:flutter_web3/utils/image_constants.dart';
import 'package:intl/intl.dart';
import 'package:web3dart/web3dart.dart';

class Homescreen extends StatefulWidget {
  const Homescreen({Key? key}) : super(key: key);

  @override
  State<Homescreen> createState() => _HomescreenState();
}

class _HomescreenState extends State<Homescreen> with WidgetsBindingObserver {
  bool balRefresh = false;
  final TextEditingController _amountCtrl = TextEditingController();
  final TextEditingController _addressCtrl = TextEditingController();
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    FlutterWalletConnect.instance.initWalletConnect();
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
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: GestureDetector(
        onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
        child: SingleChildScrollView(
          child: SafeArea(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  const SizedBox(height: 60),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Image.asset(
                      AllImages().celoLogo,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 40),
                  const Text(
                    "Celo Composer",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 40,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    "Flutter",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: ColorConstants.primaryAppColor,
                      fontFamily: 'Poppins',
                      fontSize: 40,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 40),
                  controller.account != null
                      ? Column(
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
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                            const SizedBox(height: 25),
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
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                          ),
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
                                              : const Text(
                                                  "Refresh",
                                                  style: TextStyle(
                                                    color: Colors.blue,
                                                    fontSize: 13,
                                                  ),
                                                ),
                                        ),
                                      ],
                                    )
                                  ],
                                )),
                            Container(
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
                                  const Text(
                                    "Send Token",
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  TextField(
                                    controller: _amountCtrl,
                                    decoration: InputDecoration(
                                      filled: true,
                                      fillColor: Colors.grey.withOpacity(0.1),
                                      labelText: "Amount",
                                      enabledBorder: UnderlineInputBorder(
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      focusedBorder: UnderlineInputBorder(
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      labelStyle: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  TextField(
                                    controller: _addressCtrl,
                                    decoration: InputDecoration(
                                      filled: true,
                                      fillColor: Colors.grey.withOpacity(0.1),
                                      labelText: "Address",
                                      enabledBorder: UnderlineInputBorder(
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      focusedBorder: UnderlineInputBorder(
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      labelStyle: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                            PrimaryButton(
                              text: "SEND Transaction",
                              onPressed: () async {
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
                            const SizedBox(height: 20),
                            PrimaryButton(
                              text: "Disconnect",
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
                            ),
                          ],
                        )
                      : PrimaryButton(
                          text: "Connect Wallet",
                          onPressed: () async {
                            await controller
                                .createWalletConnectSession(context);
                            setState(() {});
                          },
                          loading: false,
                        ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
