import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_web3/extensions/index.dart';
import 'package:flutter_web3/screens/index.dart';
import 'package:flutter_web3/utils/image_constants.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:flutter_web3/widgets/index.dart';

class SplashScreen extends StatefulWidget {
  static const String id = 'splash_screen';
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  init() async {
    Timer(const Duration(seconds: 3), () {
      Navigator.pushReplacementNamed(context, Homescreen.id);
    });
  }

  @override
  void initState() {
    init();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              width: context.screenWidth(0.6),
              height: context.screenWidth(0.6),
              decoration: BoxDecoration(
                  color: ColorConstants.primaryAppColor.withOpacity(0.1),
                  borderRadius: const BorderRadius.all(Radius.circular(9999))),
              child: Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(20),
                width: context.screenWidth(0.5),
                height: context.screenWidth(0.5),
                decoration: BoxDecoration(
                    color: ColorConstants.primaryAppColor.withOpacity(0.15),
                    borderRadius:
                        const BorderRadius.all(Radius.circular(9999))),
                child: Container(
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(20),
                  width: context.screenWidth(0.4),
                  height: context.screenWidth(0.4),
                  decoration: BoxDecoration(
                      color: ColorConstants.primaryAppColor.withOpacity(0.2),
                      borderRadius:
                          const BorderRadius.all(Radius.circular(9999))),
                  child: Container(
                    alignment: Alignment.center,
                    width: context.screenWidth(0.4),
                    height: context.screenWidth(0.4),
                    decoration: BoxDecoration(
                        color: ColorConstants.primaryAppColor.withOpacity(0.25),
                        borderRadius:
                            const BorderRadius.all(Radius.circular(9999))),
                    child: Image.asset(
                      AllImages().celoLogo,
                      fit: BoxFit.contain,
                      width: 80,
                    ),
                  ),
                ),
              ),
            ),
            const Height15(),
            Text(
              AllStrings().celoComposer,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headline1!.copyWith(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
            ),
            Text(
              AllStrings().flutter,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headline1!.copyWith(
                    color: ColorConstants.primaryAppColor,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
