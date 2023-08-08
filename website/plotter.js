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
