from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
import pandas as pd
from json import JSONEncoder
import json

from orbital.sat import Sat

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
        # print("getting element with", state)
        sat = Sat(elements=state)
        period_elem = sat.get_period()
        print("period", period_elem)
        r, v = sat.evolve_state(period_elem)
        res = {"r": r, "v": v}
        res = json.dumps(res, cls=NumpyArrayEncoder)
        return res
    else:
        sat = Sat(state=state)
        period = sat.get_period()
        print("period", period)
        r, v = sat.evolve_state(period)
        res = {"r": r, "v": v}
        res = json.dumps(res, cls=NumpyArrayEncoder) 
        return res

@app.route("/orbit", methods=["POST"])
@cross_origin()
def get_orbit():
    request_data = request.get_json()
    state_vector = request_data.get("state")
    data = parse_state(request_data)
    return jsonify({"state": data})

if __name__== "__main__":
    app.run(host="10.0.0.3", debug=False, port=8080)

