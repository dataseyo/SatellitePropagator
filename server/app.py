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
    print(state, type)
    if type == "element":
        # print("getting element with", state)
        sat = Sat(elements=state)
        period_elem = sat.get_period()
        period_canonical = handle_units("canonical", "p", period_elem)
        print("period", period_elem)
        r, v = sat.evolve_state(period_elem)
        r = handle_units("canonical", "r", r)
        v = handle_units("canonical", "v", v)
        res = {"r": r, "v": v, "period": period_canonical}
        res = json.dumps(res, cls=NumpyArrayEncoder)
        return res
    else:
        sat = Sat(state=state)
        period = sat.get_period()
        print("period", period)
        r, v = sat.evolve_state(period)
        r = handle_units("canonical", "r", r)
        v = handle_units("canonical", "v", v)
        res = {"r": r, "v": v}
        res = json.dumps(res, cls=NumpyArrayEncoder) 
    return res

@app.route("/orbit", methods=["POST"])
@cross_origin()
def get_orbit():
    request_data = request.get_json()
    data = parse_state(request_data)
    return jsonify({"state": data})

@app.route("/", methods=["GET"])
@cross_origin()
def greet():
    return "Hi! This is an astrodynamics flask server."

if __name__== "__main__":
    app.run(host="0.0.0.0", debug=False)