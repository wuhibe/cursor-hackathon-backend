import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/models/book.dart';
import '../providers/books_provider.dart';
import '../widgets/book_grid_item.dart';

class BooksScreen extends ConsumerStatefulWidget {
  const BooksScreen({super.key});

  @override
  ConsumerState<BooksScreen> createState() => _BooksScreenState();
}

class _BooksScreenState extends ConsumerState<BooksScreen> {
  @override
  void initState() {
    super.initState();
    // Load user books
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(booksProvider.notifier).loadUserBooks();
    });
  }

  @override
  Widget build(BuildContext context) {
    final booksState = ref.watch(booksProvider);

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('My Books'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(booksProvider.notifier).loadUserBooks();
        },
        child: _buildBody(booksState),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed:
            booksState.isUploading
                ? null
                : () {
                  ref.read(booksProvider.notifier).uploadBook();
                },
        backgroundColor: AppTheme.primaryColor,
        child:
            booksState.isUploading
                ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      AppTheme.onPrimaryColor,
                    ),
                  ),
                )
                : const Icon(Icons.upload_file, color: AppTheme.onPrimaryColor),
      ),
    );
  }

  Widget _buildBody(BooksState booksState) {
    if (booksState.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (booksState.error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: AppTheme.errorColor),
            const SizedBox(height: 16),
            Text(
              'Error loading books',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(color: AppTheme.errorColor),
            ),
            const SizedBox(height: 8),
            Text(
              booksState.error!,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondaryColor),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                ref.read(booksProvider.notifier).clearError();
                ref.read(booksProvider.notifier).loadUserBooks();
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (booksState.userBooks.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.library_books_outlined,
              size: 64,
              color: AppTheme.secondaryColor,
            ),
            const SizedBox(height: 16),
            Text(
              'No books yet',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: AppTheme.onBackgroundColor,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Upload your first book to get started',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondaryColor),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                ref.read(booksProvider.notifier).uploadBook();
              },
              icon: const Icon(Icons.upload_file),
              label: const Text('Upload Book'),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Text(
                '${booksState.userBooks.length} Books',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppTheme.onBackgroundColor,
                ),
              ),
              const Spacer(),
              if (booksState.isUploading)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          AppTheme.primaryColor,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Uploading...',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.primaryColor,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ),
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: booksState.userBooks.length,
            itemBuilder: (context, index) {
              final book = booksState.userBooks[index];
              return BookGridItem(
                book: book,
                onTap: () {
                  context.go('${AppConstants.readerRoute}/${book.id}');
                },
                onDelete: () {
                  _showDeleteDialog(book);
                },
              );
            },
          ),
        ),
      ],
    );
  }

  void _showDeleteDialog(Book book) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Delete Book'),
            content: Text('Are you sure you want to delete "${book.title}"?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  ref.read(booksProvider.notifier).deleteBook(book.id);
                },
                style: TextButton.styleFrom(
                  foregroundColor: AppTheme.errorColor,
                ),
                child: const Text('Delete'),
              ),
            ],
          ),
    );
  }
}
