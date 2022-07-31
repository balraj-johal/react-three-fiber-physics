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

export default InteractionPlane;
