import Victor from 'victor';
import { vectorMagAtAngle } from '../src/helper';

describe('vectorMagAtAngle', () => {
    test('works horizontal', () => {

        const v30 = new Victor(Math.sqrt(3), 1)
        const v45 = new Victor(1,1);
        const v00 = new Victor(1, 0);
        const v60 = new Victor(1, Math.sqrt(3));
        
        expect(vectorMagAtAngle(v45, 0)).toBeCloseTo(1);
        expect(vectorMagAtAngle(v45, Math.PI / 2)).toBeCloseTo(1);
        expect(vectorMagAtAngle(v00, Math.PI/4)).toBeCloseTo(Math.sqrt(1/2));
        expect(vectorMagAtAngle(v60, Math.PI/6)).toBeCloseTo(Math.sqrt(3));

        expect(vectorMagAtAngle(v00, Math.PI)).toBeCloseTo(-1);

        expect(vectorMagAtAngle(v60, Math.PI/4)).toBeCloseTo(1.9318);
        expect(vectorMagAtAngle(v60, 3*Math.PI/4)).toBeCloseTo(0.517);
        expect(vectorMagAtAngle(v30, 3*Math.PI/4)).toBeCloseTo(-0.517);


        expect(vectorMagAtAngle(v60, 150 * Math.PI/180)).toBeCloseTo(0);
    });
});