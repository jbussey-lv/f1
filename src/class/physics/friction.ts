import Victor from 'victor';

export function getFrictionForce(
    velocity: Victor,
    maxStaticFrictionSpeed: number,
    coefStaticFriction: number,
    coefKineticFriction: number,
    normalForceMagnitude: number
): Victor {
    const speed = velocity.magnitude();
    let response: Victor = new Victor(0, 0);
    if (speed < maxStaticFrictionSpeed) {
        // Static friction
        const frictionMagnitude =
            coefStaticFriction * normalForceMagnitude * (speed / maxStaticFrictionSpeed);
            response = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    } else {
        // Kinetic friction
        const frictionMagnitude = coefKineticFriction * normalForceMagnitude;
        response = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    }
    response.x = response.x === -0 ? 0 : response.x;
    response.y = response.y === -0 ? 0 : response.y;
    return response;
}