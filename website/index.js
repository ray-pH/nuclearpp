import init, { ReactorPWR, ReactorPWRData } from "../pkg/nuclearpp.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const extreactivity_slider = document.getElementById('ext_reactivitySlider');
const button_pause = document.getElementById('pauseButton');
const span_extreactivity = document.getElementById('ext_reactivityValue');
const span_reactiviry = document.getElementById('reactivityValue');
const span_power = document.getElementById('powerValue');
const span_Tfuel = document.getElementById('TfuelValue');

const div_diagram_container = document.getElementById('diagram-container');
const svg_reactor = document.getElementById('reactor-svg');
const svg_rod = document.getElementById('rod-svg');

// create function that given array x and y plot them on canvas
function plot(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    // normalize the value of y to the dimension of the canvas
    // using the maximum value of y
    let ymax = Math.max(...y);
    let y_norm = y.map((v) => v * canvas.height / ymax);
    let x_norm = x.map((v) => v * canvas.width / x[x.length - 1]);
    
    ctx.moveTo(x_norm[0], canvas.height - y_norm[0]);
    for (let i = 1; i < x.length; i++) {
        ctx.lineTo(x_norm[i], canvas.height - y_norm[i]);
    }
    ctx.stroke();
}

let reactor;
let t = [];
let p = [];
let paused = false;

let ext_reactivity = 0;

button_pause.addEventListener('click', () => {
    paused = !paused;
});

function update_diagram(ext_reactivity) {
    // for now hardcode the limit
    const vmin = -1.0;
    const vmax = 1.0;
    const vrange = vmax - vmin;
    let rod_dy = (ext_reactivity - vmin) / vrange * (73-12);
    // move svg_reactor to the center of the container
    let container_width = div_diagram_container.clientWidth;
    let container_height = div_diagram_container.clientHeight;
    let reactor_width = svg_reactor.clientWidth;
    let reactor_height = svg_reactor.clientHeight;
    let reactor_x = (container_width - reactor_width) / 2;
    let reactor_y = (container_height - reactor_height) / 2;
    svg_reactor.style.left = reactor_x + 'px';
    svg_reactor.style.top = reactor_y + 'px';

    let rod_width = svg_rod.clientWidth;
    let rod_height = svg_rod.clientHeight;
    let rod_x = (container_width - rod_width) / 2;
    let rod_y_0 = 73;
    let rod_y = rod_y_0 - rod_dy;
    svg_rod.style.left = (rod_x - 1) + 'px';
    svg_rod.style.top = rod_y + 'px';
}

function update_text(ext_reactivity) {
        // update the text
        //struct ReactorPWRData {
        //     0   : power,
        //     1:6 : precursors,
        //     7   : reactivity,
        //     8   : temp_fuel,
        //     9   : temp_coolant,
        // }
        span_power.innerHTML = reactor.get_datas()[0];
        span_Tfuel.innerHTML = reactor.get_datas()[8];
        span_extreactivity.innerHTML = ext_reactivity;
        span_reactiviry.innerHTML = reactor.get_datas()[7];
}

function loop(){
    if (!paused){
        // update ext_reactivity from slider
        let slider_value = extreactivity_slider.value;
        if (slider_value != ext_reactivity) {
            ext_reactivity = slider_value;
            reactor.set_external_reactivity(ext_reactivity);
        }
        update_diagram(ext_reactivity);
        update_text(ext_reactivity);

        // ---
        t.push(reactor.time);
        p.push(reactor.get_datas()[0]);
        reactor.step_euler();
        plot(t,p);
    }

    requestAnimationFrame(loop);
}

// main
const dt = 1e-3;
const excess_reactivity = 0.0;
const alpha_fuel = 0.0;
const alpha_coolant = 0.0;
const mass_fuel = 1.0e5; // kg
const mass_coolant = 1.0e5; // kg
const heat_capacity_fuel = 3.0e5; // J/kg-C
const heat_capacity_coolant = 4182.0; // J/kg-C
init().then(() => {
    reactor = new ReactorPWR(dt, excess_reactivity, 
        alpha_fuel, alpha_coolant,
        mass_fuel, mass_coolant,
        heat_capacity_fuel, heat_capacity_coolant,
    );
    loop();
});

