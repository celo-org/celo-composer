import 'package:flutter/material.dart';
import 'package:flutter_web3/utils/index.dart';

showToast(String message, BuildContext context) {
  final snackBar = SnackBar(
    backgroundColor: ColorConstants.secondaryBlackAppColor,
    behavior: SnackBarBehavior.floating,
    content: Text(
      message,
      style: Theme.of(context)
          .textTheme
          .bodyText1!
          .copyWith(fontWeight: FontWeight.w500, color: Colors.white),
    ),
  );
  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}
