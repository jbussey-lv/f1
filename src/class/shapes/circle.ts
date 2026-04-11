import Victor from "victor";
import AbstractShape from "./abstract_shape";

export default class Circle extends AbstractShape{
    radius: number;

    constructor(
        radius: number, // vertical
        position: Victor, // refers to its center
        mass: number,
        angle: number = 0,
        color: string = "blue"
    ){
        super(
            position,
            mass,
            angle,
            color
        )
        this.radius = radius;
        this.position = position;
        this.mass = mass;
        this.angle = angle || this.angle;
        this.color = color || this.color;
    }

    get com(): Victor { // center of mass
        return new Victor(this.radius, this.radius);
    }

    get momentOfInertia(): number{
        return (1 / 2) * this.mass * (this.radius ** 2);
    }

    getSvgElement(
        document: Document,
        svgNamespace: string,
        pixelsPerMeter: number,
        positionInPixels: Victor
    ): SVGElement {
        const circElement = document.createElementNS(svgNamespace, "circle");
        const radiusInPixels = this.radius * pixelsPerMeter;

        circElement.setAttribute("cx", positionInPixels.x.toString());
        circElement.setAttribute("cy", positionInPixels.y.toString());
        circElement.setAttribute("r", radiusInPixels.toString());
        circElement.setAttribute("fill", this.color);

        return circElement;
    }

}