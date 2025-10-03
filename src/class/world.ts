import Victor from "victor";
import Body from "./body";

const MAX_SPEED = 10000; // m/s
const MAX_ANGULAR_VELOCITY = 10000; // radians per second
const MAX_POSITION = 10000; // m

export default class World{
    deltaTime = 1/30; 
    deltaTimeMS = this.deltaTime * 1000; // Convert to milliseconds
    bodies: Body[];
    gravity: Victor = new Victor(0, 9.81); // m/s^2 downward
    minVelocity = 2;
    minLinearAcceleration = 0.06;
    minAngularVelocity = 0.1;
    minAngularAcceleration = 0.01;

    constructor(bodies: Body[] = []){
        this.bodies = bodies;
        setInterval(() => this.run(), this.deltaTimeMS);
    }

    run() {
        this.bodies.forEach(body => this.updateBody(body));
    }

    updateBody(body: Body){
        body.updateLeverArms(this.deltaTime);
        let totalForce = new Victor(0, 0);
        let totalTorque = 0;
        for (const leverArm of body.leverArms) {
            totalForce.add(leverArm.force);
            totalTorque += leverArm.torque;
        }
        this.updateBodyLinear(body, totalForce);
        this.updateBodyAngular(body, totalTorque);
    }

    barelyMovingLinear(body: Body, linearAcceleration: Victor): boolean {
        return body.velocity.magnitude() < this.minVelocity &&
               linearAcceleration.magnitude() < this.minLinearAcceleration;
    }

    barelySpinning(body: Body, angularAcceleration: number): boolean {
        return Math.abs(body.angulerVelocity) < this.minAngularVelocity &&
               Math.abs(angularAcceleration) < this.minAngularAcceleration;
    }

    updateBodyLinear(body: Body, totalForce: Victor){

        const linearAcceleration = totalForce.divideScalar(body.mass);

        if(this.barelyMovingLinear(body, linearAcceleration)){
            body.velocity = new Victor(0,0);
            return
        }

        const velocityDiff = linearAcceleration.clone().multiplyScalar(this.deltaTime);
        body.velocity.add(velocityDiff);
        if(body.velocity.magnitude() > MAX_SPEED){
            body.velocity.normalize().multiplyScalar(MAX_SPEED);
        }
        const positionDiff = body.velocity.clone().multiplyScalar(this.deltaTime);
        body.position.add(positionDiff);
        if(body.position.length() > MAX_POSITION){
            body.position.normalize().multiplyScalar(MAX_POSITION);
        }
    }

    updateBodyAngular(body: Body, totalTorque: number){
        const angularAcceleration = totalTorque / body.momentOfInertia;
        body.angulerVelocity += angularAcceleration * this.deltaTime;
        body.angle += body.angulerVelocity * this.deltaTime;

        if(Math.abs(body.angulerVelocity) > MAX_ANGULAR_VELOCITY){
            body.angulerVelocity = Math.sign(body.angulerVelocity) * MAX_ANGULAR_VELOCITY;
        }
    }

}