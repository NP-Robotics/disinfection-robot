from flask import Flask, Response
import main

app = Flask(__name__)

@app.route('/camera')
def stream():
    return Response(main.detector(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)