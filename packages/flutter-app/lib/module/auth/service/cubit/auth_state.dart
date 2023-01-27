part of 'auth_cubit.dart';

class AuthState {
  const AuthState();
}

class EstablishConnectionLoading extends AuthState {
  EstablishConnectionLoading();
}

class EstablishConnectionSuccess extends AuthState {
  const EstablishConnectionSuccess({
    required this.session,
    required this.connector,
    required this.uri,
  });

  final dynamic session;
  final WalletConnect connector;
  final String uri;
}

class EstablishConnectionFailed extends AuthState {
  const EstablishConnectionFailed({
    required this.errorCode,
    required this.message,
  });

  final String errorCode;
  final String message;
}

class SessionDisconnected extends AuthState {
  SessionDisconnected();
}

class LoginWithMetamaskLoading extends AuthState {
  LoginWithMetamaskLoading();
}

class LoginWithMetamaskSuccess extends AuthState {
  const LoginWithMetamaskSuccess({required this.url});

  final String url;
}

class LoginWithMetamaskFailed extends AuthState {
  const LoginWithMetamaskFailed({
    required this.errorCode,
    required this.message,
  });

  final String errorCode;
  final String message;
}
