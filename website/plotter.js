/**
 * Plot a data on a canvas.
 *
 * @param {number[]} xdata The x data.
 * @param {number[]} ydata The y data.
 * @param {CanvasRenderingContext2D} ctx The canvas context.
 * @param {HTMLCanvasElement} canvas The canvas.
 */
export function plot(xdata, ydata, ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw axes
    draw_x_axis(xdata, ctx, canvas);
    draw_y_axis(ydata, ctx, canvas);

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    // normalize the value of y to the dimension of the canvas
    // using the maximum value of y
    let ymax = Math.max(...ydata);
    let y_norm = ydata.map((v) => v * canvas.height / ymax);
    let x_norm = xdata.map((v) => v * canvas.width / xdata[xdata.length - 1]);
    
    ctx.moveTo(x_norm[0], canvas.height - y_norm[0]);
    for (let i = 1; i < xdata.length; i++) {
        ctx.lineTo(x_norm[i], canvas.height - y_norm[i]);
    }
    ctx.stroke();
}

/**
 * Draw the x axis.
 * @param {number[]} xdata The x data.
 * @param {CanvasRenderingContext2D} ctx The canvas context.
 * @param {HTMLCanvasElement} canvas The canvas.
 * @param {number} n The number of ticks.
 */
function draw_x_axis(xdata, ctx, canvas){
    const min = xdata[0];
    const max = xdata[xdata.length - 1];
    // figure out how many ticks so that the number looks natural
    let order = Math.floor(Math.log10(max));
    let n_ticks = Math.floor(max / Math.pow(10, order))
    // round the max to the nearest 10^order
    let max_rounded = n_ticks * Math.pow(10, order);
    // function to convert x to pixel
    let x_to_pixel = (x) => x * canvas.width / max;
    // draw the axis
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x_to_pixel(min), canvas.height);
    ctx.lineTo(x_to_pixel(max), canvas.height);
    ctx.stroke();
    // draw the ticks
    ctx.beginPath();
    for (let i = 1; i <= n_ticks; i++){
        let x = i * max_rounded / n_ticks;
        ctx.moveTo(x_to_pixel(x), canvas.height);
        ctx.lineTo(x_to_pixel(x), canvas.height - 10);
    }
    ctx.stroke();
    // put the numbers
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 1; i <= n_ticks; i++){
        let x = i * max_rounded / n_ticks;
        let text = x.toString()
        if (x < 1.0 && x != 0.0){
            text = x.toExponential(0);
        }
        ctx.fillText(text, x_to_pixel(x), canvas.height - 25);
    }
}

/**
 * Draw the y axis.
 * @param {number[]} ydata The y data.
 * @param {CanvasRenderingContext2D} ctx The canvas context.
 * @param {HTMLCanvasElement} canvas The canvas.
 */
function draw_y_axis(ydata, ctx, canvas){
    // const min = Math.min(...ydata);
    const min = 0.0;
    const max = Math.max(...ydata);
    // figure out how many ticks so that the number looks natural
    let order = Math.floor(Math.log10(max));
    let n_ticks = Math.floor(max / Math.pow(10, order))
    // round the max to the nearest 10^order
    let max_rounded = n_ticks * Math.pow(10, order);
    // function to convert y to pixel
    let y_to_pixel = (y) => canvas.height - y * canvas.height / max;
    // draw the axis
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(0, y_to_pixel(min));
    ctx.lineTo(0, y_to_pixel(max));
    ctx.stroke();
    // draw the ticks
    ctx.beginPath();
    for (let i = 1; i <= n_ticks; i++){
        let y = i * max_rounded / n_ticks;
        ctx.moveTo(0, y_to_pixel(y));
        ctx.lineTo(10, y_to_pixel(y));
    }
    ctx.stroke();
    // put the numbers
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= n_ticks; i++){
        let y = i * max_rounded / n_ticks;
        let text = y.toExponential(0);
        ctx.fillText(text, 20, y_to_pixel(y));
    }
}
