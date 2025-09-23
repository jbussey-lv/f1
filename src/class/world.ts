import Victor from "victor";
import Body from "./body";

export class World{
    time = 0;
    timestepSeconds = 1/120; 
    timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
    bodies: Body[];

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
        const linearAcceleration = totalForce.divideScalar(body.mass);
        body.velocity.add(linearAcceleration.multiplyScalar(this.timestepSeconds));
        body.position.add(body.velocity.multiplyScalar(this.timestepSeconds));
    }

    updateBodyAngular(body: Body, totalTorque: number){
        const angularAcceleration = totalTorque / body.moment;
        body.angulerVelocity += angularAcceleration * this.timestepSeconds;
        body.angle += body.angulerVelocity * this.timestepSeconds;
    }

}