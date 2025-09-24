import Victor from "victor";
import body from "./body";
import LeverArm from "./lever-arm";

export class Bug extends body{


    get leverArms(): LeverArm[] {
        return [
            this.getThrottleLeverArm()
        ];
    }

    getThrottleLeverArm(): LeverArm {

        // const location = this.position.clone().add(new Victor(this.dimensions.y * 0.25, 0));
        const forceMagnitude = 100 - this.velocity.length(); // Simple model: more speed, less force
        const force = new Victor(Math.sin(this.angle), Math.cos(this.angle)).multiplyScalar(forceMagnitude);
        force.rotate(Math.PI/6); // Reverse the force direction to simulate thrust
        return new LeverArm(
            new Victor(10, 0),
            new Victor(0,100)
        )
    }
}