import { create, StateCreator } from 'zustand'

import { State } from '@/types/types'

interface OrbitSlice {
    orbits: State[],
    activeOrbit: string, // orbit ID
    addOrbit: (orbit: State) => void,
    updateNu: (amount: number, id: string) => void,
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
    activeOrbit: "2",
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


// interface OrbitState {
//     orbits: State[],
//     // current ground track
//     track: number[][],
//     activeOrbit: string, // orbit ID
//     setTrack: (t: number[]) => void,
//     addOrbit: (orbit: State) => void,
//     chooseTrack: (id: string) => void,
//     resetOrbits: () => void,
//     reInitOrbits : () => void,
//     eraseOrbits: () => void,
//     hydrateData: (id: string) => void,
//     setTrackFalse: () => void,
//     activateOrbit: () => void,
//     updateNu: (amount: number, id: string) => void
// }

// const useOrbitStore = create<OrbitState>()((set, get) => ({
//     orbits: [],
//     track: [],
//     activeOrbit: "2",
//     setTrack: (t: number[]) => {
//         set((state) => ({
//             track: [
//                 ...state.track,
//                 t
//             ]
//         }))
//     },
//     addOrbit: (orbit: State) => {
//         set((state) => ({
//             orbits: [
//                 ...state.orbits,
//                 orbit
//             ]
//         }))
//     },
//     updateNu: (amount: number, id: string) => {
//         set((state) => ({
//             ...state,

//         }))
//     },
//     hydrateData: (id: string) => {
//         get().orbits.map(orbit => {
//             if (orbit.id === id) {
//                 return orbit.data
//             }
//         })
//     },
//     chooseTrack: (id: string) => {
//         let newTrack: any = []
//         set(() => ({
//             track: newTrack,
//             activeOrbit: id
//         }))
//         // set((state) => ({
//         //     // orbits: state.orbits.map((orbit) => id === orbit.id ? {...orbit, trackDraw: true} : {...orbit, trackDraw: false}),
//         //     // track: newTrack
//         // }))
//     },
//     setTrackFalse: () => {
//         set((state) => ({
//             orbits: state.orbits.map((orbit) => ({...orbit, trackDraw: false})),
//             track: []
//         }))
//     },
//     eraseOrbits: () => {
//         set((state) => ({
//             track: state.track.splice(-1000, state.track.length)
//         }))
//     },
//     resetOrbits: () => {
//         set(() => ({
//             orbits: []
//         }))
//     },
//     reInitOrbits: () => {
//         set(() => ({
//             // orbits: init_orbits
//         }))
//     },
//     activateOrbit: () => {
//         get().orbits
//     }
// }))

// export default useOrbitStore