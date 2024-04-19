"use client"

import { ComposableMap, Geographies, Geography, Line } from "react-simple-maps"
import { useState, useRef, useEffect } from "react"

// import { geoEquirectangular } from 'd3-geo'

import useOrbitStore from "@/store/orbitstore"
import useInterval from "@/hooks/useInterval"
import * as d3 from 'd3'

const GroundTrack = () => {
    // zustand
    const tracks = useOrbitStore((state) => state.track)
    // const selectTracks = () => {
    //     let res = tracks.map((t, index) => {
    //         if (tracks.) {

    //         } else {

    //         }
    //     })
    //     return res
    // }

    // state
    // const [track, setTrack] = useState<number[][]>(tracks)

    // const lineRef = useRef<any>()
    // const line = d3.select(lineRef.current)
    // useEffect(() => {
    //     line.append("path")
    //         .
    //     // line.append("path").attr("d", tracks)
    //     // line.attr("d", tracks)
    // }, [tracks])

    // console.log(line)
    // console.log(lineRef.current)

    // const parseTrack = (t: number[], index: number, length: number): [number, number] => {
    //     if (tracks.length - ) {

    //     } else {

    //     }
    // }

    return (
        <div className="absolute right-4 bottom-0 z-10 w-1/2" >
            <ComposableMap 
                // width={100}
                // height={50}
                fill="white" 
                // projection={projection}
                projection="geoEqualEarth"
                projectionConfig={{center: [0, 45], scale: 125}}
            >
                <Geographies geography="/features.json">
                {({ geographies }) =>
                    geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} />
                    ))
                }
                </Geographies>

                {/* Ground Track Line(s) */}
                <Line
                    // ref={lineRef}
                    // coordinates={tracks.map((t, index) => parseTrack(t, index, tracks.length))}
                    coordinates={tracks.map((t, index) => [t[0], t[1]])}
                    stroke="red"
                    strokeWidth={4}
                />
            </ComposableMap>
        </div>
    )
}

export default GroundTrack