import Vector2 from "./vector2.js";

export default class Controls {
    constructor(settings, screen) {
        this.settings = settings;
        this.screen = screen;

        this.mouse_position = new Vector2(0, 0);
        this.selected_ball = null;
        this.selected = false;
        this.drag_direction = new Vector2(0, 0);
        this.drag_strength = new Vector2(0, 0);
        this.speed = 45;
    }

    move_mouse(pageX, pageY) {
        // Convert the page mouse coordinates relative to the canvas.
        this.mouse_position.set(pageX, pageY);
        this.convert_coordinates_to_canvas(this.mouse_position);

        this.check_drag_strength();
    }

    select_ball(pageX, pageY) {
        // If the settings are open don't allow the ball to be selected.
        if(this.settings.settings_open){
            return;
        }

        // In the case of mobile I need to set the coordinates when they start touching.        
        this.mouse_position.set(pageX, pageY);
        this.convert_coordinates_to_canvas(this.mouse_position);

        // Loop through the list in reverse so that the balls on top are selected first.
        for (let i = this.balls.length - 1; i >= 0; i--) {
            // Check if ball is selectable.
            if (this.balls[i].selectable == false) {
                this.selected_ball = null;
                continue;
            }

            //Check if mouse is hovered over the ball, if so set the selected_ball variable to the ball.
            if ((this.balls[i].position.x - this.mouse_position.x) ** 2 + (this.balls[i].position.y - this.mouse_position.y) ** 2 <= (this.balls[i].radius) ** 2) {
                this.selected_ball = this.balls[i];
                this.selected_ball.selected = true;
                this.selected = true;
                break;
            }
            this.selected_ball = null;
        }

        this.check_drag_strength();
    }

    release_ball() {
        // Check if a ball is selected.
        if(this.selected_ball) {

            // Only move if mouse is released outside of ball.
            if (this.drag_distance_sqr > (this.selected_ball.radius) ** 2) {
                this.speed = this.settings.values.ball_speed;
                this.selected_ball.movement_vector = this.drag_direction.unit_vector().multiply_by_scalar(this.drag_strength * this.speed);
            }

            this.selected_ball.selected = false;
            this.selected = false;
        }
    }

    convert_coordinates_to_canvas(coordinates) {
        // Find the position of the coordinates relative to the canvas position.
        coordinates.x -= this.screen.canvas_position_left;
        coordinates.y -= this.screen.canvas_position_top;

        // Rotate the coordinates if table is rotated.
        if(this.screen.rotated){
            const temp_x = coordinates.x;
            coordinates.x = coordinates.y;
            coordinates.y = (this.screen.canvas.width / this.screen.pixelRatio) - temp_x;
        }

        // Scale the coordinates relative to the canvas scaling.
        coordinates.x /= (this.screen.scale / this.screen.pixelRatio);
        coordinates.y /= (this.screen.scale / this.screen.pixelRatio);
    }

    check_drag_strength() {
        if(this.selected) {
            // Work out the distance the mouse is from the ball.
            this.drag_direction.set(this.selected_ball.position.x - this.mouse_position.x, this.selected_ball.position.y - this.mouse_position.y);
            this.drag_distance_sqr = this.drag_direction.magnitude_squared();

            // Only set strength if mouse is released outside of ball.
            if (this.drag_distance_sqr > (this.selected_ball.radius) ** 2) {
                const closest_point_on_circle = this.drag_direction.unit_vector_with_magnitude(this.drag_distance_sqr**0.5).multiply_by_scalar(this.selected_ball.radius);
                this.drag_strength = this.drag_direction.subtract(closest_point_on_circle).magnitude();
            } else {
                this.drag_strength = 0;
            }

            // Scale strength, so that you have to move the mouse further
            this.drag_strength /= 5;

            // Limit strength - not the speed, the max distance you can drag back.
            if(this.drag_strength > 40) {
                this.drag_strength = 40;
            }
        }
    }
}