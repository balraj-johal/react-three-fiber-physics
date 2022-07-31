import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import './styles/App.css';

import Scene from './components/Scene';

function App() {
    const [reset, setReset] = useState(false);
    const [changed, setChanged] = useState(false);

    return (
        <main>
            <div id="ui-wrap">
                <button 
                    id="reset" 
                    // disabled={changed ? false : true}
                    onClick={() => { 
                        setReset(true); 
                        setChanged(false);
                    }}
                >
                    {changed ? "RESET" : "CLICK ANYWHERE TO SHOOT"}
                </button>
            </div>
            <Canvas camera={{ 
                near: 0.001, 
                far: 100,
                position: [2, 1, 5]
            }}>
                <Suspense>
                    <Scene 
                        reset={reset} 
                        setReset={setReset}
                        setChanged={setChanged}
                    />
                </Suspense>
            </Canvas>
        </main>
    );
}

export default App;
