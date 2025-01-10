import cv2
import easyocr
import time
import numpy as np
from ultralytics import YOLO
from datetime import datetime
import mysql.connector


class PlateRecognizer:    
    def __init__(self, cnn_model_path=None):
        self.model = YOLO("yolo.pt")
        self.reader = easyocr.Reader(['en'])
        self.db_conn = self.create_db_connection()
        self.create_log_table()

    def create_db_connection(self):
        """Create a connection to the MySQL database."""
        try:
            conn = mysql.connector.connect(
                host="localhost", 
                user="root", 
                password="", 
                database="dumb"
            )
            if conn.is_connected():
                print("Connected to MySQL database")
            return conn
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            raise

    def create_log_table(self):
        """Create a table to log detections."""
        cursor = self.db_conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS detections (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            plate_text VARCHAR(255),
                            timestamp DATETIME
                        )''')
        self.db_conn.commit()

    def log_detection(self, plate_text):
        """Log detected license plate text with a timestamp in the database."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor = self.db_conn.cursor()
        cursor.execute("INSERT INTO detections (plate_text, timestamp) VALUES (%s, %s)", (plate_text, timestamp))
        self.db_conn.commit()

    def recognize_plate(self, plate_img):
        """Recognize text from plate image using EasyOCR."""
        try:
            results = self.reader.readtext(plate_img)
            plate_text = " ".join([result[1] for result in results])
            return plate_text
        except Exception as e:
            print(f"Error in OCR: {e}")
        return ""

    def run_live_detection(self):
        # camera source
        cap = cv2.VideoCapture("http://192.168.137.177:8080/video")

        print("Starting video capture... Press 'q' to quit")

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            start_time = time.time()

            # Run YOLO detection
            results = self.model(frame, conf=0.5)

            for r in results:
                boxes = r.boxes
                for box in boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    # Extract license plate region
                    plate_img = frame[y1:y2, x1:x2]
                    if plate_img.size == 0:
                        continue

                    # Recognize text using OCR
                    plate_text = self.recognize_plate(plate_img)
                    
                    # Log detection in the database
                    if plate_text:
                        self.log_detection(plate_text)

                    # Draw bounding box and recognized text
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, plate_text, (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # Calculate FPS
            fps = 1 / (time.time() - start_time)
            cv2.putText(frame, f'FPS: {fps:.1f}', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Display the frame
            cv2.imshow('License Plate Recognition', frame)

            # Exit on 'q' press
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
        self.db_conn.close()


if __name__ == "__main__":
    try:
        recognizer = PlateRecognizer()
        recognizer.run_live_detection()
    except Exception as e:
        print(f"Error: {e}")
