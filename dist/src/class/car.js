"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const victor_1 = __importDefault(require("victor"));
class Car {
    constructor() {
        this.position = new victor_1.default(20, 0);
        this.velocity = new victor_1.default(0, 0);
        this.length = 4;
        this.width = 2;
        this._angle = 90 * Math.PI / 180; // in radians
        this.angulerVelocity = 25 * Math.PI / 180; // in radians per second
        this.dimensions = new victor_1.default(10, 5);
        this.mass = 1500; // in kg
        this.com = new victor_1.default(2 / 3 * this.dimensions.x, this.dimensions.y / 2);
        this.moment = (1 / 12) * this.mass * (Math.pow(this.length, 2) + Math.pow(this.width, 2));
        this.color = "blue"; // Default color for the car
        this.id = crypto.randomUUID();
        this.wheels = [];
    }
    update(timeStep) {
        let totalForce = new victor_1.default(0, 0);
        let totalTorque = 0;
        for (const wheel of this.wheels) {
            const { force, torque } = wheel.getForceAndTorque(this);
            totalForce.add(force);
            totalTorque += torque;
        }
        this.updatePosition(totalForce, timeStep);
        this.updateAngle(totalTorque, timeStep);
    }
    updatePosition(totalForce, timeStep) {
        const linearAcceleration = totalForce.divideScalar(this.mass);
        this.velocity.add(linearAcceleration.multiplyScalar(timeStep));
        this.position.add(this.velocity.multiplyScalar(timeStep));
    }
    updateAngle(totalTorque, timeStep) {
        const angularAcceleration = totalTorque / this.moment;
        this.angulerVelocity += angularAcceleration * timeStep;
        this.angle += this.angulerVelocity * timeStep;
    }
    get angleInDegrees() {
        return this.angle * 180 / Math.PI;
    }
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value % (2 * Math.PI); // Keep angle within 0 to 2π
    }
}
exports.Car = Car;
