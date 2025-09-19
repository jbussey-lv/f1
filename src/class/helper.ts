export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
export function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}