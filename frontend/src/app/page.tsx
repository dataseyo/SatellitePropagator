import GroundTrack from '../components/GroundTrack/GroundTrack'
import Scene from '@/components/Scene/Scene';
import { init_orbits } from '@/data/init';
import { State } from '@/types/types';
import { getOrbit } from '@/api/orbit';
import BottomMenu from '@/components/Config/BottomMenu';
import useOrbitStore from '@/store/orbitstore';
import SceneInterface from '@/components/Scene/SceneInterface';

export default async function Home() {
  // populate initial default orbits
  const initial_data: State[] = []
  for (let i = 0; i < init_orbits.length; i++) {
    let res = await getOrbit(init_orbits[i].state, init_orbits[i].type)
    let { r, period, elem } = JSON.parse(res.state)
    let newOrbit: State = {
      id: init_orbits[i].id,
      type: init_orbits[i].type,
      state: init_orbits[i].state,
      trackDraw: init_orbits[i].trackDraw,
      data: r,
      map: init_orbits[i].map,
      size: init_orbits[i].size,
      period: period,
      nu: init_orbits[i].nu,
      elem: elem
    }
    initial_data.push(newOrbit)
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <Scene initial_data={initial_data}/>
      <SceneInterface />
    </div>
  );
}
