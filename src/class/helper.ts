export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export function degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
}
export function radiansToDegrees(radians: number) {
    return radians * 180 / Math.PI;
}