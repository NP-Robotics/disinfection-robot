import os
import cv2
from realsense_camera import *
import imutils
import numpy as np
from time import *
from datetime import datetime
from imutils.video import VideoStream
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import global_var

face_detector_path = "./models/face"
mask_model_path = "./models/mask/mask_detector.model"
path = './img/'
#change the path on other systems

target_confidence = 0.75

def detect(vs):

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
    frame_count = 0 #frame count tracker
    unmask_in_frames= 0 #amount of unmask in a certain amount of frames
    frame_delay = 90 #use to delay unmask count after a count had happen

    while True:
        ret, bgr_frame, depth_frame = vs.get_frame_stream()
        frame = bgr_frame
        frame = imutils.resize(frame, width=400)
        (locs, preds) = detect_and_predict_mask(frame, face_net, mask_net)

        mask_arr = []
        for (box, pred) in zip(locs, preds):
            (startX, startY, endX, endY) = box
            (mask, withoutMask) = pred
            label = "Masked" if mask > withoutMask else "Unmasked"
            color = (0, 255, 0) if label == "Masked" else (0, 0, 255)
            cv2.putText(frame, label, (startX, endY + 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
            cv2.rectangle(frame, (startX, startY),
                          (endX, endY), color, 1)
            mask_arr.append(label)
        #change all the same number to the number u choose
        if frame_count != 15:
            frame_count +=1

        for i in mask_arr:
            if i == "Unmasked" and frame_count != 15:
                unmask_in_frames +=1
                break

        if frame_delay < 90:
            frame_delay += 1

        if frame_count == 15:
            if unmask_in_frames >= 9 and frame_delay == 90 :
                global_var.count = global_var.count + 1

                current_time = str(datetime.now().strftime('%Y-%m-%d-%H%M%S'))
                filename = os.path.join(path, current_time + '.jpg')
                roi = frame[startY:endY, startX:endX]

                if not cv2.imwrite(filename, roi):
                    raise Exception("Error saving to path")
                frame_delay = 0

            frame_count = 0
            unmask_in_frames = 0 

        scale_percent_w = 250
        scale_percent_h = 200
        width = int(frame.shape[1] * scale_percent_w / 100)
        height = int(frame.shape[0] * scale_percent_h / 100)
        dim = (width, height)

        resized = cv2.resize(frame, dim, interpolation=cv2.INTER_LINEAR)
        ret, jpeg = cv2.imencode('.jpg', resized)
        img = jpeg.tobytes()
        print("video ON")
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n')

if __name__ == '__main__':
    detect()
