import { State } from "@/types/types"

export const init_orbits: State[] = [
    {
        id: "1",
        type: "element",
        state: [8000, 0.1, 30, 145, 120, 10, 0],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "2",
        type: "element",
        state: [26600, .74, 64.2851, 137.5555, 271.9172, 21.0476],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "3",
        type: "element",
        state: [6798 , 0.00047, 51.6398, 18.4032, 66.3077, 18.4032],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "4",
        type: "element",
        state: [35793, 0, .01, 1, 1, 1],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "5",
        type: "element",
        state: [42164, .3, 63.4, 0, 270, 1],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "6",
        type: "element",
        state: [384400, 0.0549, 5, 0, 270, 1],
        trackDraw: false,
        size: .6,
        map: '/moon.jpeg',
        data: [],
        nu: 0.001
    },
    {
        id: "7",
        type: "element",
        state: [42163, 0.3, 63.4, 22, 270, 220],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "8",
        type: "element",
        state: [7200 , 0.047, 62, -30, 45, 80],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "9",
        type: "element",
        state: [12000 , 0.47, -90, -30, 0, 20],
        trackDraw: false,
        data: [],
        nu: 0.001
    },
    {
        id: "10",
        type: "state",
        state: [4971.91, 1279.43, -4452.56, 1.22, 6.79, 3.31],
        trackDraw: true,
        data: [],
        nu: 0.001,
        texture: "iss"
    }
]