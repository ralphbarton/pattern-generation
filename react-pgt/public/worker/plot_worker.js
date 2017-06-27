//run math js script first...
importScripts("include/math.min.js");
importScripts("Plot_render.js");


onmessage = function(e) {

    const command_info = e.data

    const winW = command_info.width;
    const winH = command_info.height
    const formula = command_info.formula;
    const cell_size = command_info.resolution;//this.CellSizes[this.wcx.res];

    const rendered_image = Plot_render.GenerateImageData(formula, winW, winH, cell_size);

    console.log(formula, 'has been rendered at', cell_size, 'px');
    postMessage(rendered_image);
}
