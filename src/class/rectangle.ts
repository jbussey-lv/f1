import Victor from "victor";
import Body from "./body";

export default class Rectangle{
    width: number;
    height: number;
    position: Victor;
    mass: number;
    angle: number = 0; // in radians
    _relativePositions: Victor[] | null = null;
    _com: Victor | null = null; // center of mass
    color: string = "blue";
    id: string = crypto.randomUUID();

    constructor(
        width: number, // horizontal
        height: number, // vertical
        position: Victor, // refers to its center
        mass: number,
        angle: number = 0,
        color: string = "blue"
    ){
        this.width = width;
        this.height = height;
        this.position = position;
        this.mass = mass;
        this.angle = angle || this.angle;
        this.color = color || this.color;
    }

    get com(): Victor { // center of mass
        return new Victor(this.width / 2, this.height / 2);
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