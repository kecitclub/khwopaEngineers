import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class Api {
  static const baseURL = 'http://192.168.1.125:3306';

  Future getTrackings() async {
    final response =
        await http.get(Uri.parse('$baseURL/api/traffic/trackings'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load trackings');
    }
  }
}
