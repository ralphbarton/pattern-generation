var Plot_render = {

    // This function draws a filled rectangle (a 'cell') onto the ImgData for a canvas.
    // the nested loops are simply to draw all pixels of that rectangle (may be one pixel)
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
	
	for(var yr = 0; yr < h; yr++){////////a BUG I think - this should be an 'h' but there is a 'w'
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


    SamplePlaneForImage: function(Plot, imageW, imageH, cell_size, per_sample_cb){

	//this is where I calculate all the set-up variables, the work-context variables of before...

	// note that this test for string contains 'z' is different to the test used elsewhere...
	const isComplex = Plot.formula.includes("z");

	let compilled_formula = null;

	// attempt to compile the formula. This will catch syntax errors
	try{
	    compilled_formula = math.compile(Plot.formula);
	}
	catch (e){
	    //all data points will be set to zero.
	    compilled_formula = null;
	}

	// try an evaluation of the formula. This will catch valid syntax with undefined symbols
	try{
	    const indep_variable = isComplex ? {z: math.complex(0, 0)} : {x: 0, y: 0};
	    if(compilled_formula !== null){ compilled_formula.eval(indep_variable); }
	}
	catch (e){
	    compilled_formula = null;// (manages an unusable formula)
	}

	
	if(compilled_formula === null){return;}
	
	
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
		const y_Lc = -(y - n_steps_yH) * interval_size;//y direction flipped in canvas vs. pure-math coord system 

		// 2. apply a transform
		const x_LcT = (x_Lc * Plot.section.xZoom) + Plot.section.xOffset;
		const y_LcT = (y_Lc * Plot.section.yZoom) + Plot.section.yOffset;

		
		//this 2D variable may be a cartesian coordinate or a complex value
		const indep_variable = isComplex ? {z: math.complex(x_LcT, y_LcT)} : {x: x_LcT, y: y_LcT};

		/////MATHS EVALUATION AT POINT
		const my_fz =  compilled_formula.eval(indep_variable);
		const sample = isComplex ? my_fz.re : my_fz;

		// This function is responsible for determining canvas draw location, cell colour
		// and then writing to a ImgData store as the bitmap is built up.
		per_sample_cb(sample, x, n_steps_xH, y, n_steps_yH);
	    }
	}

	
    },
    

    num_grab: function(Samples, ind_real){
	const i = parseInt(ind_real, 10);//radix parameter 10 means base-10
	return Samples[i];
    },

    
    dataGen: {},
    GenerateImageData: function(Plot, imageW, imageH, cell_size, heatmapLookup){

	const ImageData_grey = new ImageData(imageW, imageH);
	const ImageData_heatmap = new ImageData(imageW, imageH);



	// this code here is a quick and crude way to determine the scaling, for colouring.
	/* Hitting the precise 10% and 90% points is not very important. For now this is quicker than a more thorough
	   approach of collecting all the samples, analysing them, and then colouring based on this analysis.
	   The more thorough approach is obviously logical.
	   

	*/

	// 1. get a relatively small number of samples
	const sampling_cell = Math.max(imageW / 50, 2);
	var Samples = [];
	this.SamplePlaneForImage(Plot, imageW, imageH, sampling_cell, function(sample, x, n_steps_xH, y, n_steps_yH){
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

	this.dataGen = {
	    samples: [],
	    val_saturateLo: Plot.autoScale === false ? Plot.lastRenderScale.Lo : this.num_grab(Samples, L * 0.1),
	    val_saturateHi: Plot.autoScale === false ? Plot.lastRenderScale.Hi : this.num_grab(Samples, L * 0.9),
	    heatmapLookup: heatmapLookup // this may be undefined or an array, depending upon colouring function set...
	};

	const dataGen = this.dataGen;
	const val_deltaLoHi = dataGen.val_saturateHi - dataGen.val_saturateLo;
	
	this.dataGen.samples = []; // wipe any old data
	this.SamplePlaneForImage(Plot, imageW, imageH, cell_size, function(sample, x, n_steps_xH, y, n_steps_yH){

	    // 3.2 determine draw location
	    const x_location_px = Math.round((imageW / 2) + (x - n_steps_xH - 0.5) * cell_size);
	    const y_location_px = Math.round((imageH / 2) + (y - n_steps_yH - 0.5) * cell_size);

	    // 1. Determine RGB values for rectangle colour

	    // first rescale into a [0, 1] range, using the 10% and 90% values as limits and saturating outside this
	    const Ru = (sample - dataGen.val_saturateLo) / val_deltaLoHi;
	    const R = Math.max(Math.min(Ru, 1), 0);

	    // 2a. conditionally generate a heatmap image
	    if(heatmapLookup){
		const colObj = heatmapLookup[Math.floor(500 * R)];
		const col1 = [colObj.r, colObj.g, colObj.b, 255];
		Plot_render.FillRectangle_ImgData(ImageData_heatmap, x_location_px, y_location_px, cell_size, cell_size, col1);
	    }

	    // 2b. unconditionally generate a greyscale image
	    const r = 255*R;
	    const col = [r, r, r, 255];		
	    Plot_render.FillRectangle_ImgData(ImageData_grey, x_location_px, y_location_px, cell_size, cell_size, col);

	    dataGen.samples.push(sample);
	    
	});
		
	return {
	    ImageData_grey: ImageData_grey,
	    ImageData_heatmap: (heatmapLookup ? ImageData_heatmap : null),
	    RenderScale: {
		val_saturateHi: dataGen.val_saturateHi,
		val_saturateLo: dataGen.val_saturateLo
	    }
	};
    },


    // this returns data from the member variable 'this.dataGen.samples', which is set with every 'GenerateImageData'
    // for full-screen rendering, on a hi-res screen, this can take up to 770ms (of 2.8s to calc all the points)
    getLastStatistics: function(){

	function compare(a, b) {
	    if (a < b) return -1;
	    if (a > b) return 1;
	    return 0;
	}

	if(this.dataGen.samples.length < 1){
	    return {
		n_points: 0,
		v_min: "n/a",
		v_max: "n/a",
		v10pc: "n/a",
		v90pc: "n/a",
		median: "n/a"
	    };
	}
	
	const Samp = this.dataGen.samples.sort(compare);
	var L = Samp.length;

	//turn the sorted array of values into a set of bins
	var n_bars = 16;
	var V_min = this.dataGen.val_saturateLo;//I will want these to be dynamic...
	var V_max = this.dataGen.val_saturateHi;
	var value_step = (V_max - V_min) / n_bars;
	
	var bar_heights = [0];
	var bar_counter = 0;
	var max_bar_height = 0;

	for(var i = 0; i < L; i++){
	    bar_heights[bar_counter]++;
	    max_bar_height = Math.max(bar_heights[bar_counter], max_bar_height);

	    //you'd have thought this wouldn't be necessary, but a superflous bin can be created otherwise	    
	    while((bar_counter < (n_bars-1)) && (Samp[i] > V_min+((bar_counter+1)*value_step))){
		bar_counter++;
		bar_heights.push(0);
	    }
	}

	// Array of values between 0 and 1.
	const scaled_bars = bar_heights.map( x => {return x/max_bar_height;});

	//create the bar colours Array (it is re-generated every time).
	const dataGen = this.dataGen;
	const bar_colours = Array(n_bars).fill(null).map((el, i)=>{
	    const R = i / (n_bars-1);
	    if(dataGen.heatmapLookup){
		const colObj = dataGen.heatmapLookup[Math.floor(500 * R)];
		return "rgb("+colObj.r+", "+colObj.g+", "+colObj.b+")";
	    }
	    const r = Math.round(255*R);
	    return "rgb("+r+", "+r+", "+r+")";
	});
	
	return {
	    n_points: L,
	    v_min: this.num_grab(Samp, 0),
	    v_max: this.num_grab(Samp, L-1),
	    v10pc: this.num_grab(Samp, L*0.1),
	    v90pc: this.num_grab(Samp, L*0.9),
	    median: this.num_grab(Samp, L*0.5),
	    bar_heights: scaled_bars,
	    bar_colours: bar_colours
	};

    }
    
}
