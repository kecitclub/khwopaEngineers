import cv2
import easyocr
import time
import numpy as np
from ultralytics import YOLO
from datetime import datetime
import mysql.connector
from mysql.connector import pooling
from queue import Queue
import threading
import re

camid = 1

class PlateRecognizer:
    def __init__(self, cnn_model_path="yolo.pt"):
        self.model = YOLO(cnn_model_path)
        self.reader = easyocr.Reader(['en'])
        self.db_conn_pool = self.create_db_connection_pool()
        self.create_log_table()
        self.detection_queue = Queue()
        self.start_log_worker()

        # Define the logging zone (x1, y1, x2, y2)
        self.logging_zone = (0, 200, 600, 350)

        # Dictionary to track recently logged plates
        self.recent_detections = {}

    def create_db_connection_pool(self):
        """Create a connection pool to the MySQL database."""
        try:
            pool = pooling.MySQLConnectionPool(
                pool_name="mypool",
                pool_size=5,
                host="193.203.185.164",
                user="u290660616_pustak",
                password="Pustak@237",
                database="u290660616_pustak",
                port="3306"
            )
            print("Database connection pool created")
            return pool
        except mysql.connector.Error as err:
            print(f"Error creating connection pool: {err}")
            raise

    def get_db_connection(self):
        """Get a connection from the connection pool."""
        return self.db_conn_pool.get_connection()

    def create_log_table(self):
        """Create the log_info table if it doesn't exist."""
        conn = self.get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS log_info (
                            logid INT AUTO_INCREMENT PRIMARY KEY,
                            number_plate VARCHAR(30),
                            timestamp DATETIME
                        )''')
        conn.commit()
        cursor.close()
        conn.close()

    def is_db_connected(self, conn):
        """Check if the database connection is still available."""
        try:
            if conn.is_connected():
                return True
            else:
                conn.ping(reconnect=True, attempts=3, delay=5)
                return True
        except mysql.connector.Error as err:
            print(f"Database connection error: {err}")
            return False

    def log_detection(self, number_plate):
        """Log detected license plate text with a timestamp in the database."""
        try:
            conn = self.get_db_connection()
            if not self.is_db_connected(conn):
                print("Database connection is not available.")
                return

            current_time = datetime.now()
            if number_plate in self.recent_detections:
                last_logged_time = self.recent_detections[number_plate]
                if (current_time - last_logged_time).total_seconds() < 30:
                    print(f"Skipping duplicate log for plate: {number_plate}")
                    conn.close()
                    return  # Skip logging if within 30 seconds

            # Log to database
            timestamp = current_time.strftime('%Y-%m-%d %H:%M:%S')
            cursor = conn.cursor()
            cursor.execute("INSERT INTO log_info (number_plate, camid, timestamp) VALUES (%s, %s, %s)", 
                           (number_plate, camid, timestamp))
            conn.commit()

            # Update recent detections
            self.recent_detections[number_plate] = current_time
            print(f"Logged plate: {number_plate} at {timestamp}")

            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Error logging detection: {e}")

    def start_log_worker(self):
        def log_worker():
            while True:
                plate_text = self.detection_queue.get()
                if plate_text is None:
                    break
                self.log_detection(plate_text)

        threading.Thread(target=log_worker, daemon=True).start()

    def recognize_plate(self, plate_img):
        """Recognize text from plate image, remove state name, and validate format."""
        try:
            gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            results = self.reader.readtext(thresh)

            for result in results:
                plate_text = result[1]

                # Remove state name if it exists
                state_pattern = r'^(Bagmati|Gandaki|Lumbini|Karnali|Sudurpaschim|Province\s[1-7]|Bag|Gan|Lum|Kar|Sud|Pro\s[1-7])\s'
                plate_text = re.sub(state_pattern, '', plate_text)

                # Normalize spaces (remove spaces between segments if present)
                plate_text = plate_text.replace(' ', '')

                # Validate the format and reformat
                match = re.match(r'^([A-K])([A-Z]{2})(\d{4})$', plate_text)
                if match:
                    # Reformat to standard format: A AA 0000
                    formatted_plate = f"{match.group(1)} {match.group(2)} {match.group(3)}"
                    return formatted_plate  # Return valid plate text in the correct format
        except Exception as e:
            print(f"Error in OCR: {e}")

        return ""  # Return empty string for invalid plates

    def is_within_logging_zone(self, x1, y1, x2, y2):
        """Check if the bounding box is inside the logging zone."""
        zone_x1, zone_y1, zone_x2, zone_y2 = self.logging_zone
        return x1 >= zone_x1 and y1 >= zone_y1 and x2 <= zone_x2 and y2 <= zone_y2

    def process_frame(self, frame):
        results = self.model(frame, conf=0.5)
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                plate_img = frame[y1:y2, x1:x2]

                if plate_img.size == 0 or plate_img.shape[0] < 20 or plate_img.shape[1] < 20:
                    continue

                if self.is_within_logging_zone(x1, y1, x2, y2):
                    plate_text = self.recognize_plate(plate_img)

                    if plate_text:  # Only log valid plates
                        self.detection_queue.put(plate_text)

                    self.draw_boxes(frame, x1, y1, x2, y2, plate_text, box.conf[0])

    def draw_boxes(self, frame, x1, y1, x2, y2, plate_text, confidence):
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f'{plate_text} ({confidence:.2f})', (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    def draw_logging_zone(self, frame):
        """Draw the logging zone on the frame."""
        zone_x1, zone_y1, zone_x2, zone_y2 = self.logging_zone
        cv2.rectangle(frame, (zone_x1, zone_y1), (zone_x2, zone_y2), (0, 0, 255), 2)
        cv2.putText(frame, "Logging Zone", (zone_x1, zone_y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    def run_live_detection(self):
        cap = cv2.VideoCapture(0)

        if not cap.isOpened():
            print("Error: Unable to connect to the camera. Check the camera URL.")
            return

        print("Starting video capture... Press 'q' to quit")

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Unable to read frame from the camera.")
                break

            start_time = time.time()

            self.process_frame(frame)
            self.draw_logging_zone(frame)

            fps = 1 / (time.time() - start_time)
            cv2.putText(frame, f'FPS: {fps:.1f}', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            cv2.imshow('License Plate Recognition', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
        self.cleanup()

    def cleanup(self):
        self.detection_queue.put(None)
        cv2.destroyAllWindows()

if __name__ == "__main__":
    try:
        recognizer = PlateRecognizer()  
        recognizer.run_live_detection()
    except Exception as e:
        print(f"Error: {e}")
