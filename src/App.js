import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import './styles/App.css';

import SceneBedroom from './components/SceneBedroom';
import SceneBoxes from './components/SceneBoxes';
import PostProcessing from './components/PostProcessing';
import Switcher from './Switcher';

function App() {
    const [reset, setReset] = useState(false);
    const [changed, setChanged] = useState(false);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

    return (
        <main>
            <div id="ui-wrap">
                <button 
                    id="reset" 
                    disabled={changed ? false : true}
                    onClick={() => { 
                        setReset(true); 
                        setChanged(false);
                    }}
                >
                    {changed ? "RESET" : "CLICK ANYWHERE TO SHOOT"}
                </button>
                <Switcher
                    options={["boxes", "bedroom"]} 
                    selectedIndex={currentSceneIndex}
                    updateChoice={setCurrentSceneIndex}
                />
            </div>
            {currentSceneIndex === 0 && 
                <Canvas camera={{ 
                    near: 0.001, 
                    far: 100,
                    position: [2, 1, 5]
                }}>
                    <PostProcessing />
                    <Suspense>
                        <SceneBoxes 
                            reset={reset} 
                            setReset={setReset}
                            setChanged={setChanged}
                        />
                    </Suspense>
                </Canvas> 
            }
            {currentSceneIndex === 1 && 
                <Canvas camera={{ 
                    near: 0.001, 
                    far: 100,
                    position: [2, 1, 5]
                }}>
                    <PostProcessing />
                    <Suspense>
                        <SceneBedroom
                            reset={reset} 
                            setReset={setReset}
                            setChanged={setChanged}
                        />
                    </Suspense>
                </Canvas> 
            }
        </main>
    );
}

export default App;
