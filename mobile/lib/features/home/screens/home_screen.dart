import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/models/book.dart';
import '../providers/home_provider.dart';
import '../../auth/providers/auth_provider.dart';
import '../widgets/book_card.dart';
import '../widgets/post_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Load initial data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(homeProvider.notifier).loadFeed();
      ref.read(homeProvider.notifier).loadRecommendedBooks();
    });
  }

  @override
  Widget build(BuildContext context) {
    final homeState = ref.watch(homeProvider);
    final authState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('Booksy'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // TODO: Show notifications
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              ref.read(authProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(homeProvider.notifier).loadFeed();
          await ref.read(homeProvider.notifier).loadRecommendedBooks();
        },
        child: CustomScrollView(
          slivers: [
            // Reading Progress Section
            SliverToBoxAdapter(child: _buildReadingProgress()),

            // Recommended Books Section
            SliverToBoxAdapter(
              child: _buildRecommendedBooks(homeState.recommendedBooks),
            ),

            // Feed Section
            SliverToBoxAdapter(child: _buildFeedSection(homeState)),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Create new post
        },
        backgroundColor: AppTheme.primaryColor,
        child: const Icon(Icons.add, color: AppTheme.onPrimaryColor),
      ),
    );
  }

  Widget _buildReadingProgress() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryColor,
            AppTheme.primaryColor.withOpacity(0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.trending_up,
                color: AppTheme.onPrimaryColor,
                size: 24,
              ),
              const SizedBox(width: 8),
              Text(
                'Today\'s Reading Goal',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: AppTheme.onPrimaryColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '15 / 20 pages',
                      style: Theme.of(
                        context,
                      ).textTheme.headlineSmall?.copyWith(
                        color: AppTheme.onPrimaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '75% completed',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.onPrimaryColor.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ),
              CircularProgressIndicator(
                value: 0.75,
                backgroundColor: AppTheme.onPrimaryColor.withOpacity(0.3),
                valueColor: const AlwaysStoppedAnimation<Color>(
                  AppTheme.onPrimaryColor,
                ),
                strokeWidth: 8,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendedBooks(List<Book> books) {
    if (books.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            'Recommended for You',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: AppTheme.onBackgroundColor,
            ),
          ),
        ),
        SizedBox(
          height: 220, // Increased height to prevent overflow
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: books.length,
            itemBuilder: (context, index) {
              final book = books[index];
              return Container(
                width: 140,
                margin: const EdgeInsets.only(right: 16),
                child: BookCard(
                  book: book,
                  onTap: () {
                    context.go('${AppConstants.readerRoute}/${book.id}');
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFeedSection(HomeState homeState) {
    if (homeState.isLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (homeState.posts.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text(
            'No posts yet. Be the first to share!',
            style: TextStyle(color: AppTheme.secondaryColor, fontSize: 16),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            'Recent Activity',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: AppTheme.onBackgroundColor,
            ),
          ),
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: homeState.posts.length,
          itemBuilder: (context, index) {
            final post = homeState.posts[index];
            return PostCard(
              post: post,
              onTap: () {
                // TODO: Navigate to post detail
              },
            );
          },
        ),
      ],
    );
  }
}
