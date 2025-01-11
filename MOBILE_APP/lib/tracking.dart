// tracking.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:http/http.dart' as http;

class TrackingList extends StatefulWidget {
  final String username;
  const TrackingList({
    required this.username,
    super.key,
  });

  @override
  TrackingListState createState() => TrackingListState();
}

class TrackingListState extends State<TrackingList> {
  List<Map<String, dynamic>> _trackings = [];
  bool _isLoading = true;
  late WebSocketChannel _channel;
  final AudioPlayer _audioPlayer = AudioPlayer();

  @override
  void initState() {
    super.initState();
    _initializeWebSocket();
  }

  void _playAlertSound(String alertType) async {
    try {
      if (alertType == 'critical') {
        await _audioPlayer.play(AssetSource('sounds/critical_alert.mp3'));
      } else {
        await _audioPlayer.play(AssetSource('sounds/general_alert.mp3'));
      }
    } catch (e) {
      debugPrint('Error playing sound: $e');
    }
  }

  // Initialize WebSocket connection
  void _initializeWebSocket() {
    _channel = WebSocketChannel.connect(
      Uri.parse('ws://192.168.1.133:3306'),
    );

    _channel.stream.listen(
      (message) {
        final data = jsonDecode(message);
        if (data['type'] == 'alert') {
          // Handle new alert
          _handleAlert(data['alert']);
        } else {
          // Handle tracking updates
          final List<dynamic> trackingData = data['trackings'];
          setState(() {
            _trackings = trackingData
                .map((item) => {
                      'number_plate': item['number_plate'],
                      'description': item['description'],
                      'alertType':
                          item['alert_type'], // null, 'general', or 'critical'
                      'isAcknowledged': item['is_acknowledged'] ?? false,
                    })
                .toList();
            _isLoading = false;
          });
        }
      },
      onError: (error) {
        print('WebSocket Error: $error');
      },
      onDone: () {
        print('WebSocket connection closed');
      },
    );
  }

  void _handleAlert(Map<String, dynamic> alert) {
    if (alert['station_id'] == widget.username) {
      _playAlertSound(alert['alert_type']);
      // Update tracking item with alert
      setState(() {
        final index = _trackings
            .indexWhere((t) => t['number_plate'] == alert['number_plate']);
        if (index != -1) {
          _trackings[index]['alertType'] = alert['alert_type'];
          _trackings[index]['isAcknowledged'] = false;
        }
      });
    }
  }

  Future<void> _acknowledgeAlert(String numberPlate) async {
    try {
      final response = await http.post(
        Uri.parse('http://192.168.1.133:3306/api/traffic/acknowledge-alert'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'station_id': widget.username,
          'number_plate': numberPlate,
        }),
      );

      if (response.statusCode == 200) {
        setState(() {
          final index =
              _trackings.indexWhere((t) => t['number_plate'] == numberPlate);
          if (index != -1) {
            _trackings[index]['isAcknowledged'] = true;
          }
        });
      }
    } catch (e) {
      debugPrint('Error acknowledging alert: $e');
    }
  }

  @override
  void dispose() {
    _channel.sink.close();
    _audioPlayer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tracking List (${widget.username})'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: _trackings.length,
              itemBuilder: (context, index) {
                final tracking = _trackings[index];
                return TrackingItem(
                  numberPlate: tracking['number_plate'],
                  description: tracking['description'],
                  alertType: tracking['alertType'],
                  isAcknowledged: tracking['isAcknowledged'],
                  onTap: () {
                    debugPrint('Tapped on ${tracking['number_plate']}');
                  },
                  onAcknowledge: () {
                    _acknowledgeAlert(tracking['number_plate']);
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
  final String? alertType;
  final bool isAcknowledged;
  final VoidCallback onTap;
  final VoidCallback onAcknowledge;

  const TrackingItem({
    required this.numberPlate,
    required this.description,
    this.alertType,
    required this.isAcknowledged,
    required this.onTap,
    required this.onAcknowledge,
    super.key,
  });

  Color _getBackgroundColor() {
    if (!isAcknowledged) {
      switch (alertType) {
        case 'critical':
          return Colors.red.shade100;
        case 'general':
          return Colors.yellow.shade100;
        default:
          return Colors.white;
      }
    }
    return Colors.white;
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 8.0),
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: _getBackgroundColor(),
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
              if (alertType != null && !isAcknowledged)
                IconButton(
                  icon: const Icon(Icons.check_circle_outline),
                  onPressed: onAcknowledge,
                  color: Colors.green,
                ),
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
