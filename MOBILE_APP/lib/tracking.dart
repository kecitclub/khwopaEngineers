import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class TrackingList extends StatefulWidget {
  const TrackingList({super.key});

  @override
  TrackingListState createState() => TrackingListState();
}

class TrackingListState extends State<TrackingList> {
  List<Map<String, dynamic>> _trackings = [];
  bool _isLoading = true;
  late WebSocketChannel _channel;

  @override
  void initState() {
    super.initState();
    _initializeWebSocket();
  }

  // Initialize WebSocket connection
  void _initializeWebSocket() {
    _channel = WebSocketChannel.connect(
      Uri.parse('ws://192.168.1.125:3306'),
    );

    _channel.stream.listen(
      (message) {
        final List<dynamic> data = jsonDecode(message);
        setState(() {
          _trackings = data
              .map((item) => {
                    'number_plate': item['number_plate'],
                    'description': item['description'],
                    'isAlert':
                        false, // Default to false, adjust based on your logic
                  })
              .toList();
          _isLoading = false;
        });
      },
      onError: (error) {
        print('WebSocket Error: $error');
      },
      onDone: () {
        print('WebSocket connection closed');
      },
    );
  }

  @override
  void dispose() {
    _channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tracking List'),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: _trackings.length,
              itemBuilder: (context, index) {
                final tracking = _trackings[index];
                return TrackingItem(
                  numberPlate: tracking['number_plate'],
                  description: tracking['description'],
                  isAlert: tracking['isAlert'],
                  onTap: () {
                    // Handle navigation to detailed view
                    debugPrint('Tapped on ${tracking['number_plate']}');
                  },
                );
              },
            ),
    );
  }
}

class TrackingItem extends StatelessWidget {
  final String numberPlate;
  final String description;
  final bool isAlert;
  final VoidCallback onTap;

  const TrackingItem({
    required this.numberPlate,
    required this.description,
    required this.isAlert,
    required this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 8.0),
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: isAlert ? Colors.red.shade100 : Colors.white,
            borderRadius: BorderRadius.circular(12.0),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                offset: Offset(0, 2),
                blurRadius: 6.0,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      numberPlate,
                      style: const TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4.0),
                    // Description (truncated if needed)
                    Text(
                      description,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 14.0,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              // Trailing Icon
              const Icon(
                Icons.chevron_right,
                color: Colors.grey,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
