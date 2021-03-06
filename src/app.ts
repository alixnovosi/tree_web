import Controls from "./controls";
import { Tree, TreeData } from "./tree";

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
            {
                ...new TreeData(),
                ctx: this.ctx,
                start_x: this.width/2,
                start_y: this.height+10,
                height: this.height * 0.29,
            },
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
