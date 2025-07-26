import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class SummaryScreen extends StatelessWidget {
  const SummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(title: const Text('Summary')),
      body: const Center(
        child: Text(
          'Summary Screen - Coming Soon!',
          style: TextStyle(fontSize: 18, color: AppTheme.secondaryColor),
        ),
      ),
    );
  }
}
