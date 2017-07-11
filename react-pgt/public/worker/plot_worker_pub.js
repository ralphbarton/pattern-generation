//run math js script first...
importScripts("include/math.min.js");
importScripts("Plot_render_pub.js");


var heatmapLookup = undefined;

onmessage = function(msg) {

    const command_info = msg.data

    if(msg.data.heatmapLookup){
	heatmapLookup = msg.data.heatmapLookup;
	return;
    }
    
    const winW = msg.data.width;
    const winH = msg.data.height
    const formula = msg.data.formula;
    const cell_size = msg.data.resolution;//this.CellSizes[this.wcx.res];
    const heatmap = msg.data.colouringFunction === 2 ? heatmapLookup : null;
    
    const rendered_image = Plot_render.GenerateImageData(formula, winW, winH, cell_size, heatmap);
    postMessage(rendered_image);

    const stats = Plot_render.getLastStatistics();
    postMessage(stats);
}
