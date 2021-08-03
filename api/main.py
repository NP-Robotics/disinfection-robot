import os
import cv2
import imutils
import numpy as np
from time import *
from datetime import datetime
from imutils.video import VideoStream
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

face_detector_path = "./models/face"
mask_model_path = "./models/mask/mask_detector.model"
path = 'C:/NP-Robotics/disinfection-robot/api/img/'
#change the path on other systems

target_confidence = 0.68

def record(unmasked):
    print(unmasked)
    

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

    vs = VideoStream(src=0).start()
    sleep(2.0)
    #print("Stream is Open")
    frame_count = 0
    unmasked_count = 0

    while True:
        frame = vs.read()
        frame = imutils.resize(frame, width=400)
        (locs, preds) = detect_and_predict_mask(frame, face_net, mask_net)

        for (box, pred) in zip(locs, preds):
            (startX, startY, endX, endY) = box
            (mask, withoutMask) = pred
            label = "Masked" if mask > withoutMask else "Unmasked"
            color = (0, 255, 0) if label == "Masked" else (0, 0, 255)
            cv2.putText(frame, label, (startX, endY + 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
            cv2.rectangle(frame, (startX, startY),
                          (endX, endY), color, 1)
        
            if label == "Unmasked":
                 frame_count = frame_count + 1
                 if frame_count == 30:
                     unmasked_count = unmasked_count + 1
                     record(unmasked_count)

                     current_time = str(datetime.now().strftime('%Y-%m-%d-%H%M%S'))
                     filename = os.path.join(path, current_time + '.jpg')
                     roi = frame[startY:endY, startX:endX]

                     if not cv2.imwrite(filename, roi):
                         raise Exception("Error saving to path")

                     frame_count = 0
            else:
                frame_count = 0

        cv2.imshow("Frame", frame)

        if cv2.waitKey(1) & 0xff == ord('q'):
            break
    
    cv2.destroyAllWindows()
    vs.stop

"""
        scale_percent = 600
        width = int(frame.shape[1] * scale_percent / 100)
        height = int(frame.shape[0] * scale_percent / 100)
        dim = (width, height)

        resized = cv2.resize(frame, dim, interpolation=cv2.INTER_LINEAR)
        ret, jpeg = cv2.imencode('.jpg', resized)
        img = jpeg.tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n')

"""

if __name__ == '__main__':
    detect()
