// lib/main.dart

import 'package:flutter/material.dart';
import 'blog.dart';
import 'blog_service.dart';

void main() {
  runApp(BlogApp());
}

class BlogApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Blog App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: BlogListScreen(),
    );
  }
}

class BlogListScreen extends StatefulWidget {
  @override
  _BlogListScreenState createState() => _BlogListScreenState();
}

class _BlogListScreenState extends State<BlogListScreen> {
  late Future<List<Blog>> futureBlogs;

  @override
  void initState() {
    super.initState();
    futureBlogs = BlogService().fetchBlogs();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Blogs'),
      ),
      body: FutureBuilder<List<Blog>>(
        future: futureBlogs,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No blogs found.'));
          }

          List<Blog> blogs = snapshot.data!;

          return ListView.builder(
            itemCount: blogs.length,
            itemBuilder: (context, index) {
              Blog blog = blogs[index];
              return ListTile(
                title: Text(blog.title),
                subtitle: Text(blog.content),
                trailing: Text('${blog.likes} likes'),
              );
            },
          );
        },
      ),
    );
  }
}
