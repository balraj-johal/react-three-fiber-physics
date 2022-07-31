
const useProjectileSystem = () => {
    const projectileID = useRef(0);
    const [projectiles, setProjectiles] = useState([]);

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
            id: projectileID.current,
            expiresOn: Date.now() + PROJECTILE_LIFETIME * 1000,
        };
        projectileID.current += 1;
        setProjectiles([...projectiles, newProjectile]);
    }
}
