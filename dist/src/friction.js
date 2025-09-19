"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrictionForce = getFrictionForce;
function getFrictionForce(velocity, maxStaticFrictionSpeed, coefStaticFriction, coefKineticFriction, normalForceMagnitude) {
    const speed = velocity.magnitude();
    if (speed < maxStaticFrictionSpeed) {
        // Static friction
        const frictionMagnitude = coefStaticFriction * normalForceMagnitude * (speed / maxStaticFrictionSpeed);
        return velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    }
    else {
        // Kinetic friction
        const frictionMagnitude = coefKineticFriction * normalForceMagnitude;
        return velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    }
}
