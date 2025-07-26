import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/models/book.dart';
import '../../../shared/services/api_service.dart';
import '../../auth/providers/auth_provider.dart';
import '../../books/providers/books_provider.dart';

final readerProvider = StateNotifierProvider<ReaderNotifier, ReaderState>((
  ref,
) {
  return ReaderNotifier(
    apiService: ref.read(apiServiceProvider),
    booksNotifier: ref.read(booksProvider.notifier),
  );
});

class ReaderState {
  final Book? book;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final int totalPages;

  const ReaderState({
    this.book,
    this.isLoading = false,
    this.error,
    this.currentPage = 1,
    this.totalPages = 0,
  });

  ReaderState copyWith({
    Book? book,
    bool? isLoading,
    String? error,
    int? currentPage,
    int? totalPages,
  }) {
    return ReaderState(
      book: book ?? this.book,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
    );
  }
}

class ReaderNotifier extends StateNotifier<ReaderState> {
  final ApiService _apiService;
  final BooksNotifier _booksNotifier;

  ReaderNotifier({
    required ApiService apiService,
    required BooksNotifier booksNotifier,
  }) : _apiService = apiService,
       _booksNotifier = booksNotifier,
       super(const ReaderState());

  Future<void> loadBook(String bookId) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      final book = await _apiService.getBook(bookId);
      state = state.copyWith(
        book: book,
        isLoading: false,
        totalPages: book.totalPages,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> updateReadingProgress({
    required String bookId,
    required int pageNumber,
  }) async {
    try {
      // Update local state immediately for smooth UX
      state = state.copyWith(currentPage: pageNumber);

      // TODO: Replace with actual API call when backend is ready
      // await _apiService.updateReadingProgress(
      //   bookId: bookId,
      //   pageNumber: pageNumber,
      // );
    } catch (e) {
      // Don't show error for progress updates to avoid interrupting reading
      print('Error updating reading progress: $e');
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}
