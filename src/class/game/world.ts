import Vec from "../../vec";
import Body from "../physics/body";

export default class World{
    timestepSeconds = 1/30; 
    timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
    bodies: Body[];
    gravity: Vec = new Vec(0, 9.81); // m/s^2 downward
    minVelocity = 0.5;
    minLinearAcceleration = 0.06;

    constructor(bodies: Body[] = []){
        this.bodies = bodies;
        setInterval(() => this.run(), this.timestepMilliseconds);
    }

    run() {
        this.bodies.forEach(body => this.updateBody(body));
    }

    updateBody(body: Body){
        body.update(this.timestepSeconds);
        let totalForce = new Vec(0, 0);
        let totalTorque = 0;
        for (const leverArm of body.leverArms) {
            totalForce = totalForce.add(leverArm.force);
            totalTorque += leverArm.torque;
        }
        // this.updateBodyLinear(body, totalForce);
        this.updateBodyAngular(body, totalTorque);
    }

    barelyMovingLinear(body: Body, linearAcceleration: Vec): boolean {
        return body.velocity.mag < this.minVelocity &&
               linearAcceleration.mag < this.minLinearAcceleration;
    }

    updateBodyLinear(body: Body, totalForce: Vec){

        const linearAcceleration = totalForce.divide(body.mass);

        if(this.barelyMovingLinear(body, linearAcceleration)){
            body.velocity = new Vec(0,0);
            return
        }

        const velocityDiff = linearAcceleration.multiply(this.timestepSeconds);
        body.velocity = body.velocity.add(velocityDiff);
        const positionDiff = body.velocity.multiply(this.timestepSeconds);
        body.position = body.velocity.add(positionDiff);
    }

    updateBodyAngular(body: Body, totalTorque: number){
        const angularAcceleration = totalTorque / body.momentOfInertia;
        body.angulerVelocity += angularAcceleration * this.timestepSeconds;
        body.angle += body.angulerVelocity * this.timestepSeconds;
    }

}