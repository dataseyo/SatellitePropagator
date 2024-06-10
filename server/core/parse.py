from json import JSONEncoder
import json
import numpy as np

from server.orbital.sat import Sat
from server.orbital.utils import handle_units

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
