import cv2
from imutils.video import VideoStream
import numpy as np
import imutils
import time
import os

face_detector_path = "./detector/face_detector"
mask_model_path = "./detector/model/mask_detector.model"
target_confidence = 0.70

class DetectorServer():

    def __init__(self):
        print("\n\nMock Server")
        
        
    def detect(self):
        vs = VideoStream(src=0)
        vs.start()
        for frame in vs.read():
            if frame is not None: 
                ret, jpeg = cv2.imencode('.jpg', frame)
                img = jpeg.tobytes()    
                yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n') 

              
    def pause_video(self):
        self.yield_video = False
    
    def play_video(self):
        self.yield_video = True


if __name__ == "__main__":
    server = DetectorServer()
    frame = server.detect()
    print(frame)
    
