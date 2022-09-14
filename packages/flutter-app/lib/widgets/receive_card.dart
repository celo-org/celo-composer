import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web3/extensions/index.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:flutter_web3/widgets/index.dart';
import 'package:qr_flutter/qr_flutter.dart';

class ReceiveCard extends StatefulWidget {
  final String? address;
  const ReceiveCard({Key? key, this.address}) : super(key: key);

  @override
  State<ReceiveCard> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<ReceiveCard>
    with SingleTickerProviderStateMixin {
  AnimationController? controller;
  Animation<double>? scaleAnimation;

  @override
  void initState() {
    super.initState();

    controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 500));
    scaleAnimation = CurvedAnimation(parent: controller!, curve: Curves.easeIn);

    controller!.addListener(() {
      setState(() {});
    });

    controller!.forward();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
        scale: scaleAnimation!,
        child: Center(
            child: Material(
                color: Colors.transparent,
                child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 18.0, vertical: 10.0),
                    width: context.screenWidth(0.85),
                    height: context.screenHeight(0.37),
                    decoration: ShapeDecoration(
                        color: Theme.of(context).scaffoldBackgroundColor,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15.0))),
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          QrImage(
                            data: widget.address ?? 'No address',
                            version: QrVersions.auto,
                            size: 200.0,
                          ),
                          InkWell(
                            onTap: () {
                              final ClipboardData word = ClipboardData(
                                  text: widget.address ?? 'No address');
                              Clipboard.setData(word);
                              showToast(
                                  'Copied: ${widget.address ?? 'No address'}',
                                  context);
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.grey.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 20,
                              ),
                              child: Text(
                                widget.address ?? 'No address',
                                style: Theme.of(context).textTheme.bodyText1,
                              ),
                            ),
                          ),
                          const Height5(),
                          Text(
                            'Tap to copy',
                            style: Theme.of(context)
                                .textTheme
                                .bodyText2!
                                .copyWith(
                                    color: Theme.of(context).brightness ==
                                            Brightness.light
                                        ? Colors.black
                                        : Colors.white),
                          )
                        ])))));
  }
}
