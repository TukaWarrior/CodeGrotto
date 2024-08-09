// lib/blog.dart

class Blog {
  final int id;
  final String title;
  final String content;
  final DateTime createdAt;
  final DateTime editedAt;
  final int likes;

  Blog({
    required this.id,
    required this.title,
    required this.content,
    required this.createdAt,
    required this.editedAt,
    required this.likes,
  });

  factory Blog.fromJson(Map<String, dynamic> json) {
    return Blog(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      createdAt: DateTime.parse(json['createdAt']),
      editedAt: DateTime.parse(json['editedAt']),
      likes: json['likes'],
    );
  }
}
