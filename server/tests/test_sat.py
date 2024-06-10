'''
Run with CMD: pytest tests
Note: the tags -rP and -rx will show passed test output and failed test output respectively.
'''
import pytest
import numpy as np
from orbital.sat import Sat

'''
Example Keplerian State Vectors 

[semi-major axis (km), eccentricity, inclination, RAAN, arg of perigee, true anomaly]
'''
kep_input = [
    (
        [26565, 0.7411, 63.4, 50, -90, 180],
        [-15865, 13312, 41357, -.9601, -1.1443, 0]
    )
]

'''
Example Cartesian State Vectors (ECI Frame)

[3:] -> distance in km
[:3] -> velocity in km/s
'''
cartesian_input = [
    (
        [6372.0, 6372.0, 0, -4.7028, 4.7028, 0], # Vallado pg. 40
        []
    )
]

@pytest.mark.parametrize("test_input,expected", kep_input)
def test_kep(test_input, expected, benchmark):
    def conv():
        sat = Sat(elements=test_input)
        return sat.state

    state = benchmark(conv)
    # truncate output
    state[:3] = np.round(state[:3], 0)
    state[3:] = np.round(state[3:], 4)

    assert np.array_equal(state, expected)

# @pytest.mark.parametrize("test_input,expected", cartesian_input)
# def test_cartesian(test_input):
#     sat = Sat(state=test_input)

'''
Example orbit propagation states
'''
propagation_input = [
    (
        [2466.69, 5941.54, 3282.71, -6.80822, 1.04998, 3.61939],
        [-3438.2482, -7153.8157, -3756.0316, 5.5731, -0.9234, -3.0092]
    )
]

@pytest.mark.parametrize("test_input,expected", propagation_input)
def test_get_orbit(test_input, expected, benchmark):
    sat = Sat(state=test_input)

    def propagate():
        return sat.evolve_state(3600)
    
    r, v = benchmark(propagate)
    r = np.round(r, 4)
    v = np.round(v, 4)
    print("res", [r[-1],v[-1]])
    assert np.array_equal([*r[-1], *v[-1]], expected)