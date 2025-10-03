// import Victor from 'victor';
// import { getFrictionForce } from '../src/module/friction';

// describe('getFrictionForce', () => {
//     test('calculates static friction correctly when speed is below maxStaticFrictionSpeed', () => {
//         const velocity = new Victor(1, 0); // Velocity vector
//         const maxStaticFrictionSpeed = 2;
//         const coefStaticFriction = 0.5;
//         const coefKineticFriction = 0.3;
//         const normalForceMagnitude = 10;

//         const result = getFrictionForce(
//             velocity,
//             maxStaticFrictionSpeed,
//             coefStaticFriction,
//             coefKineticFriction,
//             normalForceMagnitude
//         );

//         const expectedFriction = velocity
//             .clone()
//             .normalize()
//             .multiplyScalar(-coefStaticFriction * normalForceMagnitude * (velocity.magnitude() / maxStaticFrictionSpeed));

//         expect(result.x).toBeCloseTo(expectedFriction.x, 5);
//         expect(result.y).toBeCloseTo(expectedFriction.y, 5);
//     });

//     test('calculates kinetic friction correctly when speed is above maxStaticFrictionSpeed', () => {
//         const velocity = new Victor(3, 0); // Velocity vector
//         const maxStaticFrictionSpeed = 2;
//         const coefStaticFriction = 0.5;
//         const coefKineticFriction = 0.3;
//         const normalForceMagnitude = 10;

//         const result = getFrictionForce(
//             velocity,
//             maxStaticFrictionSpeed,
//             coefStaticFriction,
//             coefKineticFriction,
//             normalForceMagnitude
//         );

//         const expectedFriction = velocity
//             .clone()
//             .normalize()
//             .multiplyScalar(-coefKineticFriction * normalForceMagnitude);

//         expect(result.x).toBeCloseTo(expectedFriction.x, 5);
//         expect(result.y).toBeCloseTo(expectedFriction.y, 5);
//     });

//     test('returns zero vector when velocity is zero', () => {
//         const velocity = new Victor(0, 0); // Zero velocity
//         const maxStaticFrictionSpeed = 2;
//         const coefStaticFriction = 0.5;
//         const coefKineticFriction = 0.3;
//         const normalForceMagnitude = 10;

//         const result = getFrictionForce(
//             velocity,
//             maxStaticFrictionSpeed,
//             coefStaticFriction,
//             coefKineticFriction,
//             normalForceMagnitude
//         );

//         expect(result.x).toBe(0);
//         expect(result.y).toBe(0);
//     });
// });