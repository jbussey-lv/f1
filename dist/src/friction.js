"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrictionForce = getFrictionForce;
const victor_1 = __importDefault(require("victor"));
function getFrictionForce(velocity, maxStaticFrictionSpeed, coefStaticFriction, coefKineticFriction, normalForceMagnitude) {
    const speed = velocity.magnitude();
    let response = new victor_1.default(0, 0);
    if (speed < maxStaticFrictionSpeed) {
        // Static friction
        const frictionMagnitude = coefStaticFriction * normalForceMagnitude * (speed / maxStaticFrictionSpeed);
        response = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    }
    else {
        // Kinetic friction
        const frictionMagnitude = coefKineticFriction * normalForceMagnitude;
        response = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
    }
    response.x = response.x === -0 ? 0 : response.x;
    response.y = response.y === -0 ? 0 : response.y;
    return response;
}
