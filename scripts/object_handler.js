// In charge of putting objects in the scene, and handling them.
import Ball from "./ball.js";
import Vector2 from "./vector2.js";
import Physics from "./physics.js";

const BALL_RADIUS = 40;
const physics = new Physics();
let balls_moving = false;

export default class ObjectHandler {
    constructor(settings, canvas, controls, screen, indicator, table) {
        this.settings = settings;
        this.canvas = canvas;
        this.controls = controls;
        this.screen = screen
        this.indicator = indicator;
        this.table = table;

        this.update_settings();
        this.load_balls_array();
    }

    update(elapsed) {
        // Loop over the balls in the scene, check for collisions and call each balls update function.
        // check update first, this handles position and velocity of the balls, and then check collision as
        // this will update the velocity and position values after, draw function is called after.
        balls_moving = false;

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            ball.update(elapsed);
            this.ball_collision_checks(ball, i)

            // If pool mode is on, check if the ball has moved and then check if it is in a hole.
            if(this.pool_mode && (ball.position.x != ball.previous_position.x || ball.position.y != ball.previous_position.y)) {
                this.hole_check(ball, i);
                balls_moving = true;
            }
        }

        // If pool mode is on, and any ball is moving, don't allow selecting of the ball.
        if(this.pool_mode) {
            if(balls_moving) {
                this.balls[0].selectable = false;
            } else {
                this.balls[0].selectable = true;
            }
        }

