import Vec from "../../vec";

export default class LeverArm {
    // displacement means, in standard cartesian orienation,
    // the relative displacement where the force is being applied
    // compared to a body's center of mass. This is NOT aboslute
    // displacement from the origin
    public readonly displacement: Vec;

    // force again means absolute orientation
    public readonly force: Vec;

    constructor(displacement: Vec, force: Vec) {
        this.displacement = displacement;
        this.force = force;
    }

    static zero(): LeverArm {
        return new LeverArm(Vec.zero(), Vec.zero());
    }
    get torque(): number {
        return this.displacement.cross(this.force);
    }
}

