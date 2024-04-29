import { create } from 'zustand'
import { Texture } from 'three'

import { State } from '@/types/types'

interface OrbitState {
    orbits: State[],
    // current ground track
    track: number[][],
    setTrack: (t: number[]) => void,
    addOrbit: (orbit: State) => void,
    chooseTrack: (id: number) => void,
    resetOrbits: () => void,
    reInitOrbits : () => void,
    eraseOrbits: () => void
}

let init_orbits: State[] = [
    {
        id: 1,
        type: "element",
        state: [8000, 0.1, 30, 145, 120, 10, 0],
        trackDraw: false
    },
    {
        id: 2,
        type: "element",
        state: [26600, .74, 64.2851, 137.5555, 271.9172, 21.0476],
        trackDraw: true,
    },
    // {
    //     id: 3,
    //     type: "state",
    //     state: [-820.865,-1905.95,-7445.9, -6.75764,-1.85916,0.930651],
    //     trackDraw: false
    // },
    {
        id: 4,
        type: "element",
        state: [6798 , 0.00047, 51.6398, 18.4032, 66.3077, 18.4032],
        trackDraw: false
    },
    {
        id: 5,
        type: "element",
        state: [35793, 0, .01, 1, 1, 1],
        trackDraw: false,
    },
    {
        id: 6,
        type: "element",
        state: [42164, .3, 63.4, 0, 270, 1],
        trackDraw: false,
    }
]

const useOrbitStore = create<OrbitState>()((set, get) => ({
    orbits: init_orbits,
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
    chooseTrack: (id: Number) => {
        set((state) => ({
            orbits: state.orbits.map((orbit) => id === orbit.id ? {...orbit, trackDraw: true} : {...orbit, trackDraw: false}),
            track: []
        }))
    },
    eraseOrbits: () => {
        set((state) => ({
            track: state.track.splice(-1000, state.track.length)
        }))
    },
    resetOrbits: () => {
        set(() => ({
            orbits: []
        }))
    },
    reInitOrbits: () => {
        set(() => ({
            orbits: init_orbits
        }))
    }
}))

export default useOrbitStore