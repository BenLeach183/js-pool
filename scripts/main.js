//              POOL GAME
// INPUTS - You click on the white ball and drag the mouse, the further back it is pulled, the faster it will
//          shoot in the opposite direction.
//          There are also mobile touch controls and the website works on mobile.
//          Pressing 'R' will respawn the balls.
//
// SETTINGS - There are some settings that can be changed to modify the game.
//            
//          Here are some settings explained:
//          Pool Mode: disabling this will remove the holes, and you can click and drag any ball. It also randomizes spawn location.
//
//          Number of Balls - Ball Radius - Random Size: The upper limit of these currently allows for more area of balls then available
//          on the screen, it won't break the game but if the balls won't settle, either number of balls, or radius will have to be decreased.
//          
//          Random Size: This overrides the radius setting, and each ball will have a mass based on its size, so they will interact
//          differently with each other.
//
//          Table Settings: The aspect ratio will determine the ratio of width to length of the table, if either of these are <= 0
//          the aspect ratio will no longer be locked and they will scale with the screen.
//
// SCREEN SCALING - The table will scale appropriately to the screen size, and if the width < height of the screen it will rotate the table,
//                  this is useful for mobile users.

import ObjectHandler from "./object_handler.js";
import Controls from "./controls.js";
import Table from "./table.js";
import Screen from "./screen.js";
import Indicator from "./indicator.js";
import Settings from "./settings.js";

const ctx = canvas.getContext("2d");

const settings = new Settings(poolmode, ballnumber, ballsize, ballspeed, ballacceleration, ballrandomsize, tableratiow, tableratioh, tablesize, 
                                ballspeedlabel, ballaccelerationlabel, ballnumberlabel, ballsizelabel, tableaspectlabel, tablesizelabel);
const screen = new Screen(settings, ctx, canvas, window.devicePixelRatio);
const indicator = new Indicator();
const controls = new Controls(settings, screen);
const table = new Table(settings, screen, controls);
const object_handler = new ObjectHandler(settings, canvas, controls, screen, indicator, table);

// Bool for if the settings menu is open.
let settings_open = false;

let p;
// Called each frame, calculates the elapsed time between each frame call
// calls the update and draw function each frame.
function frame(ts) {
    const elapsed = ts - p || 0;
    p = ts;

    update(elapsed / 1000);
    draw(ctx);

    requestAnimationFrame(frame);
}

function update(elapsed) {
    object_handler.update(elapsed);

    if(settings_open) {
        settings.opened();
    }
}

function draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    // Rotate the context if the canvas is rotated to vertical mode.
    if(screen.rotated){
        ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2); // Move origin to center
        ctx.rotate(Math.PI / 2);
        ctx.translate(-ctx.canvas.height/2, -ctx.canvas.width/2); //Move origin back
    }

    // Apply the scale from window resizing.
    ctx.scale(screen.scale, screen.scale);

    // Call the draw functions.
    table.draw(ctx, canvas);
    object_handler.draw(ctx);
    indicator.draw(ctx);

    ctx.restore();
}

requestAnimationFrame(frame);

// --------- Event Listeners ---------

window.addEventListener('keydown', ev => {
    if(ev.key == "r") object_handler.load_balls_array();
});

// Bind the controls to the controls.js script
window.addEventListener('mousedown', ev=> {
    controls.select_ball(ev.pageX, ev.pageY);
});

window.addEventListener('mouseup', ev => {
    controls.release_ball();
});

document.addEventListener('mousemove', ev => {
    controls.move_mouse(ev.pageX, ev.pageY);
});

window.addEventListener('touchstart', ev => {
    controls.select_ball(ev.changedTouches[0].pageX, ev.changedTouches[0].pageY);
});

window.addEventListener('touchend', ev => {
    controls.release_ball();
});

window.addEventListener('touchmove', ev => {
    controls.move_mouse(ev.changedTouches[0].pageX, ev.changedTouches[0].pageY);
});

window.addEventListener('resize', ev => {
    screen.window_resize();
});

// Open settings menu.
settingsButton.onclick = function() {
    settingsModal.style.display = "block";
    settings.open();
    settings_open = true;
}
  
// Close settings menu.
closeButton.onclick = function() {
    settingsModal.style.display = "none";
    settings.exit();
    settings_open = false;

    // Update all settings when menu is closed.
    object_handler.update_settings();
    screen.update_settings();
    table.update_settings();
    settings.game_mode_changed = false;
}
