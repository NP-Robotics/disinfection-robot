import cv2
import tensorflow
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
from imutils.video import VideoStream
import numpy as np
import argparse
import imutils
import time
import os
import logging
import sys
import json
import eel
import base64

#face and mask detector function
def detector():
	# construct the argument parser and parse the arguments
	ap = argparse.ArgumentParser()
	ap.add_argument("-f", "--face", type=str,
		default="./face_detector",
		help="path to face detector model directory")
	ap.add_argument("-m", "--model", type=str,
		default="./model/mask_detector.model",
		help="path to trained face mask detector model")
	ap.add_argument("-c", "--confidence", type=float, default=0.8, #default=0.5
		help="minimum probability to filter weak detections")
	args = vars(ap.parse_args())

	def detect_and_predict_mask(frame, faceNet, maskNet):
		# grab the dimensions of the frame and then construct a blob
		# from it
		(h, w) = frame.shape[:2]
		blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300),
			(104.0, 177.0, 123.0))
		# pass the blob through the network and obtain the face detections
		faceNet.setInput(blob)
		detections = faceNet.forward()
		# initialize our list of faces, their corresponding locations,
		# and the list of predictions from our face mask network
		faces = []
		locs = []
		preds = []

	# loop over the detections
		for i in range(0, detections.shape[2]):
			# extract the confidence (i.e., probability) associated with
			# the detection
			confidence = detections[0, 0, i, 2]
			# filter out weak detections by ensuring the confidence is
			# greater than the minimum confidence
			if confidence > args["confidence"]:
				# compute the (x, y)-coordinates of the bounding box for
				# the object
				box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
				(startX, startY, endX, endY) = box.astype("int")
				# ensure the bounding boxes fall within the dimensions of
				# the frame
				(startX, startY) = (max(0, startX), max(0, startY))
				(endX, endY) = (min(w - 1, endX), min(h - 1, endY))

	# extract the face ROI, convert it from BGR to RGB channel
				# ordering, resize it to 224x224, and preprocess it
				face = frame[startY:endY, startX:endX]
				face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
				face = cv2.resize(face, (224, 224))
				face = img_to_array(face)
				face = preprocess_input(face)
				# add the face and bounding boxes to their respective
				# lists
				faces.append(face)
				locs.append((startX, startY, endX, endY))  

		# only make a predictions if at least one face was detected
		if len(faces) > 0:
			# for faster inference we'll make batch predictions on *all*
			# faces at the same time rather than one-by-one predictions
			# in the above `for` loop
			faces = np.array(faces, dtype="float32")
			preds = maskNet.predict(faces, batch_size=32)
		# return a 2-tuple of the face locations and their corresponding
		# locations
		return (locs, preds)

	# load our serialized face detector model from disk
	print("[INFO] loading face detector model...")
	text_send_to_js("[INFO] loading face detector model...", "p2")
	prototxtPath = os.path.sep.join([args["face"], "deploy.prototxt"])
	weightsPath = os.path.sep.join([args["face"],
		"res10_300x300_ssd_iter_140000.caffemodel"])
	faceNet = cv2.dnn.readNet(prototxtPath, weightsPath)
	# load the face mask detector model from disk
	print("[INFO] loading face mask detector model...")
	text_send_to_js("[INFO] loading face mask detector model...", "p2")
	maskNet = load_model(args["model"])
	# initialize the video stream and allow the camera sensor to warm up
	print("[INFO] starting video stream...")
	text_send_to_js("[INFO] starting video stream...","p2")

	#RGB STREAM 
	vs = stream.start()

	#TEMPERATURE STREAM
	#vs2 = thermalStream.start()

	time.sleep(2.0)
	print("Stream is open")
	text_send_to_js("Stream is open","p2")

	# loop over the frames from the video stream
	while True:
		# grab the frame from the threaded video stream and resize it
		# to have a maximum width of 400 pixels
		frame = vs.read()
		frame = imutils.resize(frame, width=400)
		# detect faces in the frame and determine if they are wearing a
		# face mask or not
		(locs, preds) = detect_and_predict_mask(frame, faceNet, maskNet)

	# loop over the detected face locations and their corresponding
		# locations
		for (box, pred) in zip(locs, preds):
			# unpack the bounding box and predictions
			(startX, startY, endX, endY) = box
			(mask, withoutMask) = pred
			# determine the class label and color we'll use to draw
			# the bounding box and text
			label = "Mask" if mask > withoutMask else "No Mask"
			color = (0, 255, 0) if label == "Mask" else (0, 0, 255)

			# include the probability in the label
			#label = "{}: {:.2f}%".format(label, max(mask, withoutMask) * 100)

			# display the label and bounding box rectangle on the output
			# frame
			cv2.putText(frame, label, (startX, startY - 10),
				cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
			cv2.rectangle(frame, (startX, startY), (endX, endY), color, 1)

		cv2.imshow("Mask Detection Frame", frame)

"""
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break

	cv2.destroyAllWindows()
	vs.stop()
"""

@eel.expose
def start_video_feed():
	text_send_to_js("Video Stream Started", "p1")
	output = detector()
	img_send_to_js(output, "output")

@eel.expose
def stop_video_feed():
	text_send_to_js("Stream is closed", "p2")
	cv2.destroyAllWindows()
	stream.stop
	#thermalStream.stop
	text_send_to_js("Video Stream Stopped", "p1")

def text_send_to_js(val, id):
    eel.updateTextSrc(val, id)()

def img_send_to_js(img, id):
    if np.shape(img) == ():

        eel.updateImageSrc("", id)()
    else:
        ret, jpeg = cv2.imencode(".jpg", img)
        jpeg.tobytes()
        blob = base64.b64encode(jpeg)
        blob = blob.decode("utf-8")
        eel.updateImageSrc(blob, id)()

def start_app():
    try:
        start_html_page = '../components/camera/index.html'
        eel.init('web')
        logging.info("App Started")

        eel.start('../components/camera/index.html', size=(1000, 800))

    except Exception as e:
        err_msg = 'Could not launch a local server'
        logging.error('{}\n{}'.format(err_msg, e.args))
        show_error(title='Failed to initialise server', msg=err_msg)
        logging.info('Closing App')
        sys.exit()

if __name__ == '__main__':
	stream = VideoStream(src=0)
	#stream = VideoStream(src="rtsp://admin:rric070105@192.168.1.64/Streaming/Channels/101")
	#thermalStream = VideoStream(src="rtsp://admin:rric070105@192.168.1.64/Streaming/Channels/201")
	start_app()
	detector()
