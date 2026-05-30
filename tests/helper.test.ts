import Victor from 'victor';
import { vectorMagAtAng, vectorFromMagAng } from '../src/helper';

describe('vectorFromMagAng', () => {
    test('basic accute and obtuse tests', () => {
        const v45 = vectorFromMagAng(Math.sqrt(2), Math.PI/4);
        const v240 = vectorFromMagAng(10, 240*Math.PI/180);

        expect(v45.x).toBeCloseTo(1);
        expect(v45.y).toBeCloseTo(1);

        expect(v240.x).toBeCloseTo(-5.0);
        expect(v240.y).toBeCloseTo(-8.66);
    });
});

describe('vectorMagAtAngle', () => {
    test('basic accute and obtuse tests', () => {

        const v30 = new Victor(Math.sqrt(3), 1)
        const v45 = new Victor(1,1);
        const v00 = new Victor(1, 0);
        const v60 = new Victor(1, Math.sqrt(3));
        
        expect(vectorMagAtAng(v45, 0)).toBeCloseTo(1);
        expect(vectorMagAtAng(v45, Math.PI / 2)).toBeCloseTo(1);
        expect(vectorMagAtAng(v00, Math.PI/4)).toBeCloseTo(Math.sqrt(1/2));
        expect(vectorMagAtAng(v60, Math.PI/6)).toBeCloseTo(Math.sqrt(3));

        expect(vectorMagAtAng(v00, Math.PI)).toBeCloseTo(-1);

        expect(vectorMagAtAng(v60, Math.PI/4)).toBeCloseTo(1.9318);
        expect(vectorMagAtAng(v60, 3*Math.PI/4)).toBeCloseTo(0.517);
        expect(vectorMagAtAng(v30, 3*Math.PI/4)).toBeCloseTo(-0.517);


        expect(vectorMagAtAng(v60, 150 * Math.PI/180)).toBeCloseTo(0);
    });
});