// Handles the collisions between balls, with the walls, and calculating forces.
import Vector2 from "./vector2.js";

const x_flip = new Vector2(-1, 1);
const y_flip = new Vector2(1, -1);

export default class Physics {
    walls_collision(ball, wall_bounds) {
        //left
        if (ball.position.x - ball.radius <= wall_bounds[0]) {
            ball.movement_vector = ball.movement_vector.multiply_by_vector(x_flip);
            ball.position.x -= (ball.position.x - ball.radius - wall_bounds[0]);
        }

        //right
        if (ball.position.x + ball.radius >= wall_bounds[1]) {
            ball.movement_vector = ball.movement_vector.multiply_by_vector(x_flip);
            ball.position.x -= (ball.position.x + ball.radius - wall_bounds[1]);
        }

        //up
        if (ball.position.y - ball.radius <= wall_bounds[2]) {
            ball.movement_vector = ball.movement_vector.multiply_by_vector(y_flip);
            ball.position.y -= (ball.position.y - ball.radius - wall_bounds[2]);
        }

        //down
        if (ball.position.y + ball.radius >= wall_bounds[3]) {
            ball.movement_vector = ball.movement_vector.multiply_by_vector(y_flip);
            ball.position.y -= (ball.position.y + ball.radius - wall_bounds[3]);
        }
    }

    ball_collision(ball_1, ball_2) {
        // Store the velocity, mass and position of both balls to calculate the new movement vectors for both of them.
        const velocities = [ball_1.movement_vector, ball_2.movement_vector];
        const positions = [ball_1.position, ball_2.position];
        const masses = [ball_1.mass, ball_2.mass];

        ball_1.movement_vector = this.elastic_collision_maths(velocities[0], positions[0], masses[0], velocities[1], positions[1], masses[1]);
        ball_2.movement_vector = this.elastic_collision_maths(velocities[1], positions[1], masses[1], velocities[0], positions[0], masses[0]);
    }

    elastic_collision_maths(velocity_1, position_1, mass_1, velocity_2, position_2, mass_2) {
        const mass_ratio = (mass_2 * 2) / (mass_1 + mass_2);

        //dot product of (v1 - v2) . (x1 - x2)
        const relative_velocity = velocity_1.subtract(velocity_2);
        const normal = position_1.subtract(position_2);
        const dot = relative_velocity.dot_product(normal);

        //normalise vector
        const distance_squared = normal.magnitude_squared();

        const out = velocity_1.subtract(normal.multiply_by_scalar(mass_ratio * dot / distance_squared));
        return out;
    }
}