/// Wallet Mobile app
/// universal link & deeplink should end with '/'
class CryptoWallet {
  static const CryptoWallet metamask = CryptoWallet(
      universalLink: 'https://metamask.app.link/', deeplink: 'metamask://');
  static const CryptoWallet trustWallet = CryptoWallet(
      universalLink: 'https://link.trustwallet.com/', deeplink: 'trust://');
  static const CryptoWallet rainbowMe = CryptoWallet(
      universalLink: 'https://rainbow.me/', deeplink: 'rainbow://');
  static const CryptoWallet talken =
      CryptoWallet(universalLink: 'https://talken.io');

  /// universal link for iOS
  final String universalLink;

  /// deeplink for android
  final String? deeplink;

  const CryptoWallet({
    required this.universalLink,
    this.deeplink,
  });
}
