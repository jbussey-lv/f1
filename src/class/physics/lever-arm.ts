import Victor from "victor";

export default class LeverArm {
    displacement: Victor;
    force: Victor;
    constructor(displacement: Victor, force: Victor) {
        this.displacement = displacement;
        this.force = force;
    }
    get torque(): number {
        return this.displacement.cross(this.force);
    }
}

