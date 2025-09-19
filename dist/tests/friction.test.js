"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const victor_1 = __importDefault(require("victor"));
const friction_1 = require("../src/friction");
describe('getFrictionForce', () => {
    test('calculates static friction correctly when speed is below maxStaticFrictionSpeed', () => {
        const velocity = new victor_1.default(1, 0); // Velocity vector
        const maxStaticFrictionSpeed = 2;
        const coefStaticFriction = 0.5;
        const coefKineticFriction = 0.3;
        const normalForceMagnitude = 10;
        const result = (0, friction_1.getFrictionForce)(velocity, maxStaticFrictionSpeed, coefStaticFriction, coefKineticFriction, normalForceMagnitude);
        const expectedFriction = velocity
            .clone()
            .normalize()
            .multiplyScalar(-coefStaticFriction * normalForceMagnitude * (velocity.magnitude() / maxStaticFrictionSpeed));
        expect(result.x).toBeCloseTo(expectedFriction.x, 5);
        expect(result.y).toBeCloseTo(expectedFriction.y, 5);
    });
    test('calculates kinetic friction correctly when speed is above maxStaticFrictionSpeed', () => {
        const velocity = new victor_1.default(3, 0); // Velocity vector
        const maxStaticFrictionSpeed = 2;
        const coefStaticFriction = 0.5;
        const coefKineticFriction = 0.3;
        const normalForceMagnitude = 10;
        const result = (0, friction_1.getFrictionForce)(velocity, maxStaticFrictionSpeed, coefStaticFriction, coefKineticFriction, normalForceMagnitude);
        const expectedFriction = velocity
            .clone()
            .normalize()
            .multiplyScalar(-coefKineticFriction * normalForceMagnitude);
        expect(result.x).toBeCloseTo(expectedFriction.x, 5);
        expect(result.y).toBeCloseTo(expectedFriction.y, 5);
    });
    test('returns zero vector when velocity is zero', () => {
        const velocity = new victor_1.default(0, 0); // Zero velocity
        const maxStaticFrictionSpeed = 2;
        const coefStaticFriction = 0.5;
        const coefKineticFriction = 0.3;
        const normalForceMagnitude = 10;
        const result = (0, friction_1.getFrictionForce)(velocity, maxStaticFrictionSpeed, coefStaticFriction, coefKineticFriction, normalForceMagnitude);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });
});
