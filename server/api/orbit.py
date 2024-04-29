from http.server import BaseHTTPRequestHandler
from os.path import join
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
from json import JSONEncoder
import json

from orbital.sat import Sat
from orbital.utils import handle_units

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
        print("period", period_elem)
        r, v = sat.evolve_state(period_elem)
        r = handle_units("canonical", "r", r)
        v = handle_units("canonical", "v", v)
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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length)
        print(post_data)