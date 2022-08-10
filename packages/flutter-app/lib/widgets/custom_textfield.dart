import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web3/utils/index.dart';
import 'package:flutter_web3/widgets/index.dart';

class CustomTextField extends StatelessWidget {
  final bool hasTitle;
  final bool readOnly;
  final bool obscure;
  final bool autocorrect;
  final bool filled;
  final bool autofocus;
  final String? title;
  final String? hintText;
  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final Color? filledColor;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final void Function(String?)? onSaved;
  final TextEditingController? controller;
  final CrossAxisAlignment alignedColumn;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final String? labelText;
  const CustomTextField(
      {Key? key,
      this.hasTitle = false,
      this.controller,
      this.title,
      this.hintText,
      this.suffixIcon,
      this.validator,
      this.filledColor,
      this.onChanged,
      this.labelText,
      this.onSaved,
      this.prefixIcon,
      this.inputFormatters,
      this.keyboardType = TextInputType.text,
      this.readOnly = false,
      this.filled = true,
      this.obscure = false,
      this.autocorrect = false,
      this.alignedColumn = CrossAxisAlignment.start,
      this.autofocus = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: alignedColumn,
      children: [
        if (hasTitle) ...[
          Text(title!, style: Theme.of(context).textTheme.bodyText2),
          const Height10()
        ],
        TextFormField(
          readOnly: readOnly,
          controller: controller,
          validator: validator,
          onChanged: onChanged,
          onSaved: onSaved,
          keyboardType: keyboardType,
          cursorColor: ColorConstants.secondaryAppColor,
          style: Theme.of(context)
              .textTheme
              .bodyText1!
              .copyWith(fontWeight: FontWeight.normal),
          inputFormatters: inputFormatters,
          decoration: InputDecoration(
            enabledBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.transparent),
                borderRadius: BorderRadius.all(Radius.circular(10))),
            focusedBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.transparent),
                borderRadius: BorderRadius.all(Radius.circular(10))),
            focusedErrorBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.transparent, width: 0),
                borderRadius: BorderRadius.all(Radius.circular(10))),
            filled: filled,
            hintText: hintText,
            labelText: labelText,
            fillColor: filledColor,
            hintStyle: Theme.of(context)
                .textTheme
                .bodyText1!
                .copyWith(fontWeight: FontWeight.normal),
            errorBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.transparent)),
            errorStyle: Theme.of(context)
                .textTheme
                .bodyText2!
                .copyWith(fontWeight: FontWeight.normal),
            suffixIcon: suffixIcon,
            prefixIcon: prefixIcon,
          ),
          autocorrect: autocorrect,
          autofocus: autofocus,
          obscureText: obscure,
        ),
      ],
    );
  }
}
