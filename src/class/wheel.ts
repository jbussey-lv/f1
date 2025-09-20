import Victor from "victor";
import { Car } from "./car";

export class Wheel{

    angle = 0;
    position;
    coefStaticFriction = 0.8; // Coefficient of static friction
    maxStaticFritionVelocity = 0.5;
    coefKineticFriction = 0.6; // Coefficient of kinetic friction


    constructor(position: Victor) {
        this.position = position; // Position is a Victor object
    }
    getForceAndTorque(car: Car) {
        const force = this.calculateForce(car);
        const torque = this.calculateTorque(car, force);
        return {force, torque};
    }

    calculateForce(car: Car) {
        // Calculate the force based on the wheel's angle and car's speed
        // const speed = car.velocity.length();
        const forceMagnitude = this.coefStaticFriction * car.mass * 9.81; // Force = μ * m * g
        const forceDirection = new Victor(Math.cos(this.angle), Math.sin(this.angle));
        return forceDirection.multiplyScalar(forceMagnitude);
    }

    calculateTorque(car: Car, force: Victor) {
        const leverArm = this.getDiffFromCog(car);
        return leverArm.cross(force);
    }

    getRelativeVelocity(car: Car): Victor {
        const absoluteVelocity = this.getAbsoluteVelocity(car);
        return absoluteVelocity.subtract(car.velocity);
    }

    getAbsoluteVelocity(car: Car) {
        return this.getRelativeVelocity(car).add(car.velocity);
    }

    getAbsoluteAngle(car: Car) {
        return this.angle + car.angle;
    }

    getDiffFromCog(car: Car) {
        return this.position.clone().subtract(car.com).rotate(car.angle);
    }

    getDistanceFromCog(car: Car) {
        return this.getDiffFromCog(car).length();
    }

    getSpeed(car: Car) {
        return this.getRelativeVelocity(car).length();
    }
}