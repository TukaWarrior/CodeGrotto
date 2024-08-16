// lib/blog_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'blog.dart';

class BlogService {
  final String baseUrlWindows = 'http://localhost:8080/blogs'; // When run in Windows Emulator
  final String baseUrlAndroid = 'http://10.0.2.2:8080/blogs'; // When run in Android Emulator
  final String baseUrlLocalPC = 'http://192.168.1.201:8080/blogs'; // When run on Smartphone. Local IP of host device.


  Future<List<Blog>> fetchBlogs() async {
    // final response = await http.get(Uri.parse("$baseUrl$path"));
    final response = await http.get(Uri.parse(baseUrlLocalPC));

    if (response.statusCode == 200) {
      List<dynamic> body = json.decode(response.body);
      List<Blog> blogs = body.map((dynamic item) => Blog.fromJson(item)).toList();
      return blogs;
    } else {
      throw Exception('Failed to load blogs');
    }
  }
}
