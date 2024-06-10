from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from server.core.parse import parse_state

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/orbit", methods=["POST"])
@cross_origin()
def get_orbit():
    try:
        request_data = request.get_json()
        data = parse_state(request_data)
        return jsonify({"state": data})
    except Exception as error:
        return jsonify({"error": error})
    
@app.route("/", methods=["GET"])
@cross_origin()
def get_celestrak():
    pass

@app.route("/", methods=["GET"])
@cross_origin()
def greet():
    return "Hi! This is an astrodynamics flask server."

if __name__== "__main__":
    app.run(host="0.0.0.0", debug=False)