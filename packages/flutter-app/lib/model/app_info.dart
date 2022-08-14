/// Info of mobile app
/// crypto wallet was design for web3 dapp so it need an url, mobile apps can use its homepage
/// icons is list link, with web3 dapp, it is favicon link or logo link
class AppInfo {
  final String? url;
  final String? name;
  final String? description;
  final List<String>? icons;

  AppInfo({
    this.url,
    this.name,
    this.description,
    this.icons,
  });
}