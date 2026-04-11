import Victor from "victor";
import AbstractShape from "./abstract_shape";

export default class Rectangle extends AbstractShape{
    width: number;
    height: number;

    constructor(
        width: number, // horizontal
        height: number, // vertical
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
        this.width = width;
        this.height = height;
    }

    get com(): Victor { // center of mass
        return new Victor(this.width / 2, this.height / 2);
    }

    getSvgElement(
        document: Document,
        svgNamespace: string,
        pixelsPerMeter: number,
        positionInPixels: Victor
    ): SVGElement {
        const rectElement = document.createElementNS(svgNamespace, "rect");
        const widthInPixels = this.width * pixelsPerMeter;
        const heightInPixels = this.height * pixelsPerMeter;
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