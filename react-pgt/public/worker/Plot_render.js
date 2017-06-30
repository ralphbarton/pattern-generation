//import math from 'mathjs';

var Plot_render = {

    FillRectangle_ImgData: function (ImgData, x, y, w, h, raw){

	// 1. Determine RGB values for rectangle colour
	// scale raw of [-3, +3] to range[0, 255]
	const val = (raw+3)*(255/6);

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

		pixelData[i_base    ] = val; // red
		pixelData[i_base + 1] = val; // green
		pixelData[i_base + 2] = val; // blue
		pixelData[i_base + 3] = 255; // fully opaque	    
	    }
	}
    },


    GenerateImageData: function(formula, winW, winH, cell_size){
	//this is where I calculate all the set-up variables, the work-context variables of before...

	// note that this test for string contains 'z' is different to the test used elsewhere...
	const isComplex = formula.includes("z");
	const compilled_formula = math.compile(formula);
	
	
	//set up the rendering of 1 canvas at this resolution...

	const interval_size = 2 * (cell_size / winW);// in units of [-1, +1] for function, i.e. dimentionaless input steps
	const r_aspect = winH / winW;

	const n_steps_x = Math.ceil((1 / interval_size) - 0.5)*2 + 1;
	const n_steps_y = Math.ceil((r_aspect / interval_size) - 0.5)*2 + 1;
	const n_steps_xH = Math.floor(n_steps_x / 2)// number of steps wholely contained in x<0 half
	const n_steps_yH = Math.floor(n_steps_y / 2)// number of steps wholely contained in y<0 half

	const myImg = new ImageData(winW, winH);
	
	// these nested loops are per-point (which may be a large cell), not per-pixel

	for(var x = 0; x < n_steps_x; x++){
	    for(var y = 0; y < n_steps_y; y++){
		
		/*
		// Shorthand....
		var samples = this.wcx.samples_sets[this.wcx.res];
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
		const my_h = isComplex ? my_fz.re : my_fz;

		/*
		// 2.store calculated value....
		samples.push(my_h);
		*/

		
		/*
		// 3. Draw onto canvas
		// 3.1 Set colour according to conversion function.
		this.wcx.canvas_ctx.fillStyle = this.HexColour_from_fnValue(my_h);
		*/
		
		// 3.2 determine draw location
		const x_location_px = Math.round((winW / 2) + (x - n_steps_xH - 0.5) * cell_size);
		const y_location_px = Math.round((winH / 2) + (y - n_steps_yH - 0.5) * cell_size);

		this.FillRectangle_ImgData(myImg, x_location_px, y_location_px, cell_size, cell_size, my_h);
		
	    }
	}
	
	return myImg;
    }
    
}

//export default Plot_render2;
