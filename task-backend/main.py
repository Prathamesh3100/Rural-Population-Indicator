from flask import Flask, jsonify
from flask_cors import CORS
from getData import get_csv_data

app = Flask(__name__)
CORS(app, resources={r"/index": {"origins": "http://localhost:4200"}})

@app.route("/index")
def index():
    data = get_csv_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0')