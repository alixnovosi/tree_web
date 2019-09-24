import Controls from "./controls";
import Tree from "./tree";

import "./styles/main.scss";

class App {
    private tree: Tree;

    private base: HTMLElement;
    private controls: Controls;

    // primary canvas.
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private height: number = 900;
    private width: number = 1000;

    private bgColor: string = "#CCCCFF";
    private lineColor: string = "#111122";
    private highlightColor: string = "#EFEFFF";

    constructor() {
        this.base = <HTMLElement>document.getElementById("app");

        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");

        this.base.appendChild(this.canvas);

        this.tree = new Tree(
            this.ctx,
            this.width / 2,
            this.height,
            150,
        );
    }

    public setup(): void {
        this.initCanvas();
        this.tree.render();
    }

    private initCanvas(): void {
    }
}

window.onload = () => {
    let app = new App();

    app.setup();
}
