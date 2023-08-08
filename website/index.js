import init, { ReactorPWR, ReactorPWRData } from "../pkg/nuclearpp.js";
import { plot } from "./plotter.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const extreactivity_slider = document.getElementById('ext_reactivitySlider');
const button_pause = document.getElementById('pauseButton');
const span_extreactivity = document.getElementById('ext_reactivityValue');
const span_reactiviry = document.getElementById('reactivityValue');
const span_time = document.getElementById('timeValue');
const span_power = document.getElementById('powerValue');
const span_Tfuel = document.getElementById('TfuelValue');

const div_diagram_container = document.getElementById('diagram-container');
const svg_reactor = document.getElementById('reactor-svg');
const svg_rod = document.getElementById('rod-svg');

// create function that given array x and y plot them on canvas
let reactor;
let t = [];
let p = [];
let paused = false;

let ext_reactivity = 0;
let rod_reactivity = 2e-2;

button_pause.addEventListener('click', () => {
    paused = !paused;
});

function update_diagram(rod_percentage) {
    // for now hardcode the limit
    let rod_dy = (rod_percentage) / 100 * (73-12);
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
    let rod_y_0 = 12;
    let rod_y = rod_y_0 + rod_dy;
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
        span_time.innerHTML = reactor.time;
        span_power.innerHTML = reactor.get_datas()[0];
        span_Tfuel.innerHTML = reactor.get_datas()[8];
        span_extreactivity.innerHTML = ext_reactivity;
        span_reactiviry.innerHTML = reactor.get_datas()[7];
}

function loop(){
    if (!paused){
        // update ext_reactivity from slider
        let slider_value = extreactivity_slider.value;
        let slider_reactivity = slider_value / 100 * (-rod_reactivity);
        if (slider_reactivity != ext_reactivity) {
            ext_reactivity = slider_reactivity;
            reactor.set_external_reactivity(ext_reactivity);
        }
        update_diagram(slider_value);
        update_text(ext_reactivity);

        // ---
        t.push(reactor.time);
        p.push(reactor.get_datas()[0]);
        reactor.step_euler_n(10);
        plot(t,p,ctx,canvas);
    }

    requestAnimationFrame(loop);
}

// main
const initial_power = 1.0; // W
const dt = 1e-3;
const excess_reactivity = rod_reactivity/2;
// const alpha_fuel = -1.0e-5; // Δk/k-C
const alpha_fuel = 0.0; // Δk/k-C
const alpha_coolant = 0.0;
const mass_fuel = 1.0e5; // kg
const mass_coolant = 1.0e5; // kg
const heat_capacity_fuel = 3.0e5; // J/kg-C
const heat_capacity_coolant = 4182.0; // J/kg-C
init().then(() => {
    reactor = new ReactorPWR(initial_power, dt, excess_reactivity, 
        alpha_fuel, alpha_coolant,
        mass_fuel, mass_coolant,
        heat_capacity_fuel, heat_capacity_coolant,
    );
    loop();
});

