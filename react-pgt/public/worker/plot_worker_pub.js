//run math js script first...
importScripts("include/math.min.js");
importScripts("Plot_render_pub.js");


var heatmapLookup = undefined;

var largeJobTimeoutID = undefined;

onmessage = function(msg) {

    const command_info = msg.data

    // in the case where a 'heatmapLookup' property is provided, the purpose of the message is to pass
    // heatmap data into the worker thread. This is part of initialisation, and will be the only purpose
    // of such a message
    if(msg.data.heatmapLookup){
	heatmapLookup = msg.data.heatmapLookup;
	return;
    }

    //clear any previously set job...
    if(largeJobTimeoutID !== undefined){
	clearTimeout(largeJobTimeoutID)
    }

    // now command the latest requested job to happen very shortly
    // the timout provides opportunity for it to be cancelled, if a more up-to-date request exists later in the queue
    largeJobTimeoutID = setTimeout(function(){

	const winW = msg.data.width;
	const winH = msg.data.height
	const formula = msg.data.formula;
	const cell_size = msg.data.resolution;//this.CellSizes[this.wcx.res];
	const token = msg.data.workerRequestToken;
	const heatmap = msg.data.colouringFunction === 2 ? heatmapLookup : null;

	
	const ImgData = Plot_render.GenerateImageData(formula, winW, winH, cell_size, heatmap);
	postMessage({
	    ImgData: ImgData,
	    workerRequestToken: token
	});

	const stats_obj = Plot_render.getLastStatistics();
	postMessage({
	    stats_obj: stats_obj,
	    workerRequestToken: token
	});

    }, 5);// 5 milliseconds...

}
