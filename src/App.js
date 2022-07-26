import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import './styles/App.css';

import Scene from './Scene';

function App() {
    return (
        <main>
            <Canvas camera={{ near: 0.001, far: 100 }}>
                <Suspense>
                    <Scene />
                </Suspense>
            </Canvas>
        </main>
    );
}

export default App;