        // Set values for the direction indicator.
        if(this.controls.selected) {
            this.indicator.enabled = true;
            this.indicator.position = this.controls.selected_ball.position;
            this.indicator.direction = this.controls.drag_direction;
            this.indicator.strength = this.controls.drag_strength;
            this.indicator.ball_radius = this.controls.selected_ball.radius;
        } else {
            this.indicator.enabled = false;
        }
    }

    draw(ctx) {
        this.balls.forEach(ball => {
            ball.draw(ctx);
        });
    }

    ball_collision_checks(ball, i) {
        // Work out the wall boundaries.
        const wall_bounds = [40, this.screen.scaled_canvas_width - 40, 40, this.screen.scaled_canvas_height - 40];

        physics.walls_collision(ball, wall_bounds);

        // Loop over other remaining balls, this checks each ball-ball pair once.
        for (let j = i + 1; j < this.balls.length; j++) {
            // Check if the balls overlap, take the distance squared between the middle of the two circles
            // if it is less then the radii combined and squared then they overlap.
            let difference = ball.position.subtract(this.balls[j].position);
            let distance_squared = difference.magnitude_squared();

            // If the balls are exactly inside each other move them slightly apart.
            if(distance_squared == 0) {
                ball.position = ball.position.add(new Vector2(-0.1, -0.1));
                this.balls[j].position = this.balls[j].position.add(new Vector2(0.1, 0.1));

                difference = ball.position.subtract(this.balls[j].position);
                distance_squared = difference.magnitude_squared();
            }

            //check if they collide
            if (distance_squared < ((ball.radius) + (this.balls[j].radius))**2) {
                // Apply the collision physics.
                physics.ball_collision(ball, this.balls[j]);

                // Move the balls apart if they overlap each other.
                const distance_between_balls = distance_squared**0.5;
                const distance_overlapped = (ball.radius + this.balls[j].radius) - distance_between_balls;

                // Multiply the unit vector of the difference of the balls positions by the distance vector of how much they overlap.
                const move = (difference.unit_vector_with_magnitude(distance_between_balls)).multiply_by_scalar(distance_overlapped);
                ball.position = ball.position.add(move);
                this.balls[j].position = this.balls[j].position.subtract(move);
            }
        }
    }

    hole_check(ball, i) {
        this.table.hole_positions.forEach((hole) => {
            // Test if centre of ball overlaps edge of hole.
            if(ball.position.subtract(hole).magnitude_squared() <= this.table.hole_radius**2) {
                ball.shrink_to(hole);

                // If ball has shrunk to less then 0.2, can delete, or move to spawn if white.
                if(ball.radius <= 2) {
                    if(i == 0) {
                        // If it's the white ball move it to the respawn point.
                        ball.position.set(316, this.screen.scaled_canvas_height/2);
                        ball.movement_vector.set(0, 0);
                        ball.radius = BALL_RADIUS;
                        ball.in_hole = false;
                    } else {
                        // Remove the ball from the array.
                        this.balls.splice(i, 1);
                    }
                }
            }
        });
    }

    load_balls_array() {
        // If pool mode is on, spawn the balls in the correct spots, else spawn them random.
        if(this.pool_mode){
            const red_style = [255, 62, 62];
            const yellow_style = [232, 255, 84];
            const black_style = [23, 23, 23];
            const white_style = [228, 228, 228];
    
            // Set the positions of the spawn points for each ball.
            const positions = [
                new Vector2(316, this.screen.scaled_canvas_height/2),
                new Vector2(982, this.screen.scaled_canvas_height/2),
                new Vector2(982+69.3, this.screen.scaled_canvas_height/2+40),
                new Vector2(982+69.3, this.screen.scaled_canvas_height/2-40),
                new Vector2(982+(69.3*2), this.screen.scaled_canvas_height/2 + (40*2)),
                new Vector2(982+(69.3*2), this.screen.scaled_canvas_height/2),
                new Vector2(982+(69.3*2), this.screen.scaled_canvas_height/2 - (40*2)),
                new Vector2(982+(69.3*3), this.screen.scaled_canvas_height/2 + (40*3)),
                new Vector2(982+(69.3*3), this.screen.scaled_canvas_height/2 + (40)),
                new Vector2(982+(69.3*3), this.screen.scaled_canvas_height/2 - (40)),
                new Vector2(982+(69.3*3), this.screen.scaled_canvas_height/2 - (40*3)),
                new Vector2(982+(69.3*4), this.screen.scaled_canvas_height/2 + (40*4)),
                new Vector2(982+(69.3*4), this.screen.scaled_canvas_height/2 + (40*2)),
                new Vector2(982+(69.3*4), this.screen.scaled_canvas_height/2),
                new Vector2(982+(69.3*4), this.screen.scaled_canvas_height/2 - (40*2)),
                new Vector2(982+(69.3*4), this.screen.scaled_canvas_height/2 - (40*4))
            ];
    
            // Set the colour of each ball.
            const colours = [
                white_style,
                red_style,
                yellow_style,
                red_style,
                red_style,
                black_style,
                yellow_style,
                yellow_style,
                red_style,
                yellow_style,
                red_style,
                red_style,
                yellow_style,
                red_style,
                yellow_style,
                yellow_style
            ];
    
            // Create an array to store the balls and loop through to spawn them in.
            this.balls = new Array(16);
    
            for(let i = 0; i < this.balls.length; i++){
                this.balls[i] = new Ball(
                    positions[i],
                    BALL_RADIUS,
                    (Math.PI * (BALL_RADIUS) ** 2) * 40,
                    false,
                    colours[i],
                    this.settings
                );
            }
    
            this.balls[0].selectable = true;
        }
        else {
            this.balls = Array.from({ length: this.n_balls }, () => {
                let radius = 0;

                // If random size enabled change the size.
                if(this.settings.values.ball_random_size) {
                    radius = 10 + Math.random()*100;
                } else {
                    radius = this.ball_size;
                }

                return new Ball(
                    new Vector2((40 + Math.random() * (this.screen.scaled_canvas_width - 80)), (40 + Math.random() * (this.screen.scaled_canvas_height - 80))),
                    radius,
                    (Math.PI * (radius) ** 2) * 40,
                    true,
                    [Math.random() * 255, Math.random() * 255, Math.random() * 255],
                    this.settings
                );
            });
        }

        this.controls.balls = this.balls; 
    }

    update_settings() {
        this.pool_mode = this.settings.values.pool_mode;
        this.n_balls = this.settings.values.ball_number;
        this.ball_size = this.settings.values.ball_size;

        // If the settings are changed reload the balls.
        if(!this.pool_mode || this.settings.game_mode_changed){
            this.load_balls_array();
        }
    }
}