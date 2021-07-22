#!/usr/bin/python
import main
import temperature
from flask_cors import CORS
from flask import Flask, Response
import sys
import numpy as np
import json
import cv2
from imutils.video import VideoStream
sys.path.append("/home/srtc/ENTER/lib/python3.7/site-packages")

vs = VideoStream(
    src="rtsp://admin:rric070105@192.168.1.64/Streaming/Channels/101").start()
vs2 = VideoStream(
    src="rtsp://admin:rric070105@192.168.1.64/Streaming/Channels/201").start()

app = Flask(__name__)
CORS(app)


@app.route('/camera')
def stream():
    return Response(main.detect(vs),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/temperature')
def stream2():
    frame2 = vs2.read()
    json_str = temperature.temperature(frame2)
    print(json_str)
    return Response(json.dumps(json_str), mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
