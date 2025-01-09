import 'package:flutter/material.dart';

class TrackingList extends StatefulWidget {
  const TrackingList({
    super.key,
  });
  @override
  TrackingListState createState() => TrackingListState();
}

class TrackingListState extends State<TrackingList> {
  // Sample data for tracking
  final List<Map<String, dynamic>> _trackings = [
    {
      'number_plate': 'BA 1 PA 1234',
      'description': 'Vehicle heading towards Station A for inspection',
      'isAlert': false,
    },
    {
      'number_plate': 'GA 2 QA 5678',
      'description': 'Suspected vehicle detected near Station B',
      'isAlert': true, // Alert example
    },
    {
      'number_plate': 'NA 3 RA 9101',
      'description': 'Vehicle under tracking, last seen at Station C',
      'isAlert': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tracking List'),
      ),
      body: ListView.builder(
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
              print('Tapped on ${tracking['number_plate']}');
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
    return GestureDetector(
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
            // Main content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Number Plate
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
    );
  }
}
