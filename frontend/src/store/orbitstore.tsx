import { create } from 'zustand'

import { State } from '@/types/types'

interface OrbitState {
    orbits: State[],
    // current ground track
    track: number[][],
    activeOrbit: string, // orbit ID
    setTrack: (t: number[]) => void,
    addOrbit: (orbit: State) => void,
    chooseTrack: (id: string) => void,
    resetOrbits: () => void,
    reInitOrbits : () => void,
    eraseOrbits: () => void,
    hydrateData: (id: string) => void,
    setTrackFalse: () => void,
    activateOrbit: () => void
}

const useOrbitStore = create<OrbitState>()((set, get) => ({
    orbits: [],
    track: [],
    activeOrbit: "2",
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
    hydrateData: (id: string) => {
        get().orbits.map(orbit => {
            if (orbit.id === id) {
                return orbit.data
            }
        })
    },
    chooseTrack: (id: string) => {
        let newTrack: any = []
        set((state) => ({
            ...state,
            track: newTrack,
            activeOrbit: id
        }))
        // set((state) => ({
        //     // orbits: state.orbits.map((orbit) => id === orbit.id ? {...orbit, trackDraw: true} : {...orbit, trackDraw: false}),
        //     // track: newTrack
        // }))
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
    activateOrbit: () => {
        get().orbits
    }
}))

export default useOrbitStore