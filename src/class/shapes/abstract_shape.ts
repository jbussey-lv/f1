import Victor from "victor";
import Body from "../physics/body";

export default abstract class AbstractShape{
    body: Body;
    position: Victor;
    mass: number;
    angle: number;
    color: string;
    id: string = crypto.randomUUID();

    constructor(
        body: Body,
        position: Victor, // refers to its center
        mass: number,
        angle: number,
        color: string
    ){
        this.body = body;
        this.position = position;
        this.mass = mass;
        this.angle = angle;
        this.color = color;
    }

    abstract get com(): Victor;

    abstract get momentOfInertia(): number;

    getRelativePositionUnrotated(): Victor {
        return this.position.clone().subtract(this.body.com)
    }

    getArm(): Victor {
        return this.getRelativePositionUnrotated()
                   .rotate(this.body.angle);
    }

    getAbsoluteAngle(): number {
        return this.body.angle + this.angle;
    }

    getAbsolutePosition(): Victor {
        return this.getArm()
                   .add(this.body.position); // Rotate around body's angle and translate to body's position
    }

    getTangentialVelocity(): Victor {
        const arm = this.getArm();
        return new Victor(-arm.y, arm.x) // Perpendicular vector
            .multiplyScalar(this.body.angulerVelocity);
    }

    getAbsoluteVelocity(): Victor {
        return this.getTangentialVelocity().add(this.body.velocity);
    }
     
}