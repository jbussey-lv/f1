import Victor from "victor";
import Rectangle from "../src/class/rectangle";
import Body from "../src/class/body";
import LeverArm from "../src/class/lever-arm";

describe("Rectangle", () => {

    class TestBody extends Body {
        leverArms: LeverArm[] = [];
        rectangles: Rectangle[] = [];
        position: Victor = new Victor(0, 0);

        get com(): Victor {
            return new Victor(0, 0);
        }
    }
    describe("getTangentialVelocity", () => {

        const testBody = new TestBody();
        const testRect = new Rectangle(2, 4, new Victor(0, 0), 10, 0);
        testBody.rectangles = [testRect];

        const testCases: {p: Victor, a: number, av: number, expected: Victor}[] = [
            {
                p: new Victor(1, 0),
                a: 0,
                av: 1,
                expected: new Victor(0, 1)
            },
            {
                p: new Victor(0, 1),
                a: 0,
                av: 1,
                expected: new Victor(-1, 0)
            },
            {
                p: new Victor(-1, 0),
                a: 0,
                av: 1,
                expected: new Victor(0, -1)
            },
            {
                p: new Victor(0, -1),
                a: 0,
                av: 1,
                expected: new Victor(1, 0)
            },
            {
                p: new Victor(0, -1),
                a: Math.PI / 2,
                av: 1,
                expected: new Victor(0, 1)
            },
            {
                p: new Victor(-3.5, 6.06217),
                a: -20 * Math.PI / 180,
                av: -5,
                expected: new Victor(34.4682, 6.07768)
            }
        ];

        testCases.forEach(({p, a, av, expected}, index) => {
            it(`should calculate the correct tangential velocity for test case ${index + 1}`, () => {
                testBody.angle = a;
                testBody.angulerVelocity = av;
                testRect.position = p;
                const tangentialVelocity = testRect.getTangentialVelocity(testBody);
                expect(tangentialVelocity.x).toBeCloseTo(expected.x);
                expect(tangentialVelocity.y).toBeCloseTo(expected.y);
            });
        });
    });



            
    describe("getArm", () => {

        const testBody = new TestBody();
        const testRect = new Rectangle(2, 4, new Victor(0, 0), 10, 0);
        testBody.rectangles = [testRect];

        const testCases: {p: Victor, a: number, expected: Victor}[] = [
            {
                p: new Victor(1, 0),
                a: 0,
                expected: new Victor(1, 0)
            },
            {
                p: new Victor(0, 1),
                a: Math.PI / 2,
                expected: new Victor(-1, 0)
            },
            {
                p: new Victor(-1, 0),
                a: Math.PI,
                expected: new Victor(1, 0)
            },
            {
                p: new Victor(0, -1),
                a: -Math.PI / 2,
                expected: new Victor(-1, 0)
            },
            {
                p: new Victor(3, 4),
                a: Math.PI / 4,
                expected: new Victor(-0.7071, 4.9497) // Approximate values
            }
        ];

        testCases.forEach(({p, a, expected}, index) => {
            it(`should calculate the correct arm for test case ${index + 1}`, () => {
                testBody.angle = a;
                testRect.position = p;
                const arm = testRect.getArm(testBody);
                expect(arm.x).toBeCloseTo(expected.x, 4);
                expect(arm.y).toBeCloseTo(expected.y, 4);
            });
        });

    });

});