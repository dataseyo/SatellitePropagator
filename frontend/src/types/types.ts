interface State {
    id: string
    type: "element" | "state"
    state: number[],
    data: number[][],
    elem?: number[],
    map?: string,
    scale?: "solar" | "sat", // scale down objects differently according to whether they're near earth satellites or celestial bodies
    size?: number,
    speed?: number,
    trackDraw: boolean,
    arrows?: boolean,
    period?: number,
    nu: number, // location in orbit relative to perigee,
    texture?: string
}

export type {
    State
}