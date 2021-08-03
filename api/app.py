#!/usr/bin/python

import sys
import json
import main
import temperature
from flask_cors import CORS
from flask import Flask, Response

from mask_rcnn import *
from realsense_camera import *
from imutils.video import VideoStream

sys.path.append("/home/srtc/ENTER/lib/python3.7/site-packages")

#change the paths below if camera used is different
vs = VideoStream(
    src="rtsp://admin:rric070105@192.168.1.64/Streaming/Channels/101").start()

vs2 = VideoStream(
    src="rtsp://admin:rric070105@192.168.1.64/Streaming/Channels/201").start()

# Load Realsense camera
rs = RealsenseCamera()
mrcnn = MaskRCNN()

app = Flask(__name__)
CORS(app)

@app.route('/camera')
def stream():
    return Response(main.detect(vs),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/camera')
def logging():
    return Response(main.record())

@app.route('/temperature')
def stream2():
    frame2 = vs2.read()
    json_str = temperature.temperature(frame2)
    return Response(json.dumps(json_str), mimetype='application/json')

@app.route('/depth')
def stream3():
    # Get frame in real time from Realsense camera
    ret, bgr_frame, depth_frame = rs.get_frame_stream()

    # Get object mask
    boxes, classes, contours, centers = mrcnn.detect_objects_mask(bgr_frame)

    # Draw object mask
    bgr_frame = mrcnn.draw_object_mask(bgr_frame)

    # Show depth info of the objects
    bgr_frame, deptharr = mrcnn.draw_object_info(bgr_frame, depth_frame)
    #deptharr is amount of depth values the camera detected
    print(deptharr)

    return Response(json.dumps(deptharr), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
