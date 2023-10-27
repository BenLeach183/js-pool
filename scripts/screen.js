// Works out the canvas height, width, position and scaling to fit the screen size.

export default class Screen {
    constructor(settings, ctx, canvas, pixelRatio) {
        this.settings = settings;
        this.ctx = ctx;
        this.canvas = canvas;
        this.pixelRatio = pixelRatio;

        this.table_size_percent = 0.8;
        this.table_aspect_ratio = 1/2;

        this.scale = 1;
        this.rotated = false;

        this.scaled_canvas_width = canvas.width;
        this.scaled_canvas_height = canvas.height;

        this.table = null;
        this.window_resize();
    }

    update_settings() {
        // Set the aspect ratio of the table, if the height is 0 set ratio to 0.
        if(this.settings.values.table_aspect_height == 0) {
            this.table_aspect_ratio = 0;
        }
        else {
            this.table_aspect_ratio = this.settings.values.table_aspect_width / this.settings.values.table_aspect_height;
        }

        // Set the size of the table.
        this.table_size_percent = this.settings.values.table_size;

        this.window_resize();
    }

    window_resize() {
        let aspect_ratio = this.table_aspect_ratio;

        // If the width is less then the height, flip the aspect ratio so the table becomes vertical.
        if(window.innerWidth < window.innerHeight && aspect_ratio != 0) {
            aspect_ratio = 1 / aspect_ratio;
            this.rotated = true;
        } else {
            this.rotated = false;
        }

        // Calculate the maximum width and height based on the size perctenage.
        this.canvas_width = window.innerWidth * this.pixelRatio * this.table_size_percent;
        this.canvas_height = window.innerHeight * this.pixelRatio * this.table_size_percent;

        // If the aspect ratio is 0 skip, the width and height won't be locked to each other.
        // Otherwise calculate the scaled height and width to account for aspect ratio.
        if(aspect_ratio != 0) {
            const canvas_height_aspect = this.canvas_width * aspect_ratio;

            if(this.canvas_height < canvas_height_aspect) {
                this.canvas_width = this.canvas_height / aspect_ratio;
            } else {
                this.canvas_height = canvas_height_aspect;
            }
        }

        // Calculate the scale. (1498 and 749 are just the default table size I set).
        let scale_x = this.canvas_width / 1498;
        let scale_y = this.canvas_height / 749;

        if(this.rotated) {
            scale_x = this.canvas_width / 749;
            scale_y = this.canvas_height / 1498;
        }

        if(scale_x < scale_y) {
            this.scale = scale_x;
        } else {
            this.scale = scale_y;
        }

        // Work out the top left position of the canvas.
        this.canvas_position_left = (window.innerWidth /2) - (this.canvas_width / (2 * this.pixelRatio));
        this.canvas_position_top = (window.innerHeight /2) - (this.canvas_height / (2 * this.pixelRatio));
        
        // Place and scale the canvas element.
        this.canvas.width  = this.canvas_width;
        this.canvas.height = this.canvas_height;
        this.canvas.style.width = `${this.canvas_width / this.pixelRatio}px`;
        this.canvas.style.height = `${this.canvas_height / this.pixelRatio}px`;

        this.canvas.style.left = `${this.canvas_position_left}px`;
        this.canvas.style.top = `${this.canvas_position_top}px`;

        if(this.rotated) {
            this.scaled_canvas_width = this.canvas_height / this.scale;
            this.scaled_canvas_height = this.canvas_width / this.scale;
        } else {
            this.scaled_canvas_width = this.canvas_width / this.scale;
            this.scaled_canvas_height = this.canvas_height / this.scale;
        }

        // If the aspect ratio isn't locked, the hole positions need to be re-calculated.
        if(aspect_ratio == 0) {
            this.table.update_hole_positions();
        }
    }
}