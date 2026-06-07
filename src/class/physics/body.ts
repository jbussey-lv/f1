import LeverArm from "./lever-arm";
import { mod } from "../../helper";
import AbstractShape from "../shapes/abstract_shape";
import Vec from "../../vec";

export default abstract class Body {

    position = new Vec(0, 0);
    velocity = new Vec(0, 0);
    _angle = 0; // in radians
    angulerVelocity = 0; // in radians per second
    _mass: number | null = null; // in kg
    _momentOfInertia: number | null = null; // in kg*m^2
    id = crypto.randomUUID();

    get mass(): number {
        if (this._mass === null) {
            this._mass = this.calculateMass();
        }
        return this._mass;
    }
    get momentOfInertia(): number {
        if (this._momentOfInertia === null) {
            this._momentOfInertia = this.calculateMomentOfInertia();
        }
        return this._momentOfInertia;
    }
    get com(): Vec { // center of mass
        return this.calculateCom();
    }

    getArm(position: Vec): Vec {
        return position.subtract(this.com);
    }

    getTangentialVelocity(position: Vec): Vec {
        const arm = this.getArm(position);
        return arm.multiply(this.angulerVelocity)
            .rotateByAng(Math.PI / 2)
            .rotateByAng(this.angle);
    }

    getAbsoluteVelocity(position: Vec): Vec {
        const tangentialVelocity = this.getTangentialVelocity(position);
        return this.velocity.add(tangentialVelocity);
    }

    getAbsolutePosition(position: Vec): Vec {
        const unrotatePosition = this.position.add(position);
        const rotatedPosition = unrotatePosition.rotateByAng(this.angle);
        return rotatedPosition;
    }

    calculateMass(): number {
        return this.shapes.reduce(
            (sum, rect) => sum + rect.mass,
            0
        );
    }

    calculateCom(): Vec { // center of mass
        let totalMass = 0;
        let sumOfMassTimesX = 0;
        let sumOfMassTimesY = 0;
      
        for (const shape of this.shapes) {
          totalMass += shape.mass;
          sumOfMassTimesX += shape.mass * shape.position.x;
          sumOfMassTimesY += shape.mass * shape.position.y;
        }
      
        // Handle the case where total mass is zero to avoid division by zero
        if (totalMass === 0) {
          return new Vec(0,0); // Or throw an error, depending on desired behavior
        }
      
        const xCenterOfMass = sumOfMassTimesX / totalMass;
        const yCenterOfMass = sumOfMassTimesY / totalMass;
      
        return new Vec(xCenterOfMass, yCenterOfMass);
    }

    calculateMomentOfInertia(): number {
        const com = this.com; // Center of mass of the body
        let totalMomentOfInertia = 0;

        for (const shape of this.shapes) {
            // Distance from the rectangle's center to the body's center of mass
            const distanceToCOM = shape.position.subtract(com).mag;

            // Parallel axis theorem: I = I_center + m * d^2
            totalMomentOfInertia += shape.momentOfInertia + shape.mass * distanceToCOM ** 2;
        }

        return totalMomentOfInertia;
    }  

    get angleInDegrees(): number {
        return this.angle * 180 / Math.PI;
    }

    get angle(): number {
        return this._angle;
    }

    set angle(value) {
        this._angle = mod(value, 2*Math.PI); // Keep angle within 0 to 2π
    }

    abstract update(timeStep: number): void;

    abstract get leverArms(): LeverArm[];

    abstract get shapes(): AbstractShape[];
}