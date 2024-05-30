'''
Tests for 

Run with CMD: pytest test_sat.py
Note: the tags -rP and -rx will show passed test output and failed test output respectively.
'''
import pytest
import numpy as np
from orbital.sat import Sat

'''
Example Cartesian State Vectors (ECI Frame)

test_cases[i][3:] -> distance in km
test_cases[i][:3] -> velocity in km/s
'''
cartesian_test_cases = [
    [6372.0, 6372.0, 0, -4.7028, 4.7028, 0], # Vallado pg. 40
]

'''
Example Keplerian State Vectors 

[semi-major axis (km), eccentricity, inclination, RAAN, arg of perigee, true anomaly]
'''
keplerian_test_cases = [
    [26565, 0.7411, 63.4, 50, -90, 180] # Kluever pg. 60
]

def test_kep():
    sat = Sat(elements=keplerian_test_cases[0])
    state = sat.state
    # truncate output
    state[:3] = np.round(state[:3], 0)
    state[3:] = np.round(state[3:], 4)
    assert np.array_equal(state, [-15865, 13312, 41357, -.9601, -1.1443, 0])

def test_cartesian():
    sat = Sat(state=cartesian_test_cases[0])

def test_get_orbit():
    