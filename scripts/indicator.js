import Vector2 from "./vector2.js";

export default class Indicator {
    constructor() {
        this.enabled = false;
        this.position = new Vector2(0, 0);
        this.strength = 0;
        this.direction = new Vector2(0, 0);
        this.ball_radius = 1;
        this.arrow_size = 15;
    }

    draw(ctx) {
        if(this.enabled) {
            this.arrow_size = this.strength + 15;
            ctx.save();

            ctx.strokeStyle = `rgb(160, 255, 200)`;
            ctx.lineWidth = 7;

            // Rotate indicator in direction opposite mouse.
            ctx.beginPath();
            ctx.translate(this.position.x, this.position.y);
            const angle = Math.atan2(this.direction.y, this.direction.x);
            ctx.rotate(angle);

            // Arrow line
            ctx.moveTo(this.ball_radius, 0);
            ctx.lineTo(this.arrow_size + this.ball_radius, 0);

            // Arrow points
            ctx.moveTo(this.arrow_size + this.ball_radius - 15, 15);
            ctx.lineTo(this.arrow_size + this.ball_radius, 0);
            ctx.moveTo(this.arrow_size + this.ball_radius - 15, -15);
            ctx.lineTo(this.arrow_size + this.ball_radius, 0);

            ctx.stroke();
            ctx.restore();
        }
    }
}