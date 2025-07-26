import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../shared/models/user.dart';
import '../../../shared/services/api_service.dart';
import '../../../core/constants/app_constants.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(
    apiService: ref.read(apiServiceProvider),
    storage: const FlutterSecureStorage(),
  );
});

final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;
  final bool isAuthenticated;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
    this.isAuthenticated = false,
  });

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
    bool? isAuthenticated,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiService _apiService;
  final FlutterSecureStorage _storage;

  AuthNotifier({
    required ApiService apiService,
    required FlutterSecureStorage storage,
  }) : _apiService = apiService,
       _storage = storage,
       super(const AuthState()) {
    _initializeWithDemoUser();
  }

  void _initializeWithDemoUser() {
    // Create a demo user for immediate access
    final demoUser = User(
      id: 'demo_user_1',
      email: 'demo@booksy.com',
      name: 'Demo User',
      avatar: null,
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
      updatedAt: DateTime.now(),
      groupIds: ['group1', 'group2'],
      readingGoals: {'book1': 20, 'book2': 15},
    );

    state = state.copyWith(user: demoUser, isAuthenticated: true);
  }

  Future<void> _checkAuthStatus() async {
    final token = await _storage.read(key: AppConstants.tokenKey);
    if (token != null) {
      await _authenticateWithToken(token);
    }
  }

  Future<void> _authenticateWithToken(String token) async {
    try {
      state = state.copyWith(isLoading: true, error: null);

      final response = await _apiService.authenticate(token);
      final user = User.fromJson(response['user']);

      state = state.copyWith(
        user: user,
        isLoading: false,
        isAuthenticated: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
        isAuthenticated: false,
      );
      await _storage.delete(key: AppConstants.tokenKey);
    }
  }

  Future<void> login(String token) async {
    try {
      state = state.copyWith(isLoading: true, error: null);

      final response = await _apiService.authenticate(token);
      final user = User.fromJson(response['user']);
      final authToken = response['token'];

      await _storage.write(key: AppConstants.tokenKey, value: authToken);
      await _storage.write(
        key: AppConstants.userKey,
        value: user.toJson().toString(),
      );

      state = state.copyWith(
        user: user,
        isLoading: false,
        isAuthenticated: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
        isAuthenticated: false,
      );
    }
  }

  Future<void> logout() async {
    try {
      await _storage.delete(key: AppConstants.tokenKey);
      await _storage.delete(key: AppConstants.userKey);

      state = const AuthState();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}
