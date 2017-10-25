//run math js script first...
importScripts("include/math.min.js");
importScripts("Plot_render_pub.js");


var heatmapLookup = undefined;
var renderJobTimeoutID = undefined;

onmessage = function(msg) {

    // in the case where a 'heatmapLookup' property is provided, the purpose of the message is to pass
    // heatmap data into the worker thread. This is part of initialisation, and will be the only purpose
    // of such a message
    if(msg.data.heatmapLookup){
	heatmapLookup = msg.data.heatmapLookup;
	return;
    }

    //clear any previously set job...
    if(renderJobTimeoutID !== undefined){
	clearTimeout(renderJobTimeoutID)
    }

    // now command the latest requested job to happen very shortly
    // the timout provides opportunity for it to be cancelled, if a more up-to-date request exists later in the queue

    
    largeJobTimeoutID = setTimeout(function(){

	const winW = msg.data.width;
	const winH = msg.data.height
	const Plot = msg.data.Plot;
	const cell_size = msg.data.resolution;//this.CellSizes[this.wcx.res];
	
	const token = msg.data.workerRequestToken;
	const heatmap = msg.data.colouringFunction === 2 ? heatmapLookup : null;

	const RenderResult = Plot_render.GenerateImageData(Plot, winW, winH, cell_size, heatmap);
	postMessage({
	    ImageData_grey: RenderResult.ImageData_grey,
	    ImageData_heatmap: RenderResult.ImageData_heatmap,
	    RenderScale: RenderResult.RenderScale, // this obj holds the numeric values for black, white
	    workerRequestToken: token
	});

	const stats_obj = Plot_render.getLastStatistics();
	postMessage({
	    stats_obj: stats_obj,
	    workerRequestToken: token
	});

    }, 5);// 5 milliseconds...

}
