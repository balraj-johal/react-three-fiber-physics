import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Physics, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from 'react';

import * as THREE from "three";
import InteractionPlane from './InteractionPlane';
import Projectile from './Projectile';
import ResettableRigidBody from './ResettableRigidBody';

const DEBUG = false;
const PROJECTILE_LIFETIME = 5;

function Scene(props) {
    const worldPoint = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const axesRef = useRef();
    const projectileID = useRef(0);
    const [projectiles, setProjectiles] = useState([]);

    const { camera, scene, mouse, viewport } = useThree();
    
    let projectClickToWorldCoords = (screenSpaceXY, camera) => {
        props.setChanged(true);
        worldPoint.x = screenSpaceXY.x;
        worldPoint.y = screenSpaceXY.y;
        worldPoint.z = 5;
        return worldPoint.unproject(camera);
    }

    const despawnProjectile = (id) => {
        const projectilesCopy = [...projectiles];
        let targetIndex = null;
        projectilesCopy.forEach((proj, index) => {
            if (proj.id === id) targetIndex = index; 
        })
        // for some reason there was an edge case where first
        // projectile doesn't get removed by splice statement
        if (targetIndex === 0) projectilesCopy.shift();
        if (targetIndex) projectilesCopy.splice(targetIndex, 1);
        setProjectiles(projectilesCopy);
    }

    const fireProjectile = () => {
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
            id: projectileID.current,
            expiresOn: Date.now() + PROJECTILE_LIFETIME * 1000,
        };
        projectileID.current += 1;
        setProjectiles([...projectiles, newProjectile]);

        // set debug helper to target point if required
        if (DEBUG) axesRef.current.position.copy(intersection.point);
    }


    const INITIAL_LIST = {
        "box": { needsReset: false },
        "box2": { needsReset: false },
    }
    const [resetList, setResetList] = useState(INITIAL_LIST);

    useEffect(() => {
        if (props.reset) {
            setResetList(INITIAL_LIST);
            props.setReset(false);
        }
    }, [props.reset])
    
    const rbHasReset = (id) => {
        const resetListCopy = {...resetList};
        resetListCopy[id].needsReset = false;
        setResetList(resetListCopy);
    }

    return (
        <>
            <Environment preset="city" />
            <InteractionPlane 
                zPos={camera.position.z}
                viewport={viewport}
                fireProjectile={fireProjectile} 
            />
            <Physics>
                <ResettableRigidBody
                    needsReset={resetList["box"]}
                    id="box"
                    rbHasReset={rbHasReset}
                    colliders="cuboid" 
                    type="dynamic"
                >
                    <mesh 
                        position={[0, 1, 0]} 
                        scale={[1, 1, 1]} 
                    >
                        <boxGeometry />
                        <meshStandardMaterial color={0xE9C46A} />
                    </mesh>
                </ResettableRigidBody>
                <ResettableRigidBody 
                    needsReset={resetList["box2"]}
                    id="box2"
                    rbHasReset={rbHasReset}
                    colliders="cuboid" 
                    type="dynamic"
                >
                    <mesh 
                        position={[1.2, 1, 0]} 
                        scale={[1, 1, 1]} 
                    >
                        <boxGeometry />
                        <meshStandardMaterial color={0xE9C46A} />
                    </mesh>
                </ResettableRigidBody>
                <RigidBody colliders="cuboid" type="fixed">
                    <mesh 
                        position={[0, -2, 0]} 
                        scale={[3, 1, 1]} 
                    >
                        <boxGeometry />
                        <meshStandardMaterial color={0x2A9D8F} />
                    </mesh>
                </RigidBody>
                { projectiles.map((trajectory) => (
                    <Projectile 
                        trajectory={trajectory} 
                        key={trajectory.id} 
                        despawnProjectile={despawnProjectile}
                    />
                )) }
            </Physics>
        </>
    );
}

export default Scene;
