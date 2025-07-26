import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import '../../../core/theme/app_theme.dart';
import '../providers/reader_provider.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';

class ReaderScreen extends ConsumerStatefulWidget {
  final String bookId;

  const ReaderScreen({super.key, required this.bookId});

  @override
  ConsumerState<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends ConsumerState<ReaderScreen> {
  @override
  void initState() {
    super.initState();
    // Load book data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(readerProvider.notifier).loadBook(widget.bookId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final readerState = ref.watch(readerProvider);

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(readerState.book?.title ?? 'Reader'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            } else {
              context.go(AppConstants.booksRoute);
            }
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.bookmark_outline),
            onPressed: () {
              // TODO: Add bookmark functionality
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // TODO: Show reader settings
            },
          ),
        ],
      ),
      body: _buildBody(readerState),
    );
  }

  Widget _buildBody(ReaderState readerState) {
    if (readerState.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (readerState.error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: AppTheme.errorColor),
            const SizedBox(height: 16),
            Text(
              'Error loading book',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(color: AppTheme.errorColor),
            ),
            const SizedBox(height: 8),
            Text(
              readerState.error!,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondaryColor),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                ref.read(readerProvider.notifier).clearError();
                ref.read(readerProvider.notifier).loadBook(widget.bookId);
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (readerState.book == null) {
      return const Center(
        child: Text(
          'Book not found',
          style: TextStyle(fontSize: 18, color: AppTheme.secondaryColor),
        ),
      );
    }

    final book = readerState.book!;

    // For now, show a placeholder for PDF/EPUB content
    // In a real app, you would use the actual file URL from the backend
    if (book.fileType.toLowerCase() == 'pdf') {
      return _buildPdfViewer(book);
    } else if (book.fileType.toLowerCase() == 'epub') {
      return _buildEpubViewer(book);
    } else {
      return _buildUnsupportedFormat(book);
    }
  }

  Widget _buildPdfViewer(book) {
    // Use the actual book URL from the book object
    return SfPdfViewer.network(
      book.fileUrl,
      canShowPaginationDialog: true,
      canShowScrollHead: true,
      canShowScrollStatus: true,
      enableDoubleTapZooming: true,
      enableTextSelection: true,
      onPageChanged: (PdfPageChangedDetails details) {
        // Update reading progress
        ref
            .read(readerProvider.notifier)
            .updateReadingProgress(
              bookId: book.id,
              pageNumber: details.newPageNumber,
            );
      },
    );
  }

  Widget _buildEpubViewer(book) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.book, size: 64, color: AppTheme.primaryColor),
          const SizedBox(height: 16),
          Text(
            'EPUB Reader - Coming Soon!',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: AppTheme.onBackgroundColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'EPUB support will be added soon',
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondaryColor),
          ),
        ],
      ),
    );
  }

  Widget _buildUnsupportedFormat(book) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: AppTheme.errorColor),
          const SizedBox(height: 16),
          Text(
            'Unsupported Format',
            style: Theme.of(
              context,
            ).textTheme.headlineSmall?.copyWith(color: AppTheme.errorColor),
          ),
          const SizedBox(height: 8),
          Text(
            'This file format is not supported yet',
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondaryColor),
          ),
        ],
      ),
    );
  }
}
