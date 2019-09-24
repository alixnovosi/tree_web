
const NUM_CHILDREN = 3;
const MIN_LENGTH = 50;

export default class Tree {
    private ctx: CanvasRenderingContext2D;

    // store root to retrieve their line equation to calculate our first control point.
    private root: Tree = null;
    private y: (number) => number;

    // tmp
    private color: string;

    private start_x: number;
    private start_y: number;

    private control_x_1: number;
    private control_y_1: number;

    private control_x_2: number;
    private control_y_2: number;

    private end_x: number;
    private end_y: number;

    private height: number;
    private width: number;

    // degrees
    private angle: number;

    private children: Tree[] = [];

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        height: number,
        angle?: number,
        width?: number,
        root?: Tree,
        color?: string,
    ) {
        this.ctx = ctx;

        this.start_x = x;
        this.start_y = y;
        this.height = height;

        if (!color) {
            color = "black";
        }
        this.color = color;

        if (!width) {
            width = 12;

        }
        this.width = width;

        if (!angle) {
            angle = Math.PI / 2;
        }
        this.angle = angle

        this.angle += (Math.random() * 0.5) - 0.25

        this.root = root;

        let height_alter_factor = this.height * ((Math.random() * .10) - .05);
        this.height += height_alter_factor;

        this.end_x = this.start_x + (this.height*Math.cos(this.angle));
        this.end_y = this.start_y - (this.height*Math.sin(this.angle));

        // TODO this doesn't scale past two.
        if (this.height > MIN_LENGTH) {
            let child_height = this.height * (5/7);
            let child_width = this.width * (4/7);

            this.children = [
                new Tree(
                    this.ctx,
                    this.end_x,
                    this.end_y,
                    child_height,
                    (1 * Math.PI) / 4,
                    child_width,
                    this,
                    this.color == "black" ? "red" : this.color,
                ),
                // new Tree(
                //     this.ctx,
                //     this.end_x,
                //     this.end_y,
                //     child_height,
                //     (2 * Math.PI) / 4,
                //     child_width,
                //     this,
                // ),
                new Tree(
                    this.ctx,
                    this.end_x,
                    this.end_y,
                    child_height,
                    (3 * Math.PI) / 4,
                    child_width,
                    this,
                    this.color == "black" ? "blue" : this.color,
                ),
            ];

            // if ((Math.random() * 8) < 2) {
            //     this.children.splice(1, 1);
            // }
        }
    }

    render(): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.width;
        this.ctx.moveTo(this.start_x, this.start_y);

        // generate x of control point,
        // and then find y such that the point lies on the line made by start_x/start_y,
        // and the previous segment's second control point x and y.
        if (this.root) {
            this.control_x_1 = this.start_x + (0.5*Math.cos(this.angle));
            this.control_y_1 = this.root.y(this.control_x_1);

        // if parent is null, just generate control point.
        } else {
            this.control_x_1 = (Math.random() * (this.end_x-this.start_x)) + this.start_x;
            this.control_y_1 = (Math.random() * (this.end_y-this.start_y)) + this.start_y;
        }

        if (!this.control_y_1) {
            console.log(`chose control x1 ${this.control_x_1} and y1 ${this.control_y_1}`);
        }

        this.control_x_2 = (Math.random() * (this.end_x-this.control_x_1)) + this.control_x_1;
        this.control_y_2 = (Math.random() * (this.end_y-this.control_y_1)) + this.control_y_1;

        // generate our slope for our child's benefit once we have the second control point.
        this.y = this.gen_y(
            this.control_x_2,
            this.control_y_2,
            this.end_x,
            this.end_y,
        )

        this.ctx.bezierCurveTo(
            this.control_x_1,
            this.control_y_1,
            this.control_x_2,
            this.control_y_2,
            this.end_x,
            this.end_y,
        );
        // this.ctx.lineTo(this.end_x, this.end_y)

        this.ctx.stroke();

        for (let child of this.children) {
            child.render();
        }
    }

    private gen_y(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): (number) => number {
        let slope = (y2 - y1) / (x2 - x1);
        return (x: number) => {
            return (slope * (x - x1)) + y1;
        };
    }
}
