import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class GroupsScreen extends StatelessWidget {
  const GroupsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('Groups'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // TODO: Create new group
            },
          ),
        ],
      ),
      body: const Center(
        child: Text(
          'Groups Screen - Coming Soon!',
          style: TextStyle(fontSize: 18, color: AppTheme.secondaryColor),
        ),
      ),
    );
  }
}
