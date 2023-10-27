// The class representing the ball, for rendering and moving.
import Vector2 from "./vector2.js";

export default class Ball {
    constructor(position, radius, mass, selectable, rgb, settings) {
        this.position = position;
        this.radius = radius;
        this.mass = mass;
        this.selectable = selectable;
        this.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        this.settings = settings;

        this.movement_vector = new Vector2(0, 0);
        this.previous_position = new Vector2(undefined, undefined);
        this.selected = false;

        this.shrink_position_multiplier = null;
        this.shrink_multiplier = null;
        this.in_hole = false;
    }

    update(elapsed) {
        this.previous_position = this.position.copy();

        // Check whether the ball is in a hole, if not then add the movement to it.
        if(!this.in_hole) {
            // Check if ball has motion applied to it.
            if(this.movement_vector.x != 0 && this.movement_vector.y != 0) {
                // Get the magnitude and unit vector of movement vector.
                let magnitude = this.movement_vector.magnitude();
                const movement_unit_vector = this.movement_vector.unit_vector_with_magnitude(magnitude);

                // Calculate new magnitude of movement after applying acceleration.
                magnitude += this.settings.values.ball_acceleration;

                if(magnitude < 0) {
                    magnitude = 0;
                }

                // Multiply the unit vector by the new magnitude to get new speed.
                this.movement_vector = movement_unit_vector.multiply_by_scalar(magnitude);

                // Update position
                this.position = this.position.add(this.movement_vector.multiply_by_scalar(elapsed));
            }
        } else {
            // If ball is in hole then shrink and move towards hole.
            this.radius *= this.shrink_multiplier;
            this.position = this.position.add(this.shrink_position_multiplier);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.fillStyle;

        if(this.selected) {
            ctx.fillStyle = `rgb(100, 100, 100)`;
        }
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgb(50, 50, 50)"
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    shrink_to(position) {
        this.in_hole = true;
        this.shrink_multiplier = 0.92;
        this.shrink_position_multiplier = position.subtract(this.position).multiply_by_scalar(1-this.shrink_multiplier);
    }
}