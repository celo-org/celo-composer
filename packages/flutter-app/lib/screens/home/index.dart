import 'dart:io';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web3/controllers/theme_controller.dart';
import 'package:flutter_web3/controllers/wallet_controller.dart';
import 'package:flutter_web3/extensions/index.dart';
import 'package:flutter_web3/utils/image_constants.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:flutter_web3/widgets/index.dart';
import 'package:provider/provider.dart';
import 'package:web3dart/web3dart.dart';

class IndexPage extends StatefulWidget {
  const IndexPage({Key? key}) : super(key: key);

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage> {
  final TextEditingController _amountCtrl = TextEditingController();
  final TextEditingController _addressCtrl = TextEditingController();
  final formKey = GlobalKey<FormState>();
  @override
  Widget build(BuildContext context) {
    ThemeController themeController = context.watch<ThemeController>();
    WalletController walletController = context.watch<WalletController>();
    return SafeArea(
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
            walletController.isConnectWallet
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
                          walletController.publicWalletAddress ?? '',
                          style: Theme.of(context).textTheme.headline3,
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
                                    "Balance : ${walletController.bal.getValueInUnit(EtherUnit.ether)}",
                                    style:
                                        Theme.of(context).textTheme.headline4,
                                  ),
                                  GestureDetector(
                                    onTap: () async {
                                      await walletController.getBalance();
                                    },
                                    child: walletController.balRefresh
                                        ? const Center(
                                            child: SizedBox(
                                                height: 20,
                                                width: 20,
                                                child:
                                                    CircularProgressIndicator(
                                                  strokeWidth: 2,
                                                  valueColor:
                                                      AlwaysStoppedAnimation<
                                                              Color>(
                                                          ColorConstants
                                                              .primaryAppColor),
                                                )),
                                          )
                                        : Text(
                                            AllStrings().refresh.tr(),
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
                              Text(AllStrings().sendToken.tr(),
                                  style: Theme.of(context).textTheme.bodyText1),
                              const Height10(),
                              CustomTextField(
                                controller: _amountCtrl,
                                filled: true,
                                labelText: AllStrings().amount.tr(),
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
                                labelText: AllStrings().address.tr(),
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
                            text: AllStrings().send.tr(),
                            onPressed: () async {
                              if (!formKey.currentState!.validate()) {
                                return;
                              }
                              if (_amountCtrl.text.isNotEmpty &&
                                  _addressCtrl.text.isNotEmpty) {
                                await walletController.sendToken(
                                    _addressCtrl.text.trim(),
                                    _amountCtrl.text.trim());
                                setState(() {});
                                sleep(const Duration(seconds: 3));

                                await walletController.getBalance();
                              }
                            },
                            loading: false,
                          ),
                          const Width10(),
                          PrimaryButton(
                            text: AllStrings().receive.tr(),
                            onPressed: () {
                              showDialog(
                                  context: context,
                                  builder: (context) => ReceiveCard(
                                        address: walletController
                                            .publicWalletAddress,
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
                        style: Theme.of(context).textTheme.headline1!.copyWith(
                              fontSize: 40,
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                      Text(
                        AllStrings().flutter,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headline1!.copyWith(
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
                walletController.isConnectWallet
                    ? const SizedBox()
                    : PrimaryButton(
                        text: AllStrings().connectWallet.tr(),
                        onPressed: () async {
                          try {
                            walletController.connectWallet(context);
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
    );
  }
}
