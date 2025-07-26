import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/models/book.dart';
import '../../../shared/models/post.dart';
import '../../../shared/services/api_service.dart';
import '../../auth/providers/auth_provider.dart';

final homeProvider = StateNotifierProvider<HomeNotifier, HomeState>((ref) {
  return HomeNotifier(apiService: ref.read(apiServiceProvider));
});

class HomeState {
  final List<Post> posts;
  final List<Book> recommendedBooks;
  final bool isLoading;
  final String? error;

  const HomeState({
    this.posts = const [],
    this.recommendedBooks = const [],
    this.isLoading = false,
    this.error,
  });

  HomeState copyWith({
    List<Post>? posts,
    List<Book>? recommendedBooks,
    bool? isLoading,
    String? error,
  }) {
    return HomeState(
      posts: posts ?? this.posts,
      recommendedBooks: recommendedBooks ?? this.recommendedBooks,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class HomeNotifier extends StateNotifier<HomeState> {
  final ApiService _apiService;

  HomeNotifier({required ApiService apiService})
    : _apiService = apiService,
      super(const HomeState());

  Future<void> loadFeed() async {
    try {
      state = state.copyWith(isLoading: true, error: null);

      // Try to get data from backend first
      try {
        final posts = await _apiService.getFeed();
        state = state.copyWith(posts: posts, isLoading: false);
      } catch (e) {
        // If backend fails, use mock data as fallback
        print('Backend feed failed, using mock data: $e');
        final mockPosts = [
          Post(
            id: 'post_1',
            content:
                'Just finished reading "The Great Gatsby"! What a masterpiece. The way Fitzgerald captures the American Dream is absolutely brilliant. Highly recommend! 📚✨',
            bookId: 'book_1',
            authorId: 'user_1',
            userName: 'Sarah Johnson',
            userAvatar: null,
            bookTitle: 'The Great Gatsby',
            bookAuthor: 'F. Scott Fitzgerald',
            likes: 24,
            comments: 8,
            createdAt: DateTime.now().subtract(const Duration(hours: 2)),
            updatedAt: DateTime.now().subtract(const Duration(hours: 2)),
          ),
          Post(
            id: 'post_2',
            content:
                'Started learning Flutter today with "Flutter Succinctly". The examples are so clear and practical. Can\'t wait to build my first app! 🚀 #FlutterDev',
            bookId: 'book_2',
            authorId: 'user_2',
            userName: 'Mike Chen',
            userAvatar: null,
            bookTitle: 'Flutter Succinctly',
            bookAuthor: 'Ed Freitas',
            likes: 18,
            comments: 12,
            createdAt: DateTime.now().subtract(const Duration(hours: 4)),
            updatedAt: DateTime.now().subtract(const Duration(hours: 4)),
          ),
        ];
        state = state.copyWith(posts: mockPosts, isLoading: false);
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadRecommendedBooks() async {
    try {
      // Try to get data from backend first
      try {
        final books = await _apiService.getBooks();
        state = state.copyWith(recommendedBooks: books);
      } catch (e) {
        // If backend fails, use mock data as fallback
        print('Backend books failed, using mock data: $e');
        final mockRecommendedBooks = [
          Book(
            id: 'rec_book_1',
            title: '1984',
            author: 'George Orwell',
            description:
                'A dystopian social science fiction novel and cautionary tale.',
            coverImage: null,
            fileUrl: 'https://www.gutenberg.org/files/3280/3280-pdf.pdf',
            fileType: 'pdf',
            totalPages: 328,
            createdAt: DateTime.now().subtract(const Duration(days: 30)),
            updatedAt: DateTime.now().subtract(const Duration(days: 30)),
            tags: ['dystopian', 'fiction', 'classic'],
            rating: 4.6,
            reviewCount: 2100,
            uploaderId: 'user_1',
          ),
          Book(
            id: 'rec_book_2',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            description:
                'A story of racial injustice and the loss of innocence in the American South.',
            coverImage: null,
            fileUrl: 'https://www.gutenberg.org/files/26508/26508-pdf.pdf',
            fileType: 'pdf',
            totalPages: 376,
            createdAt: DateTime.now().subtract(const Duration(days: 25)),
            updatedAt: DateTime.now().subtract(const Duration(days: 25)),
            tags: ['classic', 'drama', 'social-justice'],
            rating: 4.8,
            reviewCount: 1800,
            uploaderId: 'user_2',
          ),
          Book(
            id: 'rec_book_3',
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            description:
                'A fantasy novel about a hobbit\'s journey to reclaim a dwarf kingdom.',
            coverImage: null,
            fileUrl: 'https://www.gutenberg.org/files/11/11-pdf.pdf',
            fileType: 'pdf',
            totalPages: 310,
            createdAt: DateTime.now().subtract(const Duration(days: 20)),
            updatedAt: DateTime.now().subtract(const Duration(days: 20)),
            tags: ['fantasy', 'adventure', 'classic'],
            rating: 4.7,
            reviewCount: 2200,
            uploaderId: 'user_3',
          ),
        ];
        state = state.copyWith(recommendedBooks: mockRecommendedBooks);
      }
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}
