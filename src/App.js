import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import './styles/App.css';

import Scene from './components/Scene';

function App() {
    const [reset, setReset] = useState(false);

    return (
        <main>
            <div>
                <button onClick={() => {
                    setReset(true);
                }}>RESET</button>
            </div>
            <Canvas camera={{ near: 0.001, far: 100 }}>
                <Suspense>
                    <Scene reset={reset} setReset={setReset} />
                </Suspense>
            </Canvas>
        </main>
    );
}

export default App;
