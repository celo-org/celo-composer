import 'package:flutter/material.dart';

class Height5 extends StatelessWidget {
  const Height5({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(height: 5);
  }
}

class Height10 extends StatelessWidget {
  const Height10({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(height: 10);
  }
}

class Height15 extends StatelessWidget {
  const Height15({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(height: 15);
  }
}

class Height20 extends StatelessWidget {
  const Height20({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(height: 20);
  }
}

class CustomHeight extends StatelessWidget {
  final double height;
  const CustomHeight({Key? key, this.height = 30}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(height: height);
  }
}

// Width Spacers
class Width3 extends StatelessWidget {
  const Width3({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(width: 3);
  }
}

class Width5 extends StatelessWidget {
  const Width5({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(width: 5);
  }
}

class Width10 extends StatelessWidget {
  const Width10({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(width: 10);
  }
}

class Width15 extends StatelessWidget {
  const Width15({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(width: 15);
  }
}

class Width20 extends StatelessWidget {
  const Width20({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const SizedBox(width: 20);
  }
}

class CustomWidth extends StatelessWidget {
  final double width;
  const CustomWidth({Key? key, this.width = 30}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(width: width);
  }
}

