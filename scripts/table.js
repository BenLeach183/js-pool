import Vector2 from "./vector2.js";

export default class Table {
    constructor(settings, screen, controls) {
        this.settings = settings;
        this.screen = screen;
        this.controls = controls;
        this.hole_radius = 50;

        this.hole_offset = this.hole_radius + 10;
        this.update_hole_positions();

        this.screen.table = this;
        this.draw_holes = true;
    }

    draw(ctx, canvas) {
        //Create the table
        ctx.fillStyle = "rgb(140, 83, 40)";
        ctx.fillRect(0, 0, this.screen.scaled_canvas_width, this.screen.scaled_canvas_height);

        ctx.fillStyle = "rgb(47, 143, 101)";
        ctx.fillRect(40, 40, this.screen.scaled_canvas_width - 80, this.screen.scaled_canvas_height - 80);

        ctx.fillStyle = "rgb(36, 173, 113)";
        ctx.fillRect(60, 60, this.screen.scaled_canvas_width - 120, this.screen.scaled_canvas_height - 120);

        // Delete corners
        ctx.clearRect(0, 0, 39, 39);
        ctx.clearRect(this.screen.scaled_canvas_width - 39, 0, 39, 39);
        ctx.clearRect(0, this.screen.scaled_canvas_height - 39, 39, 39);
        ctx.clearRect(this.screen.scaled_canvas_width - 39, this.screen.scaled_canvas_height - 39, 39, 39);

        // Round corners
        ctx.fillStyle = "rgb(140, 83, 40)";
        ctx.beginPath();
        ctx.moveTo(40, 40);
        ctx.arc(40, 40, 40, Math.PI, -Math.PI / 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.screen.scaled_canvas_width - 40, 40);
        ctx.arc(this.screen.scaled_canvas_width - 40, 40, 40, -Math.PI / 2, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(40, this.screen.scaled_canvas_height - 40);
        ctx.arc(40, this.screen.scaled_canvas_height - 40, 40, Math.PI / 2, Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.screen.scaled_canvas_width - 40, this.screen.scaled_canvas_height - 40);
        ctx.arc(this.screen.scaled_canvas_width - 40, this.screen.scaled_canvas_height - 40, 40, 0, Math.PI / 2);
        ctx.closePath();
        ctx.fill();

        // Only draw the holes if pool mode is enabled.
        if(this.draw_holes) {
            // Holes
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.beginPath();
            ctx.arc(this.hole_positions[0].x, this.hole_positions[0].y, this.hole_radius - 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[1].x, this.hole_positions[1].y, this.hole_radius - 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[2].x, this.hole_positions[2].y, this.hole_radius - 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[3].x, this.hole_positions[3].y, this.hole_radius - 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[4].x, this.hole_positions[4].y, this.hole_radius - 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[5].x, this.hole_positions[5].y, this.hole_radius - 5, 0, Math.PI * 2);
            ctx.fill();

            // Hole shading
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.beginPath();
            ctx.arc(this.hole_positions[0].x, this.hole_positions[0].y, this.hole_radius + 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[1].x, this.hole_positions[1].y, this.hole_radius + 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[2].x, this.hole_positions[2].y, this.hole_radius + 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[3].x, this.hole_positions[3].y, this.hole_radius + 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[4].x, this.hole_positions[4].y, this.hole_radius + 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.hole_positions[5].x, this.hole_positions[5].y, this.hole_radius + 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update_settings() {
        this.draw_holes = this.settings.values.pool_mode;
        this.update_hole_positions();
    }

    update_hole_positions() {
        // Calculate new hole positions.

        this.hole_positions = [
            new Vector2(this.hole_offset, this.hole_offset),
            new Vector2(this.screen.scaled_canvas_width/2, this.hole_offset),
            new Vector2(this.screen.scaled_canvas_width - this.hole_offset, this.hole_offset),
            new Vector2(this.hole_offset, this.screen.scaled_canvas_height - this.hole_offset),
            new Vector2(this.screen.scaled_canvas_width/2, this.screen.scaled_canvas_height - this.hole_offset),
            new Vector2(this.screen.scaled_canvas_width - this.hole_offset, this.screen.scaled_canvas_height - this.hole_offset)
        ];
    }
}