import Victor from "victor";

export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export function degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
}
export function radiansToDegrees(radians: number) {
    return radians * 180 / Math.PI;
}
export function mod(num: number, modulus: number): number {
    return ((num % modulus) + modulus) % modulus;
}
export function vectorMagAtAng(vector: Victor, angle: number): number {
    const angleDiff = vector.horizontalAngle() - angle;
    return Math.cos(angleDiff) * vector.magnitude();
}
export function vectorFromMagAng(magnitude: number, angle: number): Victor {
    return new Victor(magnitude, 0).rotate(angle);
}