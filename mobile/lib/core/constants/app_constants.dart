class AppConstants {
  // API Base URL
  static const String baseUrl =
      'https://verified-adder-adequately.ngrok-free.app/api';

  // API Endpoints - Updated to match backend
  static const String authEndpoint = '/auth/betterauth';
  static const String booksEndpoint = '/books';
  static const String postsEndpoint = '/posts';
  static const String feedEndpoint = '/posts'; // Backend uses /posts for feed
  static const String readingProgressEndpoint = '/reading-progress';
  static const String summariesEndpoint = '/summaries';
  static const String groupsEndpoint = '/groups';
  static const String chatsEndpoint = '/chats';
  static const String aiFeedbackEndpoint = '/summaries/ai-feedback';
  static const String uploadEndpoint = '/upload';
  static const String usersEndpoint = '/users';

  // App Routes
  static const String loginRoute = '/login';
  static const String homeRoute = '/home';
  static const String booksRoute = '/books';
  static const String readerRoute = '/reader';
  static const String groupsRoute = '/groups';
  static const String chatRoute = '/chat';
  static const String summaryRoute = '/summary';
  static const String profileRoute = '/profile';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'app_theme';

  // Reading Goals
  static const int defaultPagesPerDay = 20;
  static const int maxPagesPerDay = 100;

  // File Types
  static const List<String> supportedFileTypes = ['pdf', 'epub'];

  // Notification Topics
  static const String readingReminderTopic = 'reading_reminder';
  static const String summaryCompleteTopic = 'summary_complete';
  static const String newMessageTopic = 'new_message';
  static const String groupInviteTopic = 'group_invite';
}
