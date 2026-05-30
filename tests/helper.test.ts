import Victor from 'victor';
import { vectorMagAtAngle } from '../src/helper';

describe('vectorMagAtAngle', () => {
    test('works horizontal', () => {

        const v45 = new Victor(1,1);
        const v00 = new Victor(1, 0);
        const v60 = new Victor(1, Math.sqrt(3))
        
        expect(vectorMagAtAngle(v45, 0)).toBeCloseTo(1);
        expect(vectorMagAtAngle(v45, Math.PI / 2)).toBeCloseTo(1);
        expect(vectorMagAtAngle(v00, Math.PI/4)).toBeCloseTo(Math.sqrt(1/2));
        expect(vectorMagAtAngle(v60, Math.PI/6)).toBeCloseTo(Math.sqrt(3));
    });
});