import numpy as np

def inverse_kepler(E_0, e, iter):
    E_n = E_0
    for i in range(0, iter):
        E_n = E_n - ((E_n - E_0 - e * np.sin(E_n)) / (1 - e * np.cos(E_n)))
    return E_n

def two_body_eom(t, y, mu):
    # initial conditions
    r = y[:3]
    v = y[3:]
    
    # result vector
    res = np.zeros_like(y)
    res[:3] = v

    r_mag = np.sqrt(np.sum(np.square(r)))
    a = (- mu * r) / r_mag**3 
    res[3:] = a
    return res