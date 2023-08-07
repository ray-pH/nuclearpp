import init, { ReactorPWR, ReactorPWRData } from "../pkg/nuclearpp.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const extreactivity_slider = document.getElementById('ext_reactivitySlider');
const span_extreactivity = document.getElementById('ext_reactivityValue');
const span_reactiviry = document.getElementById('reactivityValue');
const span_power = document.getElementById('powerValue');
const span_Tfuel = document.getElementById('TfuelValue');

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

let ext_reactivity = 0;

let frame = 0;
function loop(){
    // update ext_reactivity from slider
    let slider_value = extreactivity_slider.value;
    if (slider_value != ext_reactivity) {
        ext_reactivity = slider_value;
        reactor.set_external_reactivity(ext_reactivity);
    }
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

    // ---
    t.push(reactor.time);
    p.push(reactor.get_datas()[0]);
    reactor.step_euler();
    plot(t,p);

    frame += 1;
    if (frame > 1000) {
    // if (false) {
        console.log(p);
    } else {
        requestAnimationFrame(loop);
    }
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

