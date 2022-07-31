import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

function Projectile(props) {
    const rb = useRef();

    useEffect(() => {
        // calculate direction from origin to target
        const direction = new Vector3();
        direction.subVectors(props.trajectory.target, props.trajectory.origin);
        // apply impulse
        rb.current.applyImpulse(direction.normalize(), true);
    }, [])

    useFrame(() => {
        if (Date.now() > props.trajectory.expiresOn) {
            props.despawnProjectile(props.trajectory.id);
        }
    })

    return(
        <RigidBody ref={rb} colliders="ball" type="dynamic">
            <mesh position={props.trajectory.origin}>
                <sphereGeometry args={[0.2, 10, 10]} />
                <meshBasicMaterial color={0x2176ff} />
            </mesh>
        </RigidBody>
    )
}

export default Projectile;
