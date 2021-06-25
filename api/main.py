import cv2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
from imutils.video import VideoStream
import numpy as np
import imutils
import time
import os

face_detector_path = "./detector/face_detector"
mask_model_path = "./detector/model/mask_detector.model"
target_confidence = 0.75

def detect():
    
    def detect_and_predict_mask(frame, face_net, mask_net):
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300),
            (104.0, 177.0, 123.0))
        face_net.setInput(blob)
        detections = face_net.forward()

        faces = []
        locs = []
        preds = []

        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > target_confidence:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                (startX, startY) = (max(0, startX), max(0, startY))
                (endX, endY) = (min(w - 1, endX), min(h - 1, endY))

                face = frame[startY:endY, startX:endX]
                face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
                face = cv2.resize(face, (224, 224))
                face = img_to_array(face)
                face = preprocess_input(face)
                faces.append(face)
                locs.append((startX, startY, endX, endY))  

        if len(faces) > 0:
            faces = np.array(faces, dtype="float32")
            preds = mask_net.predict(faces, batch_size=32)

        return (locs, preds)

    prototxt_path = os.path.sep.join([face_detector_path, "deploy.prototxt"])
    weights_path = os.path.sep.join([face_detector_path,
        "res10_300x300_ssd_iter_140000.caffemodel"])
    face_net = cv2.dnn.readNet(prototxt_path, weights_path)
    mask_net = load_model(mask_model_path)

    vs = VideoStream(src="rtsp://admin:rric070105@192.168.1.64:554/ISAPI/Streaming/Channels/101").start()
    #Liyan's camera: 192.168.1.88
    time.sleep(2.0)
    print("Steam is OPEN")

    while True:
        frame = vs.read()
        frame = imutils.resize(frame, width=400)
        (locs, preds) = detect_and_predict_mask(frame, face_net, mask_net)

        for (box, pred) in zip(locs, preds):
            (startX, startY, endX, endY) = box
            (mask, withoutMask) = pred
            label = "Masked" if mask > withoutMask else "Unmasked"
            color = (0, 255, 0) if label == "Masked" else (0, 0, 255)
            #label = "{}: {:.2f}%".format(label, max(mask, withoutMask) * 100)
            cv2.putText(frame, label, (startX, startY - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
            cv2.rectangle(frame, (startX, startY), (endX, endY), color, 1)

            scale_percent = 200 
            width = int(frame.shape[1] * scale_percent / 100)
            height = int(frame.shape[0] * scale_percent / 100)
            dim = (width, height)
            resized = cv2.resize(frame, dim, interpolation= cv2.INTER_AREA)

        ret, jpeg = cv2.imencode('.jpg', resized)
        img = jpeg.tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n') 

if __name__ == '__main__':
    detect()
"""     for frames in detect():
        print(frames) """