import Victor from "victor";
import Body from "./body";

export default class World{
    time = 0;
    timestepSeconds = 1/30; 
    timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
    bodies: Body[];
    gravity: Victor = new Victor(0, 9.81); // m/s^2 downward

    constructor(bodies: Body[] = []){
        this.bodies = bodies;
        setInterval(() => this.run(), this.timestepMilliseconds);
    }

    run() {
        this.time += this.timestepSeconds;
        this.bodies.forEach(body => this.updateBody(body));
    }

    updateBody(body: Body){
        let totalForce = new Victor(0, 0);
        let totalTorque = 0;
        for (const leverArm of body.leverArms) {
            totalForce.add(leverArm.force);
            totalTorque += leverArm.torque;
        }
        this.updateBodyLinear(body, totalForce);
        this.updateBodyAngular(body, totalTorque);
    }

    updateBodyLinear(body: Body, totalForce: Victor){
        const minVelocity = 1;
        const minLinearAcceleration = 0.05;
        const linearAcceleration = totalForce.divideScalar(body.mass);
        if(body.velocity.magnitude() < minVelocity && linearAcceleration.magnitude() < minLinearAcceleration){
            body.velocity = new Victor(0,0);
            return
        }
        const velocityDiff = linearAcceleration.clone().multiplyScalar(this.timestepSeconds);
        body.velocity.add(velocityDiff);
        const positionDiff = body.velocity.clone().multiplyScalar(this.timestepSeconds);
        body.position.add(positionDiff);
    }

    updateBodyAngular(body: Body, totalTorque: number){
        const angularAcceleration = totalTorque / body.momentOfInertia;
        body.angulerVelocity += angularAcceleration * this.timestepSeconds;
        body.angle += body.angulerVelocity * this.timestepSeconds;
    }

}