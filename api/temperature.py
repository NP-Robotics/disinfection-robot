import cv2
from imutils.video import VideoStream
import numpy as np
import imutils
import time
import os
from random import seed
from random import random


def temperature(frame2, offset):
    frame2 = imutils.resize(frame2, width=400)

    scale_percent = 600

    width2 = int(frame2.shape[1] * scale_percent / 100)
    height2 = int(frame2.shape[0] * scale_percent / 100)
    dim2 = (width2, height2)

    lower = np.array([0, 121, 0])  # -- Lower range --
    upper = np.array([120, 255, 120])  # -- Upper range --
    mask = cv2.inRange(frame2, lower, upper)
    res = cv2.bitwise_and(frame2, frame2, mask=mask)
    gray = cv2.cvtColor(res, cv2.COLOR_BGR2GRAY)
    contours, hierarchy = cv2.findContours(
        gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2:]
    idx = 0
    temparr = []
    for cnt in contours:
        idx += 1
        x, y, w, h = cv2.boundingRect(cnt)
        if w > 30 and h > 30:
            cv2.circle(frame2, (x, y), 3, (2, 255, 255), -1)
            cv2.circle(frame2, (x+w, y), 3, (2, 255, 255), -1)
            cv2.circle(frame2, (x, y+h), 3, (2, 255, 255), -1)
            cv2.circle(frame2, (x+w, y+h), 3, (2, 255, 255), -1)
            maxtemp = 0
            for cX in range(x, x+w):
                for cY in range(y, int(y+(w/2))):
                    colour = frame2[cY, cX]
                    temp = 15/255*colour[0]+30 - offset
                    if temp > maxtemp:
                        maxtemp = temp
            temparr.append(maxtemp)

    resized2 = cv2.resize(frame2, dim2, interpolation=cv2.INTER_LINEAR)
    ret2, jpeg2 = cv2.imencode('.jpg', resized2)
    img2 = jpeg2.tobytes()

    # yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + img2 + b'\r\n\r\n')
    return (temparr)


if __name__ == '__main__':
    temperature()
