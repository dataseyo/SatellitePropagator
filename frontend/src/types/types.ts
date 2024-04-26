import { Texture } from 'three'

interface State {
    id: number
    type: "element" | "state"
    state: number[],
    map?: Texture,
    scale?: "solar" | "sat", // scale down objects differently according to whether they're near earth satellites or celestial bodies
    size?: number,
    speed?: number,
    track: boolean,
    arrows?: boolean
}

export type {
    State
}