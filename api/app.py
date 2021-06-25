#!/usr/bin/python

from flask import Flask, Response
from flask_cors import CORS
import main

app = Flask(__name__)
CORS(app)

@app.route('/camera')
def stream():
    return Response(main.detect(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, host = '0.0.0.0', port = 5000)
