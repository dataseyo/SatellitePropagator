import { create } from 'zustand'

import { State } from '@/types/types'

interface OrbitState {
    orbits: State[],
    // current ground track
    track: number[][],
    setTrack: (t: number[]) => void,
    addOrbit: (orbit: State) => void,
    chooseTrack: (id: string) => void,
    resetOrbits: () => void,
    reInitOrbits : () => void,
    eraseOrbits: () => void,
    hydrateData: (id: string) => void,
    setTrackFalse: () => void
}

const useOrbitStore = create<OrbitState>()((set, get) => ({
    orbits: [],
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
    setData: (data: number[]) => {
        set((state) => ({
            
        }))
    },
    hydrateData: (id: string) => {
        get().orbits.map(orbit => {
            if (orbit.id === id) {
                return orbit.data
            }
        })
    },
    chooseTrack: (id: string) => {
        set((state) => ({
            orbits: state.orbits.map((orbit) => id === orbit.id ? {...orbit, trackDraw: true} : {...orbit, trackDraw: false}),
            track: []
        }))
    },
    setTrackFalse: () => {
        set((state) => ({
            orbits: state.orbits.map((orbit) => ({...orbit, trackDraw: false})),
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
            // orbits: init_orbits
        }))
    },
}))

export default useOrbitStore