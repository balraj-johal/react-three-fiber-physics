import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useState } from 'react';

import * as THREE from "three";
import Projectile from './Projectile';

const DEBUG = false;

function Scene() {
    const worldPoint = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const axesRef = useRef();
    const projectileID = useRef(0);
    const [projectiles, setProjectiles] = useState([]);

    const { camera, scene, mouse, viewport } = useThree();
    
    let projectClickToWorldCoords = (screenSpaceXY, camera) => {
        worldPoint.x = screenSpaceXY.x;
        worldPoint.y = screenSpaceXY.y;
        worldPoint.z = 5;
        return worldPoint.unproject(camera);
    }


    let fireProjectile = () => {
        // raycast from click position to any mesh
        const origin = projectClickToWorldCoords(mouse, camera);
        raycaster.setFromCamera(mouse, camera);
        const intersections = raycaster.intersectObject(scene, true);

        // check for closest valid intersection
        let intersection;
        intersections.forEach(hit => {
            if (hit.object.type !== "Mesh") return;
            if (intersection) {
                if (hit.distance < intersection.distance) intersection = hit;
            } else {
                intersection = hit;
            }
        })

        // instantiate projectile if necessary
        if (!intersection) return;
        const newProjectile = {
            origin: origin,
            target: intersection.point,
            id: projectileID.current
        };
        projectileID.current += 1;
        setProjectiles([...projectiles, newProjectile]);

        // set debug helper to target point if required
        if (DEBUG) axesRef.current.position.copy(intersection.point);
    }

    return (
        <>
            <Environment preset="city" />
            <InteractionPlane 
                zPos={camera.position.z}
                viewport={viewport}
                fireProjectile={fireProjectile} />
            <Physics>
                <RigidBody colliders="cuboid" type="dynamic">
                    <mesh 
                        position={[0, 1, 0]} 
                        scale={[1, 1, 1]} 
                    >
                        <boxGeometry />
                        <meshStandardMaterial
                            color={0xE9C46A}
                        />
                    </mesh>
                </RigidBody>
                <RigidBody colliders="cuboid" type="fixed">
                    <mesh 
                        position={[0, -2, 0]} 
                        scale={[3, 1, 1]} 
                    >
                        <boxGeometry />
                        <meshStandardMaterial
                            color={0x2A9D8F}
                        />
                    </mesh>
                </RigidBody>
                {DEBUG && <axesHelper ref={axesRef} />}
                { projectiles.map((trajectory) => (
                    <Projectile 
                        trajectory={trajectory} 
                        key={trajectory.id} 
                    />
                ))}
            </Physics>
        </>
    );
}

function InteractionPlane(props) {
    return(
        <mesh // transparent click observer
            // position directly in front of camera
            position={[0, 0, props.zPos - 0.05]} 
            scale={[1, 1, 0.1]} 
            onClick={props.fireProjectile} 
        >
            <boxGeometry 
                args={[props.viewport.width, props.viewport.height]} 
            />
            <meshBasicMaterial opacity={0} transparent={true} />
        </mesh>
    )
}

export default Scene;
