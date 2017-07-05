import math from 'mathjs';

var Plot_render = {

    FillRectangle_ImgData: function (ImgData, x, y, w, h, rgbaArr){

	
	// 2. Dimention checks / cropping
	// Measures to ensure rectangle fully contained within canvas dimentions...
	if(x < 0){
	    if(x+w < 0){return;} // totally outside
	    const diff = -x;
	    x = 0;
	    w -= diff;
	}
	if(x+w > ImgData.width){
	    if(x > ImgData.width){return;} // totally outside
	    const diff = x+w - ImgData.width;
	    w -= diff;
	}

	if(y < 0){
	    if(y+h < 0){return;} // totally outside
	    const diff = -y;
	    y = 0;
	    h -= diff;
	}
	if(y+h > ImgData.height){
	    if(y > ImgData.height){return;} // totally outside
	    const diff = y+h - ImgData.height;
	    h -= diff;
	}
	

	// 3. write all those pixels into that "Uint8ClampedArray" passed by reference.
	// xr - 'x' coordinate relative to rectangle 'origin'
	// xa - 'x' absolute coordinate (relative to canvas origin)
	const pixelData = ImgData.data;
	
	for(var yr = 0; yr < w; yr++){
	    const ya = y + yr;
	    const y_base = ya*ImgData.width;

	    for(var xr = 0; xr < w; xr++){
		const xa = x + xr;	
		const i_base = (y_base + xa) * 4;

		pixelData[i_base    ] = rgbaArr[0]; // red
		pixelData[i_base + 1] = rgbaArr[1]; // green
		pixelData[i_base + 2] = rgbaArr[2]; // blue
		pixelData[i_base + 3] = rgbaArr[3]; // fully opaque	    
	    }
	}
    },


    SamplePlaneForImage: function(formula, imageW, imageH, cell_size, per_sample_cb){

	//this is where I calculate all the set-up variables, the work-context variables of before...

	// note that this test for string contains 'z' is different to the test used elsewhere...
	const isComplex = formula.includes("z");
	const compilled_formula = math.compile(formula);
	
	
	//set up the rendering of 1 canvas at this resolution...

	const interval_size = 2 * (cell_size / imageW);// in units of [-1, +1] for function, i.e. dimentionaless input steps
	const r_aspect = imageH / imageW;

	const n_steps_x = Math.ceil((1 / interval_size) - 0.5)*2 + 1;
	const n_steps_y = Math.ceil((r_aspect / interval_size) - 0.5)*2 + 1;
	const n_steps_xH = Math.floor(n_steps_x / 2)// number of steps wholely contained in x<0 half
	const n_steps_yH = Math.floor(n_steps_y / 2)// number of steps wholely contained in y<0 half

	// these nested loops are per-point (which may be a large cell), not per-pixel
	for(var x = 0; x < n_steps_x; x++){
	    for(var y = 0; y < n_steps_y; y++){
		
		/*
		// Shorthand....
		var Samples = this.wcx.samples_sets[this.wcx.res];
		var random_x = this.wcx.x_randomise[this.wcx.x].i; // this is an ACCESS operation on an array of randomised

		this code is for pixel-column randomising and samples for histogram, both not (yet) included.
		*/

		// 1. calculating the sample (_Lc is abbreviation for 'location')
		const x_Lc = (x - n_steps_xH) * interval_size;
		const y_Lc = (y - n_steps_yH) * interval_size;

		//this 2D variable may be a cartesian coordinate or a complex value
		const indep_variable = isComplex ? {z: math.complex(x_Lc, y_Lc)} : {x: x_Lc, y: y_Lc};

		/////MATHS EVALUATION AT POINT
		const my_fz = compilled_formula.eval(indep_variable);
		const sample = isComplex ? my_fz.re : my_fz;

		per_sample_cb(sample, x, n_steps_xH, y, n_steps_yH);
	    }
	}

	
    },
    

    fullSamples: undefined,
    GenerateImageData: function(formula, imageW, imageH, cell_size, heatmap_lookup){

	const myImg = new ImageData(imageW, imageH);



	// this code here is a quick and crude way to determine the scaling, for colouring.
	/* Hitting the precise 10% and 90% points is not very important. For now this is quicker than a more thorough
	   approach of collecting all the samples, analysing them, and then colouring based on this analysis.
	   The more thorough approach is obviously logical.
	   

	*/

	// 1. get a relatively small number of samples
	const sampling_cell = Math.max(imageW / 50, 2);
	var Samples = [];
	this.SamplePlaneForImage(formula, imageW, imageH, sampling_cell, function(sample, x, n_steps_xH, y, n_steps_yH){
	    Samples.push(sample);
	});


	// 2. sort this list
	function compare(a, b) {
	    if (a < b) return -1;
	    if (a > b) return 1;
	    return 0;
	}
	Samples.sort(compare);

	// 3. get the 10% and 90% points...
	var L = Samples.length;
	var num_grab = function(ind_real){
	    var i = parseInt(ind_real);
	    return Samples[i];
	};
	const val_saturateLo =  num_grab(L * 0.1);
	const val_saturateHi = num_grab(L * 0.9);
	const val_deltaLoHi = val_saturateHi - val_saturateLo;

	this.fullSamples = []; // wipe any old data
	this.SamplePlaneForImage(formula, imageW, imageH, cell_size, function(sample, x, n_steps_xH, y, n_steps_yH){

	    // 3.2 determine draw location
	    const x_location_px = Math.round((imageW / 2) + (x - n_steps_xH - 0.5) * cell_size);
	    const y_location_px = Math.round((imageH / 2) + (y - n_steps_yH - 0.5) * cell_size);

	    // 1. Determine RGB values for rectangle colour

	    // first rescale into a [0, 1] range, using the 10% and 90% values as limits and saturating outside this
	    const Ru = (sample - val_saturateLo) / val_deltaLoHi;
	    const R = Math.max(Math.min(Ru, 1), 0);
	    
	    const tiny = heatmap_lookup[Math.floor(500 * R)];
	    var col = [tiny._r, tiny._g, tiny._b, 255];
	    
	    Plot_render.FillRectangle_ImgData(myImg, x_location_px, y_location_px, cell_size, cell_size, col);

	    Plot_render.fullSamples.push(sample);
	    
	});
		
	
	return myImg;
    },


    getLastStatistics: function(){

	function compare(a, b) {
	    if (a < b) return -1;
	    if (a > b) return 1;
	    return 0;
	}

	this.fullSamples.sort(compare);


	var grab = function(ind_real){
	    var i = parseInt(ind_real);
	    return this.fullSamples[i].toFixed(2);
	};

	var L = this.fullSamples.length;

	return {
	    n_points: L,
	    v_min: grab(0),
	    v_max: grab(L-1),
	    v10pc: grab(L*0.1),
	    v90pc: grab(L*0.9),
	    median: grab(L*0.5)
	};

    }
    
}


export default Plot_render;
