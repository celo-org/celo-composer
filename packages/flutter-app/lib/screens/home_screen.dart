import 'package:flutter/material.dart';
import 'package:flutter_web3/common/primary_button.dart';
import 'package:flutter_web3/controllers/walletconnect_controller.dart';
import 'package:flutter_web3/utils/constants.dart';
import 'package:flutter_web3/utils/image_constants.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class Homescreen extends StatefulWidget {
  const Homescreen({Key? key}) : super(key: key);

  @override
  State<Homescreen> createState() => _HomescreenState();
}

class _HomescreenState extends State<Homescreen> with WidgetsBindingObserver {
  bool balRefresh = false;
  final TextEditingController _textCtrl = TextEditingController();
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    context.read<WalletConnectController>().initWalletConnect();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    WalletConnectController controller =
        context.read<WalletConnectController>();
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
    WalletConnectController controller =
        context.watch<WalletConnectController>();
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SingleChildScrollView(
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
                                        "Balance : ${controller.bal}",
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
                                          await controller.getBalance();
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
                          Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 20,
                            ),
                            child: TextField(
                              controller: _textCtrl,
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
                          ),
                          const SizedBox(height: 20),
                          PrimaryButton(
                            text: "SEND Transaction",
                            onPressed: () async {
                              if (_textCtrl.text.isNotEmpty) {
                                await controller
                                    .sendTransaction(_textCtrl.text);
                                _textCtrl.text = "";
                                setState(() {});
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
                          await controller.createWalletConnectSession(context);
                        },
                        loading: false,
                      ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
