import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import '../../../shared/models/book.dart';
import '../../../shared/services/api_service.dart';
import '../../auth/providers/auth_provider.dart';

final booksProvider = StateNotifierProvider<BooksNotifier, BooksState>((ref) {
  return BooksNotifier(apiService: ref.read(apiServiceProvider));
});

class BooksState {
  final List<Book> userBooks;
  final bool isLoading;
  final String? error;
  final bool isUploading;

  const BooksState({
    this.userBooks = const [],
    this.isLoading = false,
    this.error,
    this.isUploading = false,
  });

  BooksState copyWith({
    List<Book>? userBooks,
    bool? isLoading,
    String? error,
    bool? isUploading,
  }) {
    return BooksState(
      userBooks: userBooks ?? this.userBooks,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      isUploading: isUploading ?? this.isUploading,
    );
  }
}

class BooksNotifier extends StateNotifier<BooksState> {
  final ApiService _apiService;

  BooksNotifier({required ApiService apiService})
    : _apiService = apiService,
      super(const BooksState());

  Future<void> loadUserBooks() async {
    try {
      state = state.copyWith(isLoading: true, error: null);

      // Try to get data from backend first
      try {
        final books = await _apiService.getBooks();
        state = state.copyWith(userBooks: books, isLoading: false);
      } catch (e) {
        // If backend fails, use mock data as fallback
        print('Backend books failed, using mock data: $e');
        final mockUserBooks = [
          Book(
            id: 'user_book_1',
            title: 'Flutter Succinctly',
            author: 'Ed Freitas',
            description:
                'A comprehensive guide to Flutter development with practical examples and best practices. Learn to build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
            coverImage: null,
            fileUrl:
                'https://cdn.syncfusion.com/content/PDFViewer/flutter-succinctly.pdf',
            fileType: 'pdf',
            totalPages: 180,
            createdAt: DateTime.now().subtract(const Duration(days: 5)),
            updatedAt: DateTime.now().subtract(const Duration(days: 5)),
            tags: ['flutter', 'mobile', 'development', 'programming'],
            rating: 4.5,
            reviewCount: 1250,
            uploaderId: 'user_1',
          ),
          Book(
            id: 'user_book_2',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            description:
                'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan. Set in the Jazz Age on Long Island, the novel depicts first-person narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover.',
            coverImage: null,
            fileUrl: 'https://www.gutenberg.org/files/64317/64317-pdf.pdf',
            fileType: 'pdf',
            totalPages: 412,
            createdAt: DateTime.now().subtract(const Duration(days: 10)),
            updatedAt: DateTime.now().subtract(const Duration(days: 10)),
            tags: ['classic', 'romance', 'drama', 'literature'],
            rating: 4.8,
            reviewCount: 890,
            uploaderId: 'user_2',
          ),
        ];
        state = state.copyWith(userBooks: mockUserBooks, isLoading: false);
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> uploadBook() async {
    try {
      state = state.copyWith(isUploading: true, error: null);

      // Pick file
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'epub'],
        allowMultiple: false,
      );

      if (result != null) {
        final file = result.files.first;

        // Try to upload to backend first
        try {
          final uploadResult = await _apiService.uploadBook(
            filePath: file.path!,
            title: file.name.replaceAll(RegExp(r'\.(pdf|epub)$'), ''),
            author: 'Unknown Author',
            userId: 'demo_user_1', // TODO: Get actual user ID
          );

          // Create book record in backend
          final bookData = await _apiService.createBook({
            'title': uploadResult['title'],
            'author': uploadResult['author'],
            'fileUrl': uploadResult['fileUrl'],
            'uploaderId': 'demo_user_1',
          });

          final newBook = Book.fromJson(bookData);
          final updatedBooks = [newBook, ...state.userBooks];
          state = state.copyWith(userBooks: updatedBooks, isUploading: false);
        } catch (e) {
          // If backend upload fails, add locally
          print('Backend upload failed, adding locally: $e');
          final newBook = Book(
            id: 'user_book_${DateTime.now().millisecondsSinceEpoch}',
            title: file.name.replaceAll(RegExp(r'\.(pdf|epub)$'), ''),
            author: 'Unknown Author',
            description: 'Uploaded book',
            coverImage: null,
            fileUrl: file.path ?? '',
            fileType: file.extension?.toLowerCase() ?? 'pdf',
            totalPages: 100, // TODO: Get actual page count
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            tags: [],
            rating: null,
            reviewCount: 0,
            uploaderId: 'demo_user_1', // Using demo user ID
          );

          final updatedBooks = [newBook, ...state.userBooks];
          state = state.copyWith(userBooks: updatedBooks, isUploading: false);
        }
      } else {
        state = state.copyWith(isUploading: false);
      }
    } catch (e) {
      state = state.copyWith(isUploading: false, error: e.toString());
    }
  }

  Future<void> deleteBook(String bookId) async {
    try {
      // TODO: Replace with actual API call when backend is ready
      final updatedBooks =
          state.userBooks.where((book) => book.id != bookId).toList();
      state = state.copyWith(userBooks: updatedBooks);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}
