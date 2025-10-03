import Victor from "victor";
import { Wheel } from "../src/class/wheel";
import Body from "../src/class/body";

class BodyStub extends Body {

    updateLeverArms(): void {}

    get rectangles() {return [];}
}


type TestData = {
    wheelPosition: Victor,
    wheelAngle: number,
    wheelAngularVelocity: number,
    wheelRadius: number,
    bodyVelocity: Victor,
    bodyAngle: number,
    bodyAngularVelocity: number,
    expectedNaive: Victor,
    expectedAbsolute: Victor,
}

const testDatas: TestData[] = [{
    wheelPosition: new Victor(0, 0),
    wheelAngle: 0, 
    wheelAngularVelocity: 0,
    wheelRadius: 1,
    bodyVelocity: new Victor(0, 0),
    bodyAngle: 0,
    bodyAngularVelocity: 0,
    expectedNaive: new Victor(0, 0),
    expectedAbsolute: new Victor(0, 0),
},{
    wheelPosition: new Victor(1, 1),
    wheelAngle: Math.PI / 2,
    wheelAngularVelocity: 1,
    wheelRadius: 1,
    bodyVelocity: new Victor(0, 1),
    bodyAngle: 0,
    bodyAngularVelocity: 0,
    expectedNaive: new Victor(0, -1),
    expectedAbsolute: new Victor(0, 0),
},{
    wheelPosition: new Victor(0, 0),
    wheelAngle: Math.PI,
    wheelAngularVelocity: 1,
    wheelRadius: 1,
    bodyVelocity: new Victor(0, 0),
    bodyAngle: Math.PI / 2,
    bodyAngularVelocity: 0,
    expectedNaive: new Victor(1, 0),
    expectedAbsolute: new Victor(0, 1),
},{
    wheelPosition: new Victor(2, 1),
    wheelAngle: 3/4 * Math.PI,
    wheelAngularVelocity: 2.5,
    wheelRadius: 2,
    bodyVelocity: new Victor(5, 6),
    bodyAngle: 5 * Math.PI / 6,
    bodyAngularVelocity: 3,
    expectedNaive: new Victor(Math.sqrt(12.5), -Math.sqrt(12.5)),
    expectedAbsolute: new Victor(3.7059, 10.82962913),
}];

describe("Wheel", () => {
    describe("getContactPatchVelocity", () => {
        const body = new BodyStub();
        const wheel = new Wheel(new Victor(0,0), 0.5, 0.5, 15, 20, 15, 10);
    

        testDatas.forEach((data, index) => {

            it(`should calculate correct contact pacth velocity naive (${index})`, () => {

                wheel.position = data.wheelPosition;
                wheel.angle = data.wheelAngle;
                wheel.angularVelocity = data.wheelAngularVelocity;
                wheel.radius = data.wheelRadius;
                body.velocity = data.bodyVelocity;
                body.angle = data.bodyAngle;

                const vn = wheel.getContactPathVelocityNaive();
                const va = wheel.getContactPatchVelocity(body);
                expect(vn.x).toBeCloseTo(data.expectedNaive.x, 4);
                expect(vn.y).toBeCloseTo(data.expectedNaive.y, 4);

                expect(va.x).toBeCloseTo(data.expectedAbsolute.x, 4);
                expect(va.y).toBeCloseTo(data.expectedAbsolute.y, 4);
            });

            // it(`should calculate the correct contact patch velocity - case ${index + 1}`, () => {
            //     wheel.angularVelocity = data.wheelAngularVelocity;
            //     wheel.radius = data.wheelRadius;
            //     body.velocity = data.bodyVelocity;
            //     body.angle = data.bodyAngle;
            //     const result = wheel.getContactPatchVelocity(body);
            //     expect(result.x).toBeCloseTo(data.expectedContactPatchVelocity.x, 4);
            //     expect(result.y).toBeCloseTo(data.expectedContactPatchVelocity.y, 4);
            // });
        });
      
    });
});