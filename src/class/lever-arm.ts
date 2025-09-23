import Victor from "victor";

export default class LeverArm {
    displacement: Victor;
    force: Victor;
    cog: Victor;
    constructor(displacement: Victor, force: Victor, cog: Victor) {
        this.displacement = displacement;
        this.force = force;
        this.cog = cog;
    }
    get torque(): number {
        const leverArm = this.displacement.clone().subtract(this.cog).rotate(Math.PI);
        return leverArm.cross(this.force);
    }
}

