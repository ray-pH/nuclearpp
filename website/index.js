import init, { ReactorPWR, ReactorPWRData } from "../pkg/nuclearpp.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

// main
init().then(() => {
    let t = [];
    let p = [];
    let pwr = new ReactorPWR(1e-3, -1000);
    for (let i = 0; i < 100; i++) {
        t.push(pwr.time);
        p.push(pwr.get_datas()[0]);
        pwr.step_euler();
    }
    // t = [1,2,3,4,5];
    // p = [4,5,6,3,2];
    console.log(p);
    plot(t,p);
});
