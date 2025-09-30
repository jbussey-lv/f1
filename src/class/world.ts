import Victor from "victor";
import Body from "./body";

export default class World{
    timestepSeconds = 1/30; 
    timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
    bodies: Body[];
    gravity: Victor = new Victor(0, 9.81); // m/s^2 downward
    minVelocity = 2;
    minLinearAcceleration = 0.06;

    constructor(bodies: Body[] = []){
        this.bodies = bodies;
        setInterval(() => this.run(), this.timestepMilliseconds);
    }

    run() {
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

    barelyMovingLinear(body: Body, linearAcceleration: Victor): boolean {
        return body.velocity.magnitude() < this.minVelocity &&
               linearAcceleration.magnitude() < this.minLinearAcceleration;
    }

    updateBodyLinear(body: Body, totalForce: Victor){

        const linearAcceleration = totalForce.divideScalar(body.mass);

        if(this.barelyMovingLinear(body, linearAcceleration)){
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