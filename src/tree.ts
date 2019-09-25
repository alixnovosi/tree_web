
const NUM_CHILDREN = 3;
const MIN_LENGTH = 50;
const MAX_LEVEL = 6;

export class TreeData {
    public ctx: CanvasRenderingContext2D;

    // store root to retrieve their line equation to calculate our first control point.
    public root: Tree = null;
    public y: (number) => number;

    // tmp
    public color: string = "black";

    public start_x: number;
    public start_y: number;

    public control_x_1: number;
    public control_y_1: number;

    public control_x_2: number;
    public control_y_2: number;

    public end_x: number;
    public end_y: number;

    public height: number;
    public width: number = 12;

    // number of recursion steps we're at.
    public level: number = 0;

    // degrees
    public angle: number = Math.PI / 2;

    public children: Tree[] = [];
}

export class Tree {
    public data: TreeData;

    constructor(
        data: TreeData,
    ) {
        this.data = data;

        this.data.angle += (Math.random() * 0.7) - 0.35

        let height_alter_factor = (Math.random() * 0.20) + 0.90;
        this.data.height *= height_alter_factor;

        let width_alter_factor = (Math.random() * 0.20) + 0.90;
        this.data.width *= width_alter_factor;

        this.data.end_x = this.data.start_x + (this.data.height*Math.cos(this.data.angle));
        this.data.end_y = this.data.start_y - (this.data.height*Math.sin(this.data.angle));

        // TODO this doesn't scale past two.
        if (this.data.level < MAX_LEVEL) {
            let child_data = {
                ...new TreeData(),
                ctx: this.data.ctx,
                height: this.data.height * (5/7),
                width: this.data.width * (4/7),
                start_x: this.data.end_x,
                start_y: this.data.end_y,
                root: this,
                level: this.data.level + 1,
            };

            this.data.children = [
                new Tree(
                    {
                        ...child_data,
                        angle: (1 * Math.PI) / 4,
                        color: this.data.color == "black" ? "black" : this.data.color,
                    },
                ),
                new Tree(
                    {
                        ...child_data,
                        angle: (2 * Math.PI) / 4,
                        color: this.data.color == "black" ? "black" : this.data.color,
                    },
                ),
                new Tree(
                    {
                        ...child_data,
                        angle: (3 * Math.PI) / 4,
                        color: this.data.color == "black" ? "black" : this.data.color,
                    },
                ),
            ];

            if ((Math.random() * 8) < 2) {
                this.data.children.splice(1, 1);
            }
        }
    }

    render(): void {
        this.data.ctx.beginPath();
        this.data.ctx.strokeStyle = this.data.color;
        this.data.ctx.lineWidth = this.data.width;
        this.data.ctx.moveTo(this.data.start_x, this.data.start_y);

        // generate x of control point,
        // and then find y such that the point lies on the line made by start_x/start_y,
        // and the previous segment's second control point x and y.
        if (this.data.root) {
            // find dx between our start and parent's C2.
            // for C1 continuity, our C1 must have the same dx on the opposite side of the line.
            this.data.control_x_1 = (2*this.data.start_x) - this.data.root.data.control_x_2;
            this.data.control_y_1 = (2*this.data.start_y) - this.data.root.data.control_y_2;

        // if parent is null, just generate control point.
        } else {
            this.data.control_x_1 =
                this.data.start_x + ((1/5) * this.data.height * Math.cos(Math.PI/4));
            this.data.control_y_1 =
                this.data.start_y - ((1/5) * this.data.height * Math.sin(Math.PI/4));
        }

        this.data.ctx.strokeStyle = this.data.color;

        if (this.data.root) {
            this.data.control_x_2 =
                Math.random() + this.data.end_x - ((1/5)*this.data.height*Math.cos(Math.PI/4));
            this.data.control_y_2 =
                Math.random() + this.data.end_y - ((1/9)*this.data.height*Math.sin(Math.PI/4));

        } else {
            this.data.control_x_2 =
                Math.random() + this.data.end_x - ((1/5)*this.data.height*Math.cos(Math.PI/4));
            this.data.control_y_2 =
                Math.random() + this.data.end_y - ((1/5)*this.data.height*Math.sin(Math.PI/4));
        }

        // generate our y-function for our child's benefit once we have the second control point.
        this.data.y = this.gen_y(
            this.data.control_x_2,
            this.data.control_y_2,
            this.data.end_x,
            this.data.end_y,
        )

        this.data.ctx.bezierCurveTo(
            this.data.control_x_1,
            this.data.control_y_1,
            this.data.control_x_2,
            this.data.control_y_2,
            this.data.end_x,
            this.data.end_y,
        );
        // this.data.ctx.lineTo(this.data.end_x, this.data.end_y)

        this.data.ctx.stroke();

        // DEBUG render control one.
        if (false) {
            this.data.ctx.beginPath();
            this.data.ctx.lineWidth = 5;
            this.data.ctx.fillStyle = "teal";
            this.data.ctx.strokeStyle = "teal";
            this.data.ctx.ellipse(
                this.data.control_x_1,
                this.data.control_y_1,
                3,
                3,
                0,
                0,
                Math.PI * 2,
            );
            this.data.ctx.fill();
            this.data.ctx.stroke();

            this.data.ctx.beginPath();
            this.data.ctx.lineWidth = 2;
            this.data.ctx.strokeStyle = "black";
            this.data.ctx.moveTo(this.data.start_x, this.data.start_y);
            this.data.ctx.lineTo(this.data.control_x_1, this.data.control_y_1);
            this.data.ctx.stroke();

            this.data.ctx.beginPath();
            this.data.ctx.lineWidth = 2;
            this.data.ctx.strokeStyle = "black";
            this.data.ctx.moveTo(this.data.control_x_2, this.data.control_y_2);
            this.data.ctx.lineTo(this.data.end_x, this.data.end_y);
            this.data.ctx.stroke();

            this.data.ctx.beginPath();
            this.data.ctx.lineWidth = 2;
            this.data.ctx.strokeStyle = "black";
            this.data.ctx.moveTo(this.data.control_x_1, this.data.control_y_1);
            this.data.ctx.lineTo(this.data.control_x_2, this.data.control_y_2);
            this.data.ctx.stroke();

            this.data.ctx.beginPath();
            this.data.ctx.lineWidth = 5;
            this.data.ctx.fillStyle = "magenta";
            this.data.ctx.strokeStyle = "magenta";
            this.data.ctx.ellipse(
                this.data.control_x_2,
                this.data.control_y_2,
                3,
                3,
                0,
                0,
                Math.PI * 2,
            );
            this.data.ctx.fill();
            this.data.ctx.stroke();
        }

        for (let child of this.data.children) {
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
