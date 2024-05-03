import GroundTrack from '../components/GroundTrack/GroundTrack'
import Scene from '@/components/Scene/Scene';
import { init_orbits } from '@/data/init';
import { State } from '@/types/types';
import TLE from '@/components/TLE/TLE';

export default async function Home() {
  const getOrbit = async (data: number[], type: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DEV_API}/orbit`, {
        body: JSON.stringify({state: data, type: type === "state" ? "state" : "element"}),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-cache"
    })

    if (!res.ok) {
        throw new Error("Orbit fetch failed")
    }
    return res.json()
  }

  const initial_data: State[] = []
  for (let i = 0; i < init_orbits.length; i++) {
    let res = await getOrbit(init_orbits[i].state, "element")
    let { r, period } = JSON.parse(res.state)
    let newOrbit: State = {
      id: init_orbits[i].id,
      type: "element",
      state: init_orbits[i].state,
      trackDraw: init_orbits[i].trackDraw,
      data: r,
      map: init_orbits[i].map,
      size: init_orbits[i].size,
      period: period
    } 
    initial_data.push(newOrbit)
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <div className="h-screen w-screen z-0">
        <Scene initial_data={initial_data}/>
      </div>

      <div className="flex justify-between w-full h-100">
        {/* <TLE /> */}
        <GroundTrack />
      </div>
    </div>
  );
}
