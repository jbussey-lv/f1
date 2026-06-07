import Vec from "../../vec";

export default class LeverArm {
    // displacement means, in standard cartesian orienation,
    // the relative displacement where the force is being applied
    // compared to a body's center of mass. This is NOT aboslute
    // displacement from the origin
    displacement: Vec;

    // force again means absolute orientation
    force: Vec;
    constructor(displacement: Vec, force: Vec) {
        this.displacement = displacement;
        this.force = force;
    }
    get torque(): number {
        return this.displacement.cross(this.force);
    }
}

