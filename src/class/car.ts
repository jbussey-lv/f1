import Victor from "victor";
import { Wheel } from "./wheel";
import { Controller } from "./controller";

export class Car{
    position = new Victor(20, 0);
    velocity = new Victor(0, 0);
    length = 4
    width = 2;
    _angle = 90 * Math.PI / 180; // in radians
    angulerVelocity = 25 * Math.PI / 180; // in radians per second
    dimensions = new Victor(10, 5);
    mass = 1500; // in kg
    com = new Victor(2/3 * this.dimensions.x, this.dimensions.y / 2);
    moment = (1/12) * this.mass * (this.length**2 + this.width**2);
    color = "blue"; // Default color for the car
    id = crypto.randomUUID();
    wheels: Wheel[] = [];
    controller: Controller | null = null; 
    maxSteeringAngle = 40 * Math.PI / 180; // in radians
    update(timeStep: number){
        let totalForce = new Victor(0, 0);
        let totalTorque = 0;
        for (const wheel of this.wheels) {
            const {force, torque} = wheel.getForceAndTorque(this);
            totalForce.add(force);
            totalTorque += torque;
        }
        // this.updatePosition(totalForce, timeStep);
        // this.updateAngle(totalTorque, timeStep);
    }
    updatePosition(totalForce: Victor, timeStep: number) {
        const linearAcceleration = totalForce.divideScalar(this.mass);
        this.velocity.add(linearAcceleration.multiplyScalar(timeStep));
        this.position.add(this.velocity.multiplyScalar(timeStep));
    }

    updateAngle(totalTorque: number, timeStep: number) {
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

    get steeringAngle() {
        if(this.controller){
            return this.controller.steering * this.maxSteeringAngle;
        } else {
            return 0;
        }
    }

    get throttle() {
        if(this.controller){
            return this.controller.throttle;
        } else {
            return 0;
        }
    }
}