import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(title: const Text('Chat')),
      body: const Center(
        child: Text(
          'Chat Screen - Coming Soon!',
          style: TextStyle(fontSize: 18, color: AppTheme.secondaryColor),
        ),
      ),
    );
  }
}
