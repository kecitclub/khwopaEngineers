import cv2
import easyocr
import time
import numpy as np
from ultralytics import YOLO
from datetime import datetime
import mysql.connector
from queue import Queue
import threading

class PlateRecognizer:    
    def __init__(self, cnn_model_path="yolo.pt"):
        self.model = YOLO(cnn_model_path)
        self.reader = easyocr.Reader(['en'])
        self.db_conn = self.create_db_connection()
        self.create_log_table()
        self.detection_queue = Queue()
        self.start_log_worker()

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
        try:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            cursor = self.db_conn.cursor()
            cursor.execute("INSERT INTO detections (plate_text, timestamp) VALUES (%s, %s)", (plate_text, timestamp))
            self.db_conn.commit()
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
        """Recognize text from plate image using EasyOCR."""
        try:
            gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            results = self.reader.readtext(thresh)
            plate_text = " ".join([result[1] for result in results])
            return plate_text
        except Exception as e:
            print(f"Error in OCR: {e}")
        return ""

    def process_frame(self, frame):
        results = self.model(frame, conf=0.5)
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                plate_img = frame[y1:y2, x1:x2]

                if plate_img.size == 0 or plate_img.shape[0] < 20 or plate_img.shape[1] < 20:
                    continue

                plate_text = self.recognize_plate(plate_img)

                if plate_text:
                    self.detection_queue.put(plate_text)
                
                self.draw_boxes(frame, x1, y1, x2, y2, plate_text, box.conf[0])

    def draw_boxes(self, frame, x1, y1, x2, y2, plate_text, confidence):
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f'{plate_text} ({confidence:.2f})', (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

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
        self.db_conn.close()

if __name__ == "__main__":
    try:
        recognizer = PlateRecognizer()
        recognizer.run_live_detection()
    except Exception as e:
        print(f"Error: {e}")
