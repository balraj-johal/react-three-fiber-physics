import { Suspense } from 'react';
import { Environment, Box } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from "@react-three/rapier";
import './styles/App.css';

function App() {

    return (
        <main>
            <Canvas>
                <Suspense>
                    <Environment preset="studio" />
                    <ambientLight />
                    <Physics>
                        <RigidBody colliders="cuboid" type="dynamic">
                            <Box />
                        </RigidBody>
                        <RigidBody colliders="cuboid" type="fixed">
                            <mesh position={[0, -2, 0]} scale={[3, 1, 1]} >
                                <boxGeometry />
                                <meshBasicMaterial
                                    color={0x2A9D8F}
                                />
                            </mesh>
                        </RigidBody>
                    </Physics>
                </Suspense>
            </Canvas>
        </main>
    );
}

export default App;
