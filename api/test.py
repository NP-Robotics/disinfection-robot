import cv2
import numpy as np

cap = cv2.VideoCapture(
    "rtsp://admin:rric070105@192.168.1.64/ISAPI/Streaming/Channels/101")

while True:
    ret, frame = cap.read()

    height, width, layers = frame.shape
    new_h = int(height / 4)
    new_w = int(width / 4)
    resized = cv2.resize(frame, (new_w, new_h))

    cv2.imshow("Frame", resized)

    if cv2.waitKey(1) & 0xff == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
