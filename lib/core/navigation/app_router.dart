import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_constants.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/books/screens/books_screen.dart';
import '../../features/reader/screens/reader_screen.dart';
import '../../features/groups/screens/groups_screen.dart';
import '../../features/chat/screens/chat_screen.dart';
import '../../features/summary/screens/summary_screen.dart';
import '../../features/auth/providers/auth_provider.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation:
        authState.isAuthenticated
            ? AppConstants.homeRoute
            : AppConstants.loginRoute,
    redirect: (context, state) {
      final isAuthenticated = authState.isAuthenticated;
      final isLoginRoute = state.matchedLocation == AppConstants.loginRoute;

      if (!isAuthenticated && !isLoginRoute) {
        return AppConstants.loginRoute;
      }

      if (isAuthenticated && isLoginRoute) {
        return AppConstants.homeRoute;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppConstants.loginRoute,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppConstants.homeRoute,
        builder: (context, state) => const MainScaffold(child: HomeScreen()),
      ),
      GoRoute(
        path: AppConstants.booksRoute,
        builder: (context, state) => const MainScaffold(child: BooksScreen()),
      ),
      GoRoute(
        path: AppConstants.groupsRoute,
        builder: (context, state) => const MainScaffold(child: GroupsScreen()),
      ),
      GoRoute(
        path: AppConstants.chatRoute,
        builder: (context, state) => const MainScaffold(child: ChatScreen()),
      ),
      GoRoute(
        path: AppConstants.summaryRoute,
        builder: (context, state) => const MainScaffold(child: SummaryScreen()),
      ),
      GoRoute(
        path: '${AppConstants.readerRoute}/:bookId',
        builder: (context, state) {
          final bookId = state.pathParameters['bookId']!;
          return ReaderScreen(bookId: bookId);
        },
      ),
    ],
  );
});

class MainScaffold extends ConsumerStatefulWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  @override
  ConsumerState<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends ConsumerState<MainScaffold> {
  int _currentIndex = 0;

  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: Icons.home_outlined,
      activeIcon: Icons.home,
      label: 'Home',
      route: AppConstants.homeRoute,
    ),
    NavigationItem(
      icon: Icons.book_outlined,
      activeIcon: Icons.book,
      label: 'Books',
      route: AppConstants.booksRoute,
    ),
    NavigationItem(
      icon: Icons.group_outlined,
      activeIcon: Icons.group,
      label: 'Groups',
      route: AppConstants.groupsRoute,
    ),
    NavigationItem(
      icon: Icons.chat_outlined,
      activeIcon: Icons.chat,
      label: 'Chat',
      route: AppConstants.chatRoute,
    ),
    NavigationItem(
      icon: Icons.summarize_outlined,
      activeIcon: Icons.summarize,
      label: 'Summary',
      route: AppConstants.summaryRoute,
    ),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _updateCurrentIndex();
    });
  }

  void _updateCurrentIndex() {
    final currentRoute = GoRouterState.of(context).uri.path;
    final index = _navigationItems.indexWhere(
      (item) => item.route == currentRoute,
    );
    if (index != -1 && index != _currentIndex) {
      setState(() {
        _currentIndex = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
          context.go(_navigationItems[index].route);
        },
        type: BottomNavigationBarType.fixed,
        items:
            _navigationItems.map((item) {
              return BottomNavigationBarItem(
                icon: Icon(
                  _currentIndex == _navigationItems.indexOf(item)
                      ? item.activeIcon
                      : item.icon,
                ),
                label: item.label,
              );
            }).toList(),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final String route;

  NavigationItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.route,
  });
}
