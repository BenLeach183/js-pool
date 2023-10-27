export default class Settings {
    constructor(poolmode, ballnumber, ballsize, ballspeed, ballacceleration, ballrandomsize, tableratiow, tableratioh, tablesize, 
                ballspeedlabel, ballaccelerationlabel, ballnumberlabel, ballsizelabel, tableaspectlabel, tablesizelabel) {
        // Inputs
        this.poolmode = poolmode;
        this.ballnumber = ballnumber;
        this.ballsize = ballsize;
        this.ballspeed = ballspeed;
        this.ballacceleration = ballacceleration;
        this.ballrandomsize = ballrandomsize;
        this.tableratiow = tableratiow;
        this.tableratioh = tableratioh;
        this.tablesize = tablesize;

        // Labels.
        this.ballspeedlabel = ballspeedlabel;
        this.ballaccelerationlabel = ballaccelerationlabel;
        this.ballnumberlabel = ballnumberlabel;
        this.ballsizelabel = ballsizelabel;
        this.tableaspectlabel = tableaspectlabel;
        this.tablesizelabel = tablesizelabel;

        this.game_mode_changed = false;
        this.settings_open = false;
        this.previous_values = {};
        this.assign_values();

        this.pool_mode_classes = document.querySelectorAll('.poolmode');
        this.non_pool_mode_classes = document.querySelectorAll('.nonpoolmode');
    }

    // Runs once when opened.
    open() {
        Object.assign(this.previous_values, this.values);
        this.settings_open = true;
    }

    // Runs each frame when opened.
    opened() {
        this.assign_values();
        this.ballspeedlabel.innerHTML = `(${this.values.ball_speed})`;
        this.ballaccelerationlabel.innerHTML = `(${this.values.ball_acceleration})`;
        this.ballnumberlabel.innerHTML = `(${this.values.ball_number})`;
        this.ballsizelabel.innerHTML = `(${this.values.ball_size})`;

        this.tableaspectlabel.innerHTML = `(${this.values.table_aspect_width}:${this.values.table_aspect_height})`;
        this.tablesizelabel.innerHTML = `(${Math.floor(this.values.table_size * 100)}%)`;

        if(this.values.pool_mode) {
            // If pool mode is enabled, disable the non pool mode settings.
            this.pool_mode_classes.forEach(element => {
                element.style.display = "inline";
            });

            this.non_pool_mode_classes.forEach(element => {
                element.style.display = "none";
            });
        } else {
            // If pool mode is disabled, enable the non pool mode settings.
            this.pool_mode_classes.forEach(element => {
                element.style.display = "none";
            });

            this.non_pool_mode_classes.forEach(element => {
                element.style.display = "inline";
            });
        }
    }

    // Runs once when closed.
    exit() {
        // Check if game mode has changed, so pool table doesnt get reset from adjusting settings.
        if(this.previous_values.pool_mode != this.values.pool_mode) {
            this.game_mode_changed = true;
        }

        this.settings_open = false;
    }

    assign_values(){
        // Make sure the table aspect ratio input is valid.
        let aspect_width = this.tableratiow.value;
        let aspect_height = this.tableratioh.value;

        if(aspect_width < "0" || isNaN(aspect_width)) {
            aspect_width = "0";
        }
        if(aspect_height < "0" || isNaN(aspect_height)) {
            aspect_height = "0";
        }

        // Assign the values from the html elements.
        this.values = {
            pool_mode: this.poolmode.checked,
            ball_number: parseInt(this.ballnumber.value),
            ball_size: parseInt(this.ballsize.value),
            ball_speed: parseInt(this.ballspeed.value),
            ball_acceleration: parseInt(this.ballacceleration.value),
            ball_random_size: this.ballrandomsize.checked,
            table_aspect_width: parseInt(aspect_width),
            table_aspect_height: parseInt(aspect_height),
            table_size: parseFloat(this.tablesize.value)
        };
    }

}