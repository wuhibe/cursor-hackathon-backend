class User {
  final String id;
  final String email;
  final String name;
  final String? avatar;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> groupIds;
  final Map<String, int> readingGoals;

  User({
    required this.id,
    required this.email,
    required this.name,
    this.avatar,
    required this.createdAt,
    required this.updatedAt,
    required this.groupIds,
    required this.readingGoals,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      avatar: json['avatar'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      groupIds: List<String>.from(json['groupIds'] ?? []),
      readingGoals: Map<String, int>.from(json['readingGoals'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'avatar': avatar,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'groupIds': groupIds,
      'readingGoals': readingGoals,
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? name,
    String? avatar,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? groupIds,
    Map<String, int>? readingGoals,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      avatar: avatar ?? this.avatar,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      groupIds: groupIds ?? this.groupIds,
      readingGoals: readingGoals ?? this.readingGoals,
    );
  }
}
