import cv2
import numpy as np
import requests 

def videoCamera():
    cap = cv2.VideoCapture("rtsp://admin:rric070105@192.168.1.64:554/Streaming/Channels/101")
    #cap = cv2.VideoCapture(0)


    while(True):
        ret, frame = cap.read()
        #gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

	resized = cv2.resize(frame, (1280, 800))

        cv2.imshow("frame", resized)
        if cv2.waitKey(1) & 0xff == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
	videoCamera()

