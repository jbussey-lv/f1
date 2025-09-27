import Victor from "victor";
import LeverArm from "./lever-arm";
import Rectangle from "./rectangle";

export default abstract class Body {

    position = new Victor(0, 0);
    velocity = new Victor(0, 0);
    _angle = 0; // in radians
    angulerVelocity = 0; // in radians per second
    com: Victor; // center of mass
    mass: number;
    momentOfInertia: number;
    id = crypto.randomUUID();

    constructor() {
        this.com = this.getCom();
        this.mass = this.getMass();
        this.momentOfInertia = this.getMomentOfInertia();
    }

    getMass(): number {
        return this.rectangles.reduce(
            (sum, rect) => sum + rect.mass,
            0
        );
    }
    getCom(): Victor { // center of mass
        let totalMass = 0;
        let sumOfMassTimesX = 0;
        let sumOfMassTimesY = 0;
      
        for (const rect of this.rectangles) {
          totalMass += rect.mass;
          sumOfMassTimesX += rect.mass * rect.position.x;
          sumOfMassTimesY += rect.mass * rect.position.y;
        }
      
        // Handle the case where total mass is zero to avoid division by zero
        if (totalMass === 0) {
          return new Victor(0,0); // Or throw an error, depending on desired behavior
        }
      
        const xCenterOfMass = sumOfMassTimesX / totalMass;
        const yCenterOfMass = sumOfMassTimesY / totalMass;
      
        return new Victor(xCenterOfMass, yCenterOfMass);
    }

    getMomentOfInertia(): number {
        const com = this.com; // Center of mass of the body
        let totalMomentOfInertia = 0;

        for (const rect of this.rectangles) {
            // Distance from the rectangle's center to the body's center of mass
            const distanceToCOM = rect.position.clone().subtract(com).magnitude();

            // Moment of inertia for the rectangle about its own center
            const rectMomentOfInertia = (1 / 12) * rect.mass * (rect.width ** 2 + rect.height ** 2);

            // Parallel axis theorem: I = I_center + m * d^2
            totalMomentOfInertia += rectMomentOfInertia + rect.mass * distanceToCOM ** 2;
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
        this._angle = value % (2 * Math.PI); // Keep angle within 0 to 2π
    }

    abstract get leverArms(): LeverArm[];

    abstract get rectangles(): Rectangle[];
}