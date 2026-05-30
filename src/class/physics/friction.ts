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

    const frictionMagnitude = speed < maxStaticFrictionSpeed ?
        coefStaticFriction * normalForceMagnitude * (speed / maxStaticFrictionSpeed) :
        coefKineticFriction * normalForceMagnitude;
        
    response = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    response.x = response.x === -0 ? 0 : response.x;
    response.y = response.y === -0 ? 0 : response.y;
    return response;
}

export const enum FrictionMode {
    Static = "STATIC",
    Kinetic = "KINETIC",
  }