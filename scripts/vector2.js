export default class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    equals(vector) {
        if(this.x == vector.x && this.y == vector.y) {
            return true;
        }
        return false;
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    dot_product(vector) {
        //(x1 * x2) + (y1 * y2)
        return (this.x * vector.x) + (this.y * vector.y);
    }

    multiply_by_scalar(value) {
        return new Vector2(this.x * value, this.y * value);
    }

    multiply_by_vector(vector) {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }

    divide_by_scalar(value) {

        if(value == 0) {
            return new Vector2(0, 0);
        }

        return new Vector2(this.x / value, this.y / value);
    }

    unit_vector() {
        const magnitude = this.magnitude();
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }

    unit_vector_with_magnitude(magnitude) {
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }

    magnitude() {
        return this.magnitude_squared()**0.5;
    }

    magnitude_squared() {
        return (this.x**2 + this.y**2);
    }
}