class WcRegMobile {
  String? native;
  String? universal;

  // fromJson
  WcRegMobile.fromJson(Map<String, dynamic> json) {
    native = json['native'];
    universal = json['universal'];
  }
}
