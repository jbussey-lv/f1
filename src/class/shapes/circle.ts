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
        const rectElement = document.createElementNS(svgNamespace, "rect");
        const widthInPixels = this.radius * pixelsPerMeter;
        const heightInPixels = this.radius * pixelsPerMeter;
        rectElement.setAttribute("x", (positionInPixels.x - widthInPixels / 2).toString());
        rectElement.setAttribute("y", (positionInPixels.y - heightInPixels / 2).toString());
        rectElement.setAttribute("width", widthInPixels.toString());
        rectElement.setAttribute("height", heightInPixels.toString());
        rectElement.setAttribute("fill", this.color);
        const rotateTransform = `${-1 * this.angle * 180 / Math.PI} ${positionInPixels.x} ${positionInPixels.y}`;
        rectElement.setAttribute("transform", `rotate(${rotateTransform})`);
        return rectElement;
    }

}