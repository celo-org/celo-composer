import 'dart:convert';

import 'package:flutter_celo_composer/infrastructures/repository/secure_storage_repository.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';

class WalletConnectSecureStorage implements SessionStorage {
  WalletConnectSecureStorage({this.storageKey = 'wc_session'});

  final String storageKey;
  final SecureStorageRepository _storage = SecureStorageRepository();

  @override
  Future<WalletConnectSession?> getSession() async {
    final String? json = await _storage.read(key: storageKey);
    if (json == null) {
      return null;
    }

    try {
      final Map<String, dynamic> data = jsonDecode(json);
      return WalletConnectSession.fromJson(data);
    } on FormatException {
      return null;
    }
  }

  @override
  Future<void> store(WalletConnectSession session) async {
    await _storage.write(key: storageKey, value: jsonEncode(session.toJson()));
  }

  @override
  Future<void> removeSession() async {
    await _storage.delete(key: storageKey);
  }
}
