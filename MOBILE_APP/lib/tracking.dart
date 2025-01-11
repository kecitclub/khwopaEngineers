import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
import 'activity.dart';

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
  final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();
  final Map<String, bool> _playingAlerts = {}; // Track playing alerts

  @override
  void initState() {
    super.initState();
    _initializeNotifications();
    _initializeWebSocket();
  }

  Future<void> _initializeNotifications() async {
    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    const initSettings =
        InitializationSettings(android: androidSettings, iOS: iosSettings);
    await _notificationsPlugin.initialize(initSettings);
  }

  Future<void> _showNotification(String numberPlate, String alertType) async {
    const androidDetails = AndroidNotificationDetails(
      'alert_channel',
      'Vehicle Alerts',
      importance: Importance.high,
      priority: Priority.high,
    );
    const iosDetails = DarwinNotificationDetails();
    const details =
        NotificationDetails(android: androidDetails, iOS: iosDetails);

    String message = alertType == 'critical'
        ? "This vehicle is approaching!!"
        : "It might be approaching there";

    await _notificationsPlugin.show(
      0,
      'Alert: $numberPlate',
      message,
      details,
    );
  }

  void _playAlertSound(String numberPlate, String alertType) async {
    if (_playingAlerts[numberPlate] == true) return; // Already playing

    _playingAlerts[numberPlate] = true;
    try {
      if (alertType == 'critical') {
        await _audioPlayer.play(AssetSource('sounds/critical_alert.mp3'));
      } else {
        await _audioPlayer.play(AssetSource('sounds/general_alert.mp3'));
      }
      await _showNotification(numberPlate, alertType);
    } catch (e) {
      debugPrint('Error playing sound: $e');
    }
  }

  // Future<void> _makePhoneCall(String phoneNumber) async {
  //   final Uri launchUri = Uri(
  //     scheme: 'tel',
  //     path: phoneNumber,
  //   );
  //   if (await canLaunchUrl(launchUri)) {
  //     await launchUrl(launchUri);
  //   } else {
  //     throw 'Could not launch $launchUri';
  //   }
  // }

  // Future<void> _stopAlert(String numberPlate) async {
  //   try {
  //     // Stop the sound
  //     if (_playingAlerts[numberPlate] == true) {
  //       await _audioPlayer.stop();
  //       _playingAlerts[numberPlate] = false;
  //     }

  //     // Delete alert from database
  //     final response = await http.post(
  //       Uri.parse('http://192.168.1.133:3306/api/traffic/stop-alert'),
  //       headers: {'Content-Type': 'application/json'},
  //       body: jsonEncode({
  //         'station_id': widget.username,
  //         'number_plate': numberPlate,
  //       }),
  //     );

  //     if (response.statusCode == 200) {
  //       setState(() {
  //         final index =
  //             _trackings.indexWhere((t) => t['number_plate'] == numberPlate);
  //         if (index != -1) {
  //           _trackings[index]['alertType'] = null;
  //         }
  //       });
  //     }
  //   } catch (e) {
  //     debugPrint('Error stopping alert: $e');
  //   }
  // }

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
                      'isAcknowledged':
                          item['acknowledge'] ?? false, // Updated field name
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

// Update the _stopAlert method to use the correct field name
  Future<void> _stopAlert(String numberPlate) async {
    try {
      if (_playingAlerts[numberPlate] == true) {
        await _audioPlayer.stop();
        _playingAlerts[numberPlate] = false;
      }

      final response = await http.post(
        Uri.parse('http://192.168.1.133:3306/api/traffic/stop-alert'),
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
            _trackings[index] = {
              ..._trackings[index],
              'alertType': null,
              'isAcknowledged':
                  true, // This will be stored as 'acknowledge' in DB
            };
          }
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Alert stopped successfully'),
              duration: Duration(seconds: 2),
            ),
          );
        }
      } else {
        throw 'Failed to stop alert';
      }
    } catch (e) {
      debugPrint('Error stopping alert: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to stop alert: ${e.toString()}'),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }
  }

  void _handleAlert(Map<String, dynamic> alert) {
    if (alert['station_id'] == widget.username) {
      _playAlertSound(alert['number_plate'], alert['alert_type']);
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

  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri phoneUri = Uri(
      scheme: 'tel',
      path: phoneNumber,
    );
    try {
      if (await canLaunchUrl(phoneUri)) {
        await launchUrl(phoneUri);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Could not launch phone dialer'),
              duration: Duration(seconds: 2),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error making phone call: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to make phone call'),
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  // Future<void> _stopAlert(String numberPlate) async {
  //   try {
  //     // Stop the audio if it's playing
  //     if (_playingAlerts[numberPlate] == true) {
  //       await _audioPlayer.stop();
  //       _playingAlerts[numberPlate] = false;
  //     }

  //     // Delete the alert from the database
  //     final response = await http.post(
  //       Uri.parse('http://192.168.1.133:3306/api/traffic/stop-alert'),
  //       headers: {'Content-Type': 'application/json'},
  //       body: jsonEncode({
  //         'station_id': widget.username,
  //         'number_plate': numberPlate,
  //       }),
  //     );

  //     if (response.statusCode == 200) {
  //       // Update the local state
  //       setState(() {
  //         final index =
  //             _trackings.indexWhere((t) => t['number_plate'] == numberPlate);
  //         if (index != -1) {
  //           _trackings[index] = {
  //             ..._trackings[index],
  //             'alertType': null,
  //             'isAcknowledged': true,
  //           };
  //         }
  //       });

  //       if (mounted) {
  //         ScaffoldMessenger.of(context).showSnackBar(
  //           const SnackBar(
  //             content: Text('Alert stopped successfully'),
  //             duration: Duration(seconds: 2),
  //           ),
  //         );
  //       }
  //     } else {
  //       throw 'Failed to stop alert';
  //     }
  //   } catch (e) {
  //     debugPrint('Error stopping alert: $e');
  //     if (mounted) {
  //       ScaffoldMessenger.of(context).showSnackBar(
  //         SnackBar(
  //           content: Text('Failed to stop alert: ${e.toString()}'),
  //           duration: const Duration(seconds: 2),
  //         ),
  //       );
  //     }
  //   }
  // }

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
                  onCall: () => _makePhoneCall('123'),
                  onStop: () => _stopAlert(tracking['number_plate']),
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
  final VoidCallback onCall;
  final VoidCallback onStop;

  const TrackingItem({
    required this.numberPlate,
    required this.description,
    this.alertType,
    required this.isAcknowledged,
    required this.onTap,
    required this.onCall,
    required this.onStop,
    super.key,
  });

  Color _getBackgroundColor() {
    if (alertType != null) {
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
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TrackingDetails(
                numberPlate: numberPlate,
                description: description,
                alertType: alertType,
              ),
            ),
          );
        },
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
          child: Column(
            children: [
              Row(
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
                  const Icon(
                    Icons.chevron_right,
                    color: Colors.grey,
                  ),
                ],
              ),
              if (alertType != null) ...[
                const SizedBox(height: 8.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    ElevatedButton.icon(
                      onPressed: onCall,
                      icon: const Icon(Icons.call, size: 18),
                      label: const Text('Call'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 8.0),
                    ElevatedButton.icon(
                      onPressed: onStop,
                      icon: const Icon(Icons.stop, size: 18),
                      label: const Text('Stop'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
