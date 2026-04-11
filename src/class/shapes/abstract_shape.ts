import Victor from "victor";
import Body from "../physics/body";

export default abstract class AbstractShape{
    position: Victor;
    mass: number;
    angle: number;
    color: string;
    id: string = crypto.randomUUID();

    constructor(
        position: Victor, // refers to its center
        mass: number,
        angle: number,
        color: string
    ){
        this.position = position;
        this.mass = mass;
        this.angle = angle;
        this.color = color;
        
    }

    abstract get com(): Victor;

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