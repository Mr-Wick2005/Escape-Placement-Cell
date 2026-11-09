import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

function Door(): React.ReactNode { return <group rotation={[0, 0.2, 0]}><mesh position={[-0.58, 0, 0]}><boxGeometry args={[1, 2.4, 0.12]} /><meshBasicMaterial color="#22e4ff" wireframe /></mesh><mesh position={[0.58, 0, 0]}><boxGeometry args={[1, 2.4, 0.12]} /><meshBasicMaterial color="#8a5cff" wireframe /></mesh><pointLight color="#22e4ff" intensity={10} position={[0, 0, 2]} /></group>; }
export function TitleDoor(): React.ReactNode { return <div className="title-door" aria-hidden="true"><Suspense fallback={<div className="door-fallback" />}><Canvas camera={{ position: [0, 0, 4] }}><Door /></Canvas></Suspense></div>; }
