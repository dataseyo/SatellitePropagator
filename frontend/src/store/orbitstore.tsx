import { create, StateCreator } from 'zustand'

import { State } from '@/types/types'

interface OrbitSlice {
    orbits: State[],
    activeOrbit: string, // orbit ID
    addOrbit: (orbit: State) => void,
    updateNu: (amount: number, id: string) => void,
    eraseOrbits: () => void
}

interface ConfigSlice {
    menuOption: "track" | "TLE",
    changeMenuOption: (option: "track" | "TLE") => void
}

interface TrackSlice {
    track: number[][],
    setTrack: (t: number[]) => void,
    chooseTrack: (id: string) => void,
}

const createOrbitSlice: StateCreator<OrbitSlice> = (set) => ({
    orbits: [],
    activeOrbit: "10",
    addOrbit: (orbit: State) => {
        set((state) => ({
            orbits: [
                ...state.orbits,
                orbit
            ]
        }))
    },
    updateNu: (amount: number, id: string) => {
        set((state) => ({
            orbits: state.orbits.map((orbit) => {
                if (orbit.id === id) {
                    let newOrbit = {...orbit}
                    newOrbit.nu += amount
                    return newOrbit
                }

                return orbit
            })
        }))
    },
    eraseOrbits: () => {
        set(() => ({
            orbits: [],
            track: []
        }))
    }
})

const createConfigSlice: StateCreator<ConfigSlice> = (set) => ({
    menuOption: "track",
    changeMenuOption: (option: "track" | "TLE") => {
        set(() => ({
            menuOption: option
        }))
    }
})

const createTrackSlice: StateCreator<TrackSlice> = (set) => ({
    track: [],
    setTrack: (t: number[]) => {
        set((state) => ({
            track: [
                ...state.track,
                t
            ]
        }))
    },
    chooseTrack: (id: string) => {
        let newTrack: any = []
        set(() => ({
            track: newTrack,
            activeOrbit: id
        }))
    },
})

// combined store
const useOrbitStore = create<OrbitSlice & ConfigSlice & TrackSlice>((...a) => ({
    ...createOrbitSlice(...a),
    ...createConfigSlice(...a),
    ...createTrackSlice(...a),
}))

export default useOrbitStore