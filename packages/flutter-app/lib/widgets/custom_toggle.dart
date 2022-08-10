import 'package:flutter/material.dart';
import 'package:flutter_web3/utils/index.dart';

class CustomToggle extends StatefulWidget {
  final ValueChanged<bool> onToggle;
  final bool value;
  final bool disabled;
  final double height;
  final double width;
  final double toggleSize;
  final Duration duration;
  final bool showOnOff;
  final String? activeText;
  final String? inactiveText;
  final Color activeColor;
  final Color inactiveColor;
  final Color activeTextColor;
  final Color inactiveTextColor;
  final Widget? activeIcon;
  final Widget? inactiveIcon;
  final double borderRadius;
  final double padding;

  final Color? activeToggleColor;

  final Color? inactiveToggleColor;

  final BoxBorder? switchBorder;
  final BoxBorder? activeSwitchBorder;
  final BoxBorder? inactiveSwitchBorder;
  final BoxBorder? toggleBorder;
  final BoxBorder? activeToggleBorder;
  final BoxBorder? inactiveToggleBorder;

  const CustomToggle({
    Key? key,
    required this.onToggle,
    this.value = false,
    this.disabled = false,
    this.width = 70.0,
    this.height = 35.0,
    this.toggleSize = 25.0,
    this.activeIcon,
    this.inactiveIcon,
    this.showOnOff = false,
    this.activeText,
    this.inactiveText,
    this.borderRadius = 20.0,
    this.padding = 4.0,
    this.activeColor = Colors.grey,
    this.inactiveColor = Colors.grey,
    this.activeTextColor = Colors.white70,
    this.inactiveTextColor = Colors.white70,
    this.switchBorder,
    this.activeSwitchBorder,
    this.inactiveSwitchBorder,
    this.toggleBorder,
    this.activeToggleBorder,
    this.inactiveToggleBorder,
    this.activeToggleColor,
    this.inactiveToggleColor,
    this.duration = const Duration(milliseconds: 200),
  }) : super(key: key);

  @override
  State<CustomToggle> createState() => _CustomToggleState();
}

class _CustomToggleState extends State<CustomToggle>
    with SingleTickerProviderStateMixin {
  late final Animation _toggleAnimation;
  late final AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      value: widget.value ? 1.0 : 0.0,
      duration: widget.duration,
    );
    _toggleAnimation = AlignmentTween(
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
    ).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.linear,
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(CustomToggle oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.value == widget.value) return;

    if (widget.value) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    Color toggleColor = Colors.white;
    Color switchColor = Colors.white;
    Border? switchBorder;
    Border? toggleBorder;
    if (widget.value) {
      toggleColor =
          widget.activeToggleColor ?? ColorConstants.secondaryAppColor;
      switchColor = widget.activeColor;
      switchBorder = widget.activeSwitchBorder as Border? ??
          widget.switchBorder as Border?;
      toggleBorder = widget.activeToggleBorder as Border? ??
          widget.toggleBorder as Border?;
    } else {
      toggleColor =
          widget.inactiveToggleColor ?? ColorConstants.primaryAppColor;
      switchColor = widget.inactiveColor;
      switchBorder = widget.inactiveSwitchBorder as Border? ??
          widget.switchBorder as Border?;
      toggleBorder = widget.inactiveToggleBorder as Border? ??
          widget.toggleBorder as Border?;
    }

    double textSpace = widget.width - widget.toggleSize;

    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return SizedBox(
          width: widget.width,
          child: Align(
            child: GestureDetector(
              onTap: () {
                if (!widget.disabled) {
                  if (widget.value) {
                    _animationController.forward();
                  } else {
                    _animationController.reverse();
                  }

                  widget.onToggle(!widget.value);
                }
              },
              child: Opacity(
                opacity: widget.disabled ? 0.6 : 1,
                child: Container(
                  width: widget.width,
                  height: widget.height,
                  padding: EdgeInsets.all(widget.padding),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(widget.borderRadius),
                    color: switchColor,
                    border: switchBorder,
                  ),
                  child: Stack(
                    children: <Widget>[
                      AnimatedOpacity(
                        opacity: widget.value ? 1.0 : 0.0,
                        duration: widget.duration,
                        child: Container(
                          width: textSpace,
                          padding: const EdgeInsets.symmetric(horizontal: 4.0),
                          alignment: Alignment.centerLeft,
                          child: _activeText,
                        ),
                      ),
                      Align(
                        alignment: Alignment.centerRight,
                        child: AnimatedOpacity(
                          opacity: !widget.value ? 1.0 : 0.0,
                          duration: widget.duration,
                          child: Container(
                            width: textSpace,
                            padding:
                                const EdgeInsets.symmetric(horizontal: 4.0),
                            alignment: Alignment.centerRight,
                            child: _inactiveText,
                          ),
                        ),
                      ),
                      Align(
                        alignment: _toggleAnimation.value,
                        child: Container(
                          width: widget.toggleSize,
                          height: widget.toggleSize,
                          padding: const EdgeInsets.all(4.0),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: toggleColor,
                            border: toggleBorder,
                          ),
                          child: FittedBox(
                            fit: BoxFit.contain,
                            child: Stack(
                              children: [
                                Center(
                                  child: AnimatedOpacity(
                                    opacity: widget.value ? 1.0 : 0.0,
                                    duration: widget.duration,
                                    child: widget.activeIcon,
                                  ),
                                ),
                                Center(
                                  child: AnimatedOpacity(
                                    opacity: !widget.value ? 1.0 : 0.0,
                                    duration: widget.duration,
                                    child: widget.inactiveIcon,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget get _activeText {
    if (widget.showOnOff) {
      return Text(widget.activeText ?? "On",
          style: Theme.of(context).textTheme.bodyText1);
    }

    return const Text("");
  }

  Widget get _inactiveText {
    if (widget.showOnOff) {
      return Text(
        widget.inactiveText ?? "Off",
        style: Theme.of(context).textTheme.bodyText1,
        textAlign: TextAlign.right,
      );
    }

    return const Text('');
  }
}
