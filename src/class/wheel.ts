import Victor from "victor";
import Body from "./body";
import Rectangle from "./rectangle";
import LeverArm from "./lever-arm";

const MAX_SPIN = 10000; // radians per second

export class Wheel extends Rectangle{
    muStatic: number; // Coefficient of static friction
    muKinetic: number; // Coefficient of kinetic friction
    maxMuStaticSpeed: number; // Maximum speed for static friction to apply
     // If the speed exceeds this value, kinetic friction is applied instead
    radius: number;
    angularVelocity: number = 0; // in radians per second
    _spinMomentOfInertia: number|null = null; // Moment of inertia for spinning
    dampingFactor = 0.98;
    minAngularVelocity = 0.01; // Minimum angular velocity to consider the wheel as spinning
    minTorque = 0.1; // Minimum torque to consider for spinning

    constructor(
        position: Victor,
        width: number = 0.5,
        radius: number = 0.5,
        mass: number = 15,
        muStatic: number = 500,
        maxMuStaticSpeed: number = 20,
        muKinetic: number = 200,
    ) {
        super(
            radius*2,
            width,
            position,
            mass,
            0,
            "black"
        );
        this.radius = radius;
        this.muStatic = muStatic;
        this.muKinetic = muKinetic;
        this.maxMuStaticSpeed = maxMuStaticSpeed;
    }

    get spinMomentOfInertia(): number {
        if(this._spinMomentOfInertia === null){
            this._spinMomentOfInertia = this.calculateSpinMomentOfInertia();
        }
        return this._spinMomentOfInertia;
    }

    calculateSpinMomentOfInertia(): number {
        return 0.5 * this.mass * Math.pow(this.radius, 2);
    }

    updateAngularVelocityFromTorque(torque: number, deltaTime: number): void {
        const angularAcceleration = torque / this.spinMomentOfInertia;
        this.angularVelocity += angularAcceleration * deltaTime;
        this.angularVelocity *= this.dampingFactor; // Damping factor

        if(Math.abs(this.angularVelocity) < this.minAngularVelocity
           && Math.abs(torque) < this.minTorque){
            this.angularVelocity = 0;
            return;
        }

        if(Math.abs(this.angularVelocity) > MAX_SPIN){
            this.angularVelocity = Math.sign(this.angularVelocity) * MAX_SPIN;
        }
    }

    getSpinSpeed(): number {
        // bottom of tire goes backwards
        return -1 * this.angularVelocity * this.radius;
    }

    getContactPathVelocityNaive(): Victor {
        const spinSpeed = this.getSpinSpeed();
        return new Victor(
            Math.cos(this.angle),
            Math.sin(this.angle)
        ).normalize().multiplyScalar(spinSpeed);
    }

    getContactPatchVelocity(body: Body): Victor {

        return this.getContactPathVelocityNaive()
                   .rotate(body.angle)
                   .add(this.getAbsoluteVelocity(body));
    }

    getFrictionForce(body: Body): Victor {
        const contactPatchVelocity = this.getContactPatchVelocity(body);
        let mu: number;

        if(contactPatchVelocity.length() < this.maxMuStaticSpeed){
            this.color = "black"
            mu = this.muStatic;
        }else{
            this.color = "red"
            mu = this.muKinetic;
        }
        
        return contactPatchVelocity.multiplyScalar(mu);
    }

    getTorqueFromForce(force: Victor, absoluteAngle: number): number {

        const relativeAngle = force.angle() - absoluteAngle;

        const touqueForce = force.length() * Math.cos(relativeAngle);

        return touqueForce * this.radius;
    }

    getForce(body: Body, engineTorque: number, deltaTime: number): Victor {

        this.updateAngularVelocityFromTorque(engineTorque, deltaTime);

        const frictionForce = this.getFrictionForce(body);

        const absoluteAngle = this.getAbsoluteAngle(body);

        const frictionTourque = this.getTorqueFromForce(frictionForce, absoluteAngle);

        this.updateAngularVelocityFromTorque(frictionTourque, deltaTime);

        return frictionForce.invert()
    }


    getLeverArm(body: Body, deltaTime: number, engineTorque: number = 0): LeverArm {
        const force = this.getForce(body, engineTorque, deltaTime);
        const arm = this.getArm(body);
        return new LeverArm(arm, force);
    }

    
}