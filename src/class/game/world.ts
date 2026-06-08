import Vec from "../../vec";
import Body from "../physics/body";

export default class World{
    timeStepSeconds = 1/60; 
    timeStepMilliseconds = this.timeStepSeconds * 1000; // Convert to milliseconds
    bodies: Body[];
    gravity: Vec = new Vec(0, 9.81); // m/s^2 downward
    minVelocity = 0.5;
    minLinearAcceleration = 0.06;
    gameSlowdown = 1;

    constructor(bodies: Body[] = []){
        this.bodies = bodies;
        setInterval(
            () => this.update(this.timeStepSeconds),
            this.timeStepMilliseconds * this.gameSlowdown
        );
    }

    update(timeStep: number) {
        this.bodies.forEach(
            body => this.updateBody(body, timeStep)
        );
    }

    updateBody(body: Body, timeStep: number){
        body.update(timeStep);
        let totalForce = new Vec(0, 0);
        let totalTorque = 0;
        for (const leverArm of body.leverArms) {
            totalForce = totalForce.add(leverArm.force);
            totalTorque += leverArm.torque;
        }
        this.updateBodyLinear(body, totalForce, this.timeStepSeconds);
        this.updateBodyAngular(body, totalTorque, this.timeStepSeconds);
    }

    updateBodyLinear(body: Body, totalForce: Vec, timeStep: number){

        const linearAccel = totalForce.divide(body.mass);

        body.velocity = body.velocity.addMultiple(linearAccel, timeStep);
        body.position = body.position.addMultiple(body.velocity, timeStep);
    }

    updateBodyAngular(body: Body, totalTorque: number, timeStep: number){
        const angularAccel    = totalTorque / body.momentOfInertia;
        body.angulerVelocity += angularAccel * timeStep;
        body.angle           += body.angulerVelocity * timeStep;
    }

}