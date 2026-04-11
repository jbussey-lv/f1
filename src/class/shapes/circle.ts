import Victor from "victor";
import Body from "../physics/body";

export default class Circle{
    radius: number;
    position: Victor;
    mass: number;
    angle: number = 0; // in radians
    _com: Victor | null = null; // center of mass
    color: string = "blue";
    id: string = crypto.randomUUID();

    constructor(
        radius: number, // vertical
        position: Victor, // refers to its center
        mass: number,
        angle: number = 0,
        color: string = "blue"
    ){
        this.radius = radius;
        this.position = position;
        this.mass = mass;
        this.angle = angle || this.angle;
        this.color = color || this.color;
    }

    get com(): Victor { // center of mass
        return new Victor(this.radius, this.radius);
    }

    getRelativePositionUnrotated(body: Body): Victor {
        return this.position.clone().subtract(body.com)
    }

    getArm(body: Body): Victor {
        return this.getRelativePositionUnrotated(body)
                   .rotate(body.angle);
    }

    getAbsoluteAngle(body: Body): number {
        return body.angle + this.angle;
    }

    getAbsolutePosition(body: Body): Victor {
        return this.getArm(body)
                   .add(body.position); // Rotate around body's angle and translate to body's position
    }

    getTangentialVelocity(body: Body): Victor {
        const arm = this.getArm(body);
        return new Victor(-arm.y, arm.x) // Perpendicular vector
            .multiplyScalar(body.angulerVelocity);
    }

    getAbsoluteVelocity(body: Body): Victor {
        return this.getTangentialVelocity(body).add(body.velocity);
    }
     
}