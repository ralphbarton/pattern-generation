



import Plot_render from './Plot_render';

import tinycolor from 'tinycolor2';


var Plot_RenderManager = {

    init: function(options){

	options = options || {};

	// Init step 1: Precalculate colours...
	this.load_colours_prelookup();
	console.log(this.colours_prelookup);

	
	// Init step 2: Initialise worker
	if(options.onRenderComplete){
	    const workerURL = process.env.PUBLIC_URL + "/worker/plot_worker_pub.js";
	    this.worker = new Worker(workerURL);
	    this.worker.onmessage = options.onRenderComplete;

	    
	    // Init step 3: pass pre-calc'd colours to worker
	    this.worker.postMessage({
		colours_prelookup: this.colours_prelookup
	    });


	}	
	
    },

    render: function(options){

	// Case 1: pass the rendering work to the worker. (async)
	// when data is all generated, the function 'onRenderComplete()', passed in init, will be called
	if(options.useWorker){

	    this.worker.postMessage({
		width: options.width,
		height: options.height,
		formula: options.formula,
		resolution: options.resolution
	    });



	// Case 2: synchronous calculation.
	// blocks whilst data generated. It is returned by the function
	}else{
	    return Plot_render.GenerateImageData(
		options.formula,
		options.width,
		options.height,
		options.resolution,
		this.colours_prelookup[3]
	    );
	}
	    
    },





    // heat map array: white, cream, scarlet, magenta, deep blue, black
    hmA: ["#FFFFFF", "#FFE480", "#FF4C00", "#C70089", "#270385", "#000000"],
    hmCS: [0.9, 0.7, 0.45, 0.2],
    colouring_func: function(value, scheme){

	//assign "value" to a variable called "r"
	var r = Math.min(1, Math.max(0, value));	

	if(scheme === 0){//rainbow effect, cycle HUE only

	    return tinycolor.fromRatio({ h: r, s: 1, l: 0.5 }).toHexString();


	}else if(scheme === 1){//greyscale effect
	    return tinycolor.fromRatio({ r: r, g: r, b: r}).toHexString();

	}else if(scheme === 2){//posi-negi effect

	    if(r > 0.5){
		return tinycolor.mix('white', '#E05000', 100 * 2 * (r-0.5) );

	    }else{
		return tinycolor.mix('white', '#0092E0', 100 * 2 * (0.5-r) );

	    }


	}else if(scheme === 3){//heatmap effect	    

	    if(r < this.hmCS[3]){
		return tinycolor.mix(this.hmA[5], this.hmA[4], 100 * r / this.hmCS[3] );

	    }else if(r < this.hmCS[2]){
		return tinycolor.mix(this.hmA[4], this.hmA[3], 100 * (r-this.hmCS[3])/(this.hmCS[2]-this.hmCS[3]) );

	    }else if(r < this.hmCS[1]){
		return tinycolor.mix(this.hmA[3], this.hmA[2], 100 * (r-this.hmCS[2])/(this.hmCS[1]-this.hmCS[2]) );

	    }else if(r < this.hmCS[0]){
		return tinycolor.mix(this.hmA[2], this.hmA[1], 100 * (r-this.hmCS[1])/(this.hmCS[0]-this.hmCS[1]) );

	    }else{
		return tinycolor.mix(this.hmA[1], this.hmA[0], 100 * (r-this.hmCS[0])/(1-this.hmCS[0]) );

	    }

	}

    },



    
    colours_prelookup: [],
    load_colours_prelookup: function(){

	var n_schemes = 4;
	var n_points = 501;

	for(var i = 0; i < n_schemes; i++){

	    this.colours_prelookup[i] = [];

	    for(var j=0; j < n_points; j++){

		var real_val = j / (n_points-1);

		this.colours_prelookup[i][j] = this.colouring_func(real_val, i);

	    }

	}

    }

    /*

    HexColour_from_fnValue: function(fn_value, use_0to1_range){

	if(use_0to1_range === true){
	    var r = fn_value;

	}else{
	    var UU = this.wcx.val_upper_saturate_colour;
	    var LL = this.wcx.val_lower_saturate_colour;
	    var r = (fn_value - LL) / (UU - LL);
	}

	r = Math.min(1, Math.max(0, r));//saturate the value at 0 and 1.

	var lkup = parseInt(r*500 + 0.5);
	return this.colours_prelookup[plots.UI_props.prev.colouring][lkup];

    }    

*/

};



export default Plot_RenderManager;
