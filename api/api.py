import flask

app = Flask(__name__)

@ap.route('/', method=['GET'])
def api():
    return{
        'userId': 1,
        'title': 'Flask React App',
        'completed': False
    }