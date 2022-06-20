import 'package:logger/logger.dart';

class SimpleLogPrinter extends LogPrinter {
  final String className;
  SimpleLogPrinter(this.className);
  @override
  List<String> log(LogEvent event) {
    DateTime dateTime = DateTime.now();
    //var color = PrettyPrinter.levelColors[event.level];
    var emoji = PrettyPrinter.levelEmojis[event.level];
    return ['${dateTime.toUtc()} $emoji $className - ${event.message}'];
    //println(color('$emoji $className - ${event.message}'));
  }
}
