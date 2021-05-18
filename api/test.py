import cv2

def detector():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        #cv2.imshow("Frame", frame)
        ret, jpeg = cv2.imencode('.jpg', frame)
        img = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n')

        #if cv2.waitKey(1) & 0xFF == ord('q'):
        #    break
    #cv2.destroyAllWindows()

if __name__ == '__main__':
    detector()