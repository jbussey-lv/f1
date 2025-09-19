"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wheel = void 0;
class Wheel {
    constructor(position) {
        this.angle = 0;
        this.coefStaticFriction = 0.8; // Coefficient of static friction
        this.maxStaticFritionVelocity = 0.5;
        this.coefKineticFriction = 0.6; // Coefficient of kinetic friction
        this.position = position; // Position is a Victor object
    }
    getForceAndTorque(car) {
        const force = this.calculateForce(car);
        const torque = this.calculateTorque(car, force);
        return { force, torque };
    }
    calculateForce(car) {
        // Calculate the force based on the wheel's angle and car's speed
        const speed = car.velocity.length();
        const forceMagnitude = this.coefStaticFriction * car.mass * 9.81; // Force = μ * m * g
        const forceDirection = new Victor(Math.cos(this.angle), Math.sin(this.angle));
        return forceDirection.multiplyScalar(forceMagnitude);
    }
    getRelativeVelocity(car) {
        const absoluteVelocity = this.getAbsoluteVelocity(car);
        return absoluteVelocity.subtract(car.velocity);
    }
    getAbsoluteVelocity(car) {
        return this.getRelativeVelocity(car).add(car.velocity);
    }
    getAbsoluteAngle(car) {
        return this.angle + car.angle;
    }
    getDiffFromCog(car) {
        return this.position.clone().subtract(car.com).addAngle(car.angle);
    }
    getDistanceFromCog(car) {
        return this.getDiffFromCog(car).length();
    }
    getSpeed(car) {
        return this.getRelativeVelocity(car).length();
    }
}
exports.Wheel = Wheel;
