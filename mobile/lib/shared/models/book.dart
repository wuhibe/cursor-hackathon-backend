class Book {
  final String id;
  final String title;
  final String author;
  final String? description;
  final String? coverImage;
  final String fileUrl;
  final String fileType;
  final int totalPages;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> tags;
  final double? rating;
  final int reviewCount;
  final String uploaderId; // Added to match backend schema

  Book({
    required this.id,
    required this.title,
    required this.author,
    this.description,
    this.coverImage,
    required this.fileUrl,
    required this.fileType,
    required this.totalPages,
    required this.createdAt,
    required this.updatedAt,
    this.tags = const [],
    this.rating,
    this.reviewCount = 0,
    required this.uploaderId,
  });

  factory Book.fromJson(Map<String, dynamic> json) {
    return Book(
      id: json['id'],
      title: json['title'],
      author: json['author'],
      description: json['description'],
      coverImage: json['coverImage'],
      fileUrl: json['fileUrl'],
      fileType: json['fileType'],
      totalPages: json['totalPages'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      tags: List<String>.from(json['tags'] ?? []),
      rating: json['rating']?.toDouble(),
      reviewCount: json['reviewCount'] ?? 0,
      uploaderId: json['uploaderId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'author': author,
      'description': description,
      'coverImage': coverImage,
      'fileUrl': fileUrl,
      'fileType': fileType,
      'totalPages': totalPages,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'tags': tags,
      'rating': rating,
      'reviewCount': reviewCount,
      'uploaderId': uploaderId,
    };
  }

  Book copyWith({
    String? id,
    String? title,
    String? author,
    String? description,
    String? coverImage,
    String? fileUrl,
    String? fileType,
    int? totalPages,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? tags,
    double? rating,
    int? reviewCount,
    String? uploaderId,
  }) {
    return Book(
      id: id ?? this.id,
      title: title ?? this.title,
      author: author ?? this.author,
      description: description ?? this.description,
      coverImage: coverImage ?? this.coverImage,
      fileUrl: fileUrl ?? this.fileUrl,
      fileType: fileType ?? this.fileType,
      totalPages: totalPages ?? this.totalPages,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      tags: tags ?? this.tags,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      uploaderId: uploaderId ?? this.uploaderId,
    );
  }
}
