class Post {
  final String id;
  final String content;
  final String? bookId;
  final String authorId; // Changed from userId to authorId to match backend
  final String userName; // This might come from joined user data
  final String? userAvatar;
  final String? bookTitle; // This might come from joined book data
  final String? bookAuthor; // This might come from joined book data
  final int likes;
  final int comments;
  final DateTime createdAt;
  final DateTime updatedAt;

  Post({
    required this.id,
    required this.content,
    this.bookId,
    required this.authorId,
    this.userName = '',
    this.userAvatar,
    this.bookTitle,
    this.bookAuthor,
    this.likes = 0,
    this.comments = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      content: json['content'],
      bookId: json['bookId'],
      authorId: json['authorId'],
      userName: json['userName'] ?? json['author']?['username'] ?? '',
      userAvatar: json['userAvatar'] ?? json['author']?['avatar'],
      bookTitle: json['bookTitle'] ?? json['book']?['title'],
      bookAuthor: json['bookAuthor'] ?? json['book']?['author'],
      likes: json['likes'] ?? 0,
      comments: json['comments'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': content,
      'bookId': bookId,
      'authorId': authorId,
      'userName': userName,
      'userAvatar': userAvatar,
      'bookTitle': bookTitle,
      'bookAuthor': bookAuthor,
      'likes': likes,
      'comments': comments,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Post copyWith({
    String? id,
    String? content,
    String? bookId,
    String? authorId,
    String? userName,
    String? userAvatar,
    String? bookTitle,
    String? bookAuthor,
    int? likes,
    int? comments,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Post(
      id: id ?? this.id,
      content: content ?? this.content,
      bookId: bookId ?? this.bookId,
      authorId: authorId ?? this.authorId,
      userName: userName ?? this.userName,
      userAvatar: userAvatar ?? this.userAvatar,
      bookTitle: bookTitle ?? this.bookTitle,
      bookAuthor: bookAuthor ?? this.bookAuthor,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
