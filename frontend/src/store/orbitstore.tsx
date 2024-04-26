import { create } from 'zustand'
import { Texture } from 'three'

import { State } from '@/types/types'

interface OrbitState {
    orbits: State[],
    // current ground track
    track: number[][],
    setTrack: (t: number[]) => void,
    addOrbit: (orbit: State) => void,
    resetOrbits: () => void,
    reInitOrbits : () => void,
    eraseOrbits: () => void
}

let init_orbits: State[] = [
    // {
    //     id: 1,
    //     type: "element",
    //     state: [8000, 0.1, 30, 145, 120, 10, 0],
    //     track: false
    // },
    // {
    //     id: 2,
    //     type: "element",
    //     state: [26600, .6418940, 64.2851, 137.5555, 271.9172, 21.0476],
    //     track: true,
    //     speed: .08
    // },
    // {
    //     id: 3,
    //     type: "state",
    //     state: [-820.865,-1905.95,-7445.9, -6.75764,-1.85916,0.930651],
    //     track: false
    // },
    // {
    //     id: 4,
    //     type: "element",
    //     state: [6798 , 0.00047, 51.6398, 18.4032, 66.3077, 18.4032],
    //     track: false
    // },
    // {
    //     id: 5,
    //     type: "state",
    //     state: [-1.879628542537870e5,  3.473462794543137e5, 3.556398887633426e4, -8.915671556736201e-1, -4.215831961891819e-1, -1.595210201459024e-2],
    //     scale: "solar",
    //     size: 2,
    //     speed: .1,
    //     track: false
    // }, 
    // {
    //     id: 6,
    //     type: "element",
    //     state: [6498 , 0.00047, 89.0, 18.4032, 66.3077, 18.4032],
    //     track: false,
    //     speed: .5,
    //     // arrows: true
    // },
    // {
    //     id: 7,
    //     type: "element",
    //     state: [35793, 0, .01, 1, 1, 1],
    //     track: false,
    //     speed: .08,
    //     // arrows: true
    // }
]

const useOrbitStore = create<OrbitState>()((set, get) => ({
    orbits: init_orbits,
    orbitId: 0,
    track: [],
    setTrack: (t: number[]) => {
        
        set((state) => ({
            track: [
                ...state.track,
                t
            ]
        }))
    },
    addOrbit: (orbit: State) => {
        set((state) => ({
            orbits: [
                ...state.orbits,
                orbit
            ]
        }))
    },
    eraseOrbits: () => {
        set((state) => ({
            track: state.track.splice(-1000, state.track.length)
        }))
    },
    resetOrbits: () => {
        set((state) => ({
            orbits: []
        }))
    },
    reInitOrbits: () => {
        set((state) => ({
            orbits: init_orbits
        }))
    }
}))

export default useOrbitStore