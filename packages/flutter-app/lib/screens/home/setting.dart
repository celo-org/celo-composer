import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web3/controllers/wallet_controller.dart';
import 'package:flutter_web3/model/language.dart';
import 'package:flutter_web3/utils/string_constant.dart';
import 'package:flutter_web3/widgets/index.dart';
import 'package:provider/provider.dart';

class SettingPage extends StatefulWidget {
  const SettingPage({Key? key}) : super(key: key);

  @override
  State<SettingPage> createState() => _SettingPageState();
}

class _SettingPageState extends State<SettingPage> {
  List<Language> languageList = [
    Language(
      langName: 'English - US',
      locale: const Locale('en', 'US'),
    ),
    Language(
      langName: 'French - FR',
      locale: const Locale('fr', 'FR'),
    )
  ];

  List<String> networks = ['Mainnet'];

  Language? selectedLang;

  init() {
    selectedLang = languageList.singleWhere((e) => e.locale == context.locale);
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      init();
    });
  }

  @override
  Widget build(BuildContext context) {
    WalletController walletController = context.watch<WalletController>();
    return SafeArea(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 20, right: 20, top: 10),
              child: ListTile(
                  title: Text(
                    'network'.tr(),
                    style: Theme.of(context).textTheme.bodyText1,
                  ),
                  trailing: DropdownButton<String>(
                    iconSize: 18,
                    elevation: 16,
                    value: networks[0],
                    style: Theme.of(context).textTheme.bodyText1,
                    underline: Container(
                      padding: const EdgeInsets.only(left: 4, right: 4),
                      color: Colors.transparent,
                    ),
                    onChanged: (newValue) {},
                    items:
                        networks.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(
                          value,
                          style: Theme.of(context).textTheme.bodyText1,
                        ),
                      );
                    }).toList(),
                  )),
            ),
            Divider(
              color: Colors.grey.withOpacity(0.1),
              thickness: 0.5,
            ),
            Padding(
              padding: const EdgeInsets.only(left: 20, right: 20, top: 10),
              child: ListTile(
                  title: Text(
                    'language'.tr(),
                    style: Theme.of(context).textTheme.bodyText1,
                  ),
                  trailing: DropdownButton<Language>(
                    iconSize: 18,
                    elevation: 16,
                    value: selectedLang,
                    style: Theme.of(context).textTheme.bodyText1,
                    underline: Container(
                      padding: const EdgeInsets.only(left: 4, right: 4),
                      color: Colors.transparent,
                    ),
                    onChanged: (newValue) {
                      setState(() {
                        selectedLang = newValue!;
                      });
                      if (newValue!.langName == 'English - US') {
                        context.setLocale(const Locale('en', 'US'));
                      } else if (newValue.langName == 'French - FR') {
                        context.setLocale(const Locale('fr', 'FR'));
                      }
                    },
                    items: languageList
                        .map<DropdownMenuItem<Language>>((Language value) {
                      return DropdownMenuItem<Language>(
                        value: value,
                        child: Text(
                          value.langName,
                          style: Theme.of(context).textTheme.bodyText1,
                        ),
                      );
                    }).toList(),
                  )),
            )
          ],
        ),
        Center(
          child: PrimaryButton(
            text: AllStrings().disconnect.tr(),
            onPressed: () async {
              walletController.disconnectWallet();
            },
            loading: false,
            bgColor: Colors.red,
          ),
        )
      ],
    ));
  }
}
