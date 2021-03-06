

import Plot_render from './Plot_render';
import tinycolor from 'tinycolor2';

var _ = require('lodash');


/*
 /// intermediate resolution rules...

	    if(finRes === 1){cell_size = 3;}
	    else if(finRes === 2){cell_size = 5;}
	    else if(finRes === 3){cell_size = 10;}
	    else if(finRes < 10){cell_size = 15;}
	    else {pass =1;}

*/



var Plot_RenderManager = {
    
    init: function(options){

	options = options || {};

	// Init step 1: Precalculate colours...
	this.CalculateHeatmapLookup(501)// 501 'posts' for 500 meter fence

	// Init step 2: Initialise worker
	if(options.onRenderComplete){
	    const workerURL = process.env.PUBLIC_URL + "/worker/plot_worker_pub.js";
	    this.worker = new Worker(workerURL);
	    this.worker.onmessage = function(msg){

		if(msg.data.ImageData_grey === undefined){
		    options.onStatsComplete(msg.data);
		}else{
		    options.onRenderComplete(msg.data);
		}		
	    };

	    // Init step 3: pass pre-calc'd colours to worker
	    this.worker.postMessage({
		heatmapLookup: Plot_RenderManager.heatmapLookup
	    });


	}	
	
    },

    render: function(options){

	// Case 1: pass the rendering work to the worker. (async)
	// When the rendering is complete, first the function 'onRenderComplete()' (passed in init) will be called.
	// Then when stats have also been calculated by the worder, 'onStatsComplete()' will be subsequently called
	if(options.useWorker){

	    this.worker.postMessage(options);

	// Case 2: synchronous calculation.
	// blocks whilst data generated. It is returned by the function
	}else{
	    return Plot_render.GenerateImageData(
		options.Plot,
		options.width,
		options.height,
		options.resolution,
		options.colouringFunction === 2 ? this.heatmapLookup : null
	    );
	}
	    
    },


    
    heatmapLookup: undefined,
    CalculateHeatmapLookup: function(n_points){

	// "heatmap" colouring function: white, cream, scarlet, magenta, deep blue, black
	const cSeries = ["#FFFFFF", "#FFE480", "#FF4C00", "#C70089", "#270385", "#000000"];
	const cSpac = [0.9, 0.7, 0.45, 0.2];// "Colour Spacings" - spacing locations of colours on scale....

	this.heatmapLookup = _.times(n_points, function(index){
	    const r = index / (n_points-1);

	    //this could be done in a single more general LOC
	    if(r < cSpac[3]){
		return tinycolor.mix(cSeries[5], cSeries[4], 100 * r / cSpac[3] ).toRgb();

	    }else if(r < cSpac[2]){
		return tinycolor.mix(cSeries[4], cSeries[3], 100 * (r-cSpac[3])/(cSpac[2]-cSpac[3]) ).toRgb();

	    }else if(r < cSpac[1]){
		return tinycolor.mix(cSeries[3], cSeries[2], 100 * (r-cSpac[2])/(cSpac[1]-cSpac[2]) ).toRgb();

	    }else if(r < cSpac[0]){
		return tinycolor.mix(cSeries[2], cSeries[1], 100 * (r-cSpac[1])/(cSpac[0]-cSpac[1]) ).toRgb();

	    }else{
		return tinycolor.mix(cSeries[1], cSeries[0], 100 * (r-cSpac[0])/(1-cSpac[0]) ).toRgb();

	    }


	});

    }
    
};



export default Plot_RenderManager;
