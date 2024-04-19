import { create } from 'zustand'
import { Texture } from 'three'

interface State {
    id: number
    type: "element" | "state"
    state: number[],
    map?: Texture,
    scale?: "solar" | "sat", // scale down objects differently according to whether they're near earth satellites or celestial bodies
    size?: number,
    speed?: number,
    track: boolean
}

interface OrbitState {
    orbits: [],
    orbitId: number,

    // current ground track
    track: number[][],
    setTrack: (t: number[]) => void
}

const useOrbitStore = create<OrbitState>()((set, get) => ({
    orbits: [],
    orbitId: 0,
    track: [],
    setTrack: (t: number[]) => {
        set((state) => ({
            track: [
                ...state.track,
                t
            ]
        }))
    }
}))

export default useOrbitStore