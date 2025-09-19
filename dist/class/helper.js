"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
exports.degreesToRadians = degreesToRadians;
exports.radiansToDegrees = radiansToDegrees;
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}
