import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import '../models/book.dart';
import '../../core/constants/app_constants.dart';
import '../models/post.dart';

class ApiService {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: AppConstants.tokenKey);
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          if (error.response?.statusCode == 401) {
            // Handle unauthorized access
            _storage.delete(key: AppConstants.tokenKey);
          }
          handler.next(error);
        },
      ),
    );
  }

  // Authentication
  Future<Map<String, dynamic>> authenticate(String token) async {
    try {
      final response = await _dio.post(
        AppConstants.authEndpoint,
        data: {'token': token},
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Books
  Future<List<Book>> getBooks() async {
    try {
      final response = await _dio.get(AppConstants.booksEndpoint);
      return (response.data as List)
          .map((json) => Book.fromJson(json))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Book> getBook(String bookId) async {
    try {
      final response = await _dio.get('${AppConstants.booksEndpoint}/$bookId');
      return Book.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> createBook(Map<String, dynamic> bookData) async {
    try {
      final response = await _dio.post(
        AppConstants.booksEndpoint,
        data: bookData,
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Reading Progress
  Future<void> updateReadingProgress({
    required String bookId,
    required int pageNumber,
  }) async {
    try {
      await _dio.post(
        AppConstants.readingProgressEndpoint,
        data: {'bookId': bookId, 'pageNumber': pageNumber},
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getReadingProgress(String bookId) async {
    try {
      final response = await _dio.get(
        '${AppConstants.readingProgressEndpoint}/$bookId',
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Summaries
  Future<Map<String, dynamic>> submitSummary({
    required String bookId,
    required String content,
  }) async {
    try {
      final response = await _dio.post(
        AppConstants.summariesEndpoint,
        data: {'bookId': bookId, 'content': content},
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getAiFeedback(String summaryId) async {
    try {
      final response = await _dio.get(
        '${AppConstants.aiFeedbackEndpoint}/$summaryId',
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Groups
  Future<List<Map<String, dynamic>>> getGroups() async {
    try {
      final response = await _dio.get(AppConstants.groupsEndpoint);
      return List<Map<String, dynamic>>.from(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> createGroup({
    required String name,
    required String description,
    required int pagesPerDay,
  }) async {
    try {
      final response = await _dio.post(
        AppConstants.groupsEndpoint,
        data: {
          'name': name,
          'description': description,
          'pagesPerDay': pagesPerDay,
        },
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> joinGroup(String groupId) async {
    try {
      await _dio.post('${AppConstants.groupsEndpoint}/$groupId/join');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Chats
  Future<List<Map<String, dynamic>>> getChats() async {
    try {
      final response = await _dio.get(AppConstants.chatsEndpoint);
      return List<Map<String, dynamic>>.from(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Map<String, dynamic>>> getChatMessages(String chatId) async {
    try {
      final response = await _dio.get(
        '${AppConstants.chatsEndpoint}/$chatId/messages',
      );
      return List<Map<String, dynamic>>.from(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> sendMessage({
    required String chatId,
    required String content,
  }) async {
    try {
      await _dio.post(
        '${AppConstants.chatsEndpoint}/$chatId/messages',
        data: {'content': content},
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Posts/Feed
  Future<List<Post>> getFeed() async {
    try {
      final response = await _dio.get(AppConstants.postsEndpoint);
      return (response.data as List)
          .map((json) => Post.fromJson(json))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Post> createPost({
    required String content,
    String? bookId,
    required String authorId,
  }) async {
    try {
      final response = await _dio.post(
        AppConstants.postsEndpoint,
        data: {
          'content': content,
          if (bookId != null) 'bookId': bookId,
          'authorId': authorId,
        },
      );
      return Post.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Users
  Future<Map<String, dynamic>> createUser({
    required String username,
    required String email,
    String? bio,
  }) async {
    try {
      final response = await _dio.post(
        AppConstants.usersEndpoint,
        data: {
          'username': username,
          'email': email,
          if (bio != null) 'bio': bio,
        },
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getUser(String userId) async {
    try {
      final response = await _dio.get('${AppConstants.usersEndpoint}/$userId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // File Upload
  Future<Map<String, dynamic>> uploadBook({
    required String filePath,
    required String title,
    required String author,
    required String userId,
  }) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
        'title': title,
        'author': author,
        'userId': userId,
      });

      final response = await _dio.post(
        '${AppConstants.uploadEndpoint}/book',
        data: formData,
      );
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<String> getFileUrl({
    required String bucket,
    required String fileName,
    int? expiry,
  }) async {
    try {
      final response = await _dio.get(
        '${AppConstants.uploadEndpoint}/url/$bucket/$fileName',
        queryParameters: {if (expiry != null) 'expiry': expiry},
      );
      return response.data['url'];
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Error handling
  Exception _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return Exception(
            'Connection timeout. Please check your internet connection.',
          );
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          final message = error.response?.data?['message'] ?? 'Server error';
          return Exception('Error $statusCode: $message');
        case DioExceptionType.cancel:
          return Exception('Request cancelled');
        default:
          return Exception('Network error occurred');
      }
    }
    return Exception('An unexpected error occurred');
  }
}
