#!/usr/bin/python
import main
from flask_cors import CORS
from flask import Flask, Response
import sys
sys.path.append("/home/srtc/ENTER/lib/python3.7/site-packages")

app = Flask(__name__)
CORS(app)

@app.route('/camera')
def stream():
    return Response(main.detect(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(debug=True, host = '0.0.0.0', port = 5000)
