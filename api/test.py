import cv2

def detector():
    #cap = cv2.VideoCapture(0)
    cap = cv2.VideoCapture("rtsp://admin:rric070105@192.168.1.64/Streaming/Channels/101")

    while True:
        ret, frame = cap.read()
        width = int(frame.shape[1] / 4)
        height = int(frame.shape[0] / 4)
        dim = (width, height)
        cv2.resize(frame, dim, interpolation =cv2.INTER_AREA)

        cv2.imshow("frame", frame)

        #ret, jpeg = cv2.imencode('.jpg', frame)
        #img = jpeg.tobytes()chro
        #yield (b'--frame\r\n'
               #b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n')

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cv2.destroyAllWindows()

if __name__ == '__main__':
    detector()