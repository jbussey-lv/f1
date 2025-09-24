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

        const displacement = new Victor(1, 0).rotate(this.angle);
        const force = new Victor(0, 20).rotate(this.angle);
        // const location = this.position.clone().add(new Victor(this.dimensions.y * 0.25, 0));
        return new LeverArm(
            displacement,
            force
        )
    }
}