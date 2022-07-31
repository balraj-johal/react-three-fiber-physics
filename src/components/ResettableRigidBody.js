import { useEffect, useRef } from 'react';
import { RigidBody } from "@react-three/rapier";

function ResettableRigidBody({ children, ...props }) {
    const ref = useRef();

    const resetRB = () => {
        ref.current.setTranslation({ x: 0, y: 0, z: 0 });
        ref.current.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0});
        ref.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 })
        ref.current.setLinvel({ x: 0.0, y: 0.0, z: 0.0 });
    }

    useEffect(() => {
        if (props.needsReset) {
            resetRB();
            props.rbHasReset(props.id);
        }
    }, [props.needsReset])

    return(
        <RigidBody ref={ref} colliders={props.colliders} type={props.type} >
            { children }
        </RigidBody>
    )
}

export default ResettableRigidBody;
