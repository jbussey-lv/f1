import Vec from "../../vec";

export function getFrictionForce(
    velocity: Vec,
    maxStaticFrictionSpeed: number,
    coefStaticFriction: number,
    coefKineticFriction: number,
    normalForceMagnitude: number
): Vec {
    const speed = velocity.mag;

    const frictionMagnitude = speed < maxStaticFrictionSpeed ?
        coefStaticFriction * normalForceMagnitude * (speed / maxStaticFrictionSpeed) :
        coefKineticFriction * normalForceMagnitude;
        
    const r = velocity.toUnit().multiply(-frictionMagnitude);
    return new Vec(
        r.x === -0 ? 0 : r.x,
        r.y === -0 ? 0 : r.y
    );
}

export const enum FrictionMode {
    Static = "STATIC",
    Kinetic = "KINETIC",
  }