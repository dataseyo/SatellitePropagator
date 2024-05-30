from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
from json import JSONEncoder
import json

from server.orbital.sat import Sat
from server.orbital.utils import handle_units

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)
    
def parse_state(data):
    state = data.get("state")
    type = data.get("type")
    if type == "element":
        sat = Sat(elements=state)
        period = sat.get_period()
        period_canonical = handle_units("canonical", "p", period)
        r, v = sat.evolve_state(period)
        r = handle_units("canonical", "r", r)
        v = handle_units("canonical", "v", v)
        res = {"r": r, "v": v, "period": period_canonical, "elem": np.round(state, 3)}
        res = json.dumps(res, cls=NumpyArrayEncoder)
        return res
    else:
        sat = Sat(state=state)
        period = sat.get_period()
        period_canonical = handle_units("canonical", "p", period)
        r, v = sat.evolve_state(period)
        elem = np.round(sat.elements, 3)
        r = handle_units("canonical", "r", r)
        v = handle_units("canonical", "v", v)
        res = {"r": r, "v": v, "period": period_canonical, "elem": elem}
        res = json.dumps(res, cls=NumpyArrayEncoder) 
    return res

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