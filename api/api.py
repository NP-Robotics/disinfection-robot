import flask

app = Flask(__name__)

@ap.route('/camera', method=['GET'])
def api():
    return{
        'userId': 1,
        'title': 'Flask React App',
        'completed': False
    }