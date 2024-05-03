import { State } from "@/types/types"

export const init_orbits: State[] = [
    {
        id: "1",
        type: "element",
        state: [8000, 0.1, 30, 145, 120, 10, 0],
        trackDraw: false,
        data: []
    },
    {
        id: "2",
        type: "element",
        state: [26600, .74, 64.2851, 137.5555, 271.9172, 21.0476],
        trackDraw: true,
        data: []
    },
    {
        id: "3",
        type: "element",
        state: [6798 , 0.00047, 51.6398, 18.4032, 66.3077, 18.4032],
        trackDraw: false,
        data: []
    },
    {
        id: "4",
        type: "element",
        state: [35793, 0, .01, 1, 1, 1],
        trackDraw: false,
        data: []
    },
    {
        id: "5",
        type: "element",
        state: [42164, .3, 63.4, 0, 270, 1],
        trackDraw: false,
        data: []
    },
    {
        id: "6",
        type: "element",
        state: [384400, 0.0549, 5, 0, 270, 1],
        trackDraw: false,
        size: .6,
        map: '/moon.jpeg',
        data: []
    }
]