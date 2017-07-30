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

    var pass = 0;
    
    const JobFunction = function(){

	const winW = msg.data.width;
	const winH = msg.data.height
	const Plot = msg.data.Plot;
	let cell_size = msg.data.resolution;//this.CellSizes[this.wcx.res];

	//logic to return an 'IntermediateRender' at lower detail (faster)
	if(msg.data.intermediateRender && pass === 0){
	    const finRes = msg.data.resolution;
	    if(finRes === 1){cell_size = 3;}
	    else if(finRes === 2){cell_size = 5;}
	    else if(finRes === 3){cell_size = 10;}
	    else if(finRes < 10){cell_size = 15;}
	    else {pass =1;}
	}
	
	const token = msg.data.workerRequestToken;
	const heatmap = msg.data.colouringFunction === 2 ? heatmapLookup : null;

	
	const ImgData = Plot_render.GenerateImageData(Plot, winW, winH, cell_size, heatmap);
	postMessage({
	    ImgData: ImgData,
	    workerRequestToken: token
	});

	const stats_obj = Plot_render.getLastStatistics();
	postMessage({
	    stats_obj: stats_obj,
	    workerRequestToken: token
	});

	// cancellable recursive call for second pass
	if(pass === 0){
	    pass = 1;
	    largeJobTimeoutID = setTimeout(JobFunction, 5);
	}

    };

    largeJobTimeoutID = setTimeout(JobFunction, 5);// 5 milliseconds...

}
