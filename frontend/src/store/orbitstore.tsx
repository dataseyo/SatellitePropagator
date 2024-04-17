import { create } from 'zustand'

interface OrbitState {
    orbitId: number,
    track: number[][],
    setTrack: (t: number[]) => void
}

const useOrbitStore = create<OrbitState>()((set, get) => ({
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