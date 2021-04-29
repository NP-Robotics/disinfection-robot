from cv2 import cv2 
import numpy as np
import requests 

def videoCamera():
    cap = cv2.VideoCapture("rtsp://admin:NProbotics@169.254.52.138:554/Streaming/Channels/401?transportmode=multicast")
    #cap = cv2.VideoCapture(0)


    while(True):
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        cv2.imshow("frame", frame)
        if cv2.waitKey(1) & 0xff == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

