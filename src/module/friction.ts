import Victor from 'victor';

export function getFrictionForce(
    velocity: Victor,
    maxStaticSpeed: number,
    muStatic: number,
    muKinetic: number,
    normalForceMagnitude: number
): Victor {
    const speed = velocity.magnitude();
    let response: Victor = new Victor(0, 0);
    const mu = speed < maxStaticSpeed ? 
               muStatic * normalForceMagnitude * (speed / maxStaticSpeed) : 
               muKinetic * normalForceMagnitude
               muKinetic;
    if (speed < maxStaticSpeed) {
        // Static friction
        const frictionMagnitude =
            muStatic * normalForceMagnitude * (speed / maxStaticSpeed);
            response = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    } else {
        // Kinetic friction
        const frictionMagnitude = muKinetic * normalForceMagnitude;
        response = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    }
    response.x = response.x === -0 ? 0 : response.x;
    response.y = response.y === -0 ? 0 : response.y;
    return response;
}