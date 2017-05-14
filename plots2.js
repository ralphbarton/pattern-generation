var plots2 = {

    CellSizes: [81, 27, 9, 3, 1],

    //context information for a broken up piece of (plotting) Work
    wcx: {
	compilled_formula: undefined,
	isComplex: undefined,
	canvas_ctx: undefined,
	samples_sets: [],
	winW: undefined,
	winH: undefined,
	cell_size: undefined,
	interval_size: undefined,
	r_aspect: undefined,	
	n_steps_x: undefined,
	n_steps_y: undefined,
	n_steps_xH: undefined,
	n_steps_yH: undefined,
	x_randomise: undefined,
	y: undefined,
	x: undefined,
	res: undefined,
	res_lim: undefined,
	recursive_timeoutID: null,
	start_time: undefined,
	res_start_time: undefined,
	iterations_expected: 0,
	iterations_counted: 0,
	val_upper_saturate_colour: 2,
	val_lower_saturate_colour: -2
    },


    draw_job: function(plot_uid, options){

	// Cancel any pre-existing draw job
	if(this.wcx.recursive_timeoutID != null){
	    clearTimeout(this.wcx.recursive_timeoutID);
	}else{
	    $("#Tab-plot #z-5 #plot-status div").hide();
	    $("#Tab-plot #z-5 #working").show();
	}

	this.wcx.start_time = new Date();

	// remove all displaying "Rendered Pointset" points
	density_util.Draw_many_using_CDF(0, {clearAllExisting: true, dotAsMotif: true});
	
	var Plot_i = DM.plotArray[plots.selected_row_i];
	if(plot_uid !== undefined){
	    Plot_i = DM.GetByKey_( DM.plotArray, "uid", plot_uid)
	}else{
	    //this needs to be set...
	    plot_uid = Plot_i.uid;
	}
	options = options || {visible: true};//by default, make the current one visible...

	this.wcx.compilled_formula = math.compile(Plot_i.formula);
	// note that this test for string contains 'z' is different to the test used elsewhere...
	this.wcx.isComplex = Plot_i.formula.includes("z");
	
	//assume 1 otherwise
	this.wcx.res_lim = parseInt($("#Tab-plot #z-5 #res-lim input").val()) || 1;

	this.wcx.winW = $(window).width();
	this.wcx.winH = $(window).height();

	
	// Add a new canvas for the required plot into the dom, if it does not already exist
	var pID = "plot-" + plot_uid;
	var $c = $("body > #backgrounds canvas#" + pID)
	if( $c.length > 0 ){
	    // if so, just update its dimentions
	    $c.attr("width", this.wcx.winW)
		.attr("height", this.wcx.winH);
	}else{
	    // otherwise, create it and append to backgounds...
	    $c = $('<canvas/>')
		.attr("width", this.wcx.winW)
		.attr("height", this.wcx.winH)
		.addClass("plot")
		.attr("id", pID);
	    $("#backgrounds").append( $c );
	}

	// make all plot canvases hidden, except maybe the current one...
	$("body > #backgrounds canvas.plot").hide();
	if(options.visible){
	    $("body > #backgrounds canvas#" + pID).show();
	}
	
	this.wcx.canvas_ctx = $c[0].getContext('2d');


	//function calls
	this.wcx.iterations_counted = 0;
	this.wcx.iterations_expected = this.calc_total_iterations();//call after grabbing canvas

	this.set_for_res(0);

	// 10000 iterations seems to take around 100ms on my laptop => around 50% duty
	this.recursive_work_step(200, 200);//start the chain Work=200, rest=100
    },


    abort_recursive_work: function(){

	clearTimeout(this.wcx.recursive_timeoutID);
	this.wcx.recursive_timeoutID = null;	

	$("#Tab-plot #z-5 #plot-status div").hide();
	$("#Tab-plot #z-5 #aborted").show();


    },


    calc_total_iterations: function(){
	var total_Its = 0;
	for(var i = 0; this.CellSizes[i] >= this.wcx.res_lim; i++){
	    //call the side effect fn
	    this.set_for_res(i, true);
	    total_Its += this.wcx.n_steps_xH * this.wcx.n_steps_yH * 4;
	}
	return total_Its;
    },

    set_for_res: function(res, dummy){


	this.wcx.res = res;
	this.wcx.res_start_time = new Date();	
	this.wcx.x = 0;
	this.wcx.y = 0;

	this.wcx.cell_size = this.CellSizes[this.wcx.res];
	this.wcx.interval_size = 2 * (this.wcx.cell_size/this.wcx.winW);// in units of [-1, +1] for function
	this.wcx.r_aspect = this.wcx.winH / this.wcx.winW;

	this.wcx.n_steps_x = Math.ceil((1 / this.wcx.interval_size) - 0.5)*2 + 1;
	this.wcx.n_steps_y = Math.ceil((this.wcx.r_aspect / this.wcx.interval_size) - 0.5)*2 + 1;
	this.wcx.n_steps_xH = Math.floor(this.wcx.n_steps_x/2)// number of steps wholely contained in x<0 half
	this.wcx.n_steps_yH = Math.floor(this.wcx.n_steps_y/2)// number of steps wholely contained in x<0 half

	if(dummy !== true){
	    //logic here to manage random column order feature
	    this.wcx.x_randomise = [];

	    for(var i = 0; i < this.wcx.n_steps_x; i++){
		this.wcx.x_randomise.push({
		    i: i,
		    marker: Math.random()
		});
	    }

	    function compare(a,b) {
		if (a.marker < b.marker)
		    return -1;
		if (a.marker > b.marker)
		    return 1;
		return 0;
	    }

	    this.wcx.x_randomise.sort(compare);

	    $("#Tab-plot #z-5 #working #res-cur").text(this.wcx.cell_size);
	}
    },



    av_step_time: [1/100],// as a starting value, assume a single iteration takes 0.01ms

    recursive_work_step: function(work_duration_targ, free_duration){

	var sum = this.av_step_time.reduce(function(a, b) { return a + b; });
	var avg = sum / this.av_step_time.length; // the average durations of recent work chunks
	var iterations = work_duration_targ / avg;
	var t_sta = new Date();

	//Perform actual work via the "EXECUTE ITERATIONS" function.
	var Response = this.execute_iterations(iterations);	    
	
	if(!Response.complete){// INCOMPLETE

	    // SET UP THE TIMEOUT-BASED RECURSIVE CALL HERE...
	    this.wcx.recursive_timeoutID = setTimeout(function(){
		plots2.recursive_work_step(work_duration_targ, free_duration);
	    }, free_duration);

	    // 1. displaying PERCENT complete of draw-job, based upon counting iterations
	    this.wcx.iterations_counted += Response.iterations_run;
	    var pc_raw = 100 * this.wcx.iterations_counted / this.wcx.iterations_expected
	    $("#Tab-plot #z-5 #working #pc-compl").text(pc_raw.toFixed(1));

	    // 2. RECORD the average time per iteration, for use in calculating future quantities of iterations.
	    var dur = (new Date() - t_sta);
	    //add the new time and pop the old one
	    this.av_step_time.push(dur / Response.iterations_run);
	    if(this.av_step_time.length > 4){
		this.av_step_time.splice(0,1);
	    }


	}else{// COMPLETE
	    $("#Tab-plot #z-5 #plot-status div").hide();
	    $("#Tab-plot #z-5 #complete").show();

	    var t_now = new Date();
	    var t_overall = t_now - this.wcx.start_time;
	    var t_final = t_now - this.wcx.res_start_time;
	    $("#Tab-plot #z-5 #complete #t-overall").text((t_overall/1000).toFixed(1));
	    $("#Tab-plot #z-5 #complete #t-final").text((t_final/1000).toFixed(1));

	    this.wcx.recursive_timeoutID = null;
	}
    },


    // CARRY OUT the work for fixed number of iterations.
    execute_iterations: function(iterations){

	for(var i = 0; i<iterations; i++){

	    //set to a blank array (may be scrapping old data, or first assignment).
	    if((this.wcx.x == 0)&&(this.wcx.y == 0)){
		this.wcx.samples_sets[this.wcx.res] = [];
	    }

	    // Shorthand....
	    var samples = this.wcx.samples_sets[this.wcx.res];
	    var random_x = this.wcx.x_randomise[this.wcx.x].i; // this is an ACCESS operation on an array of randomised


	    // 1. calculating the sample (_Lc is abbreviation for 'location')
	    var x_Lc = (random_x - this.wcx.n_steps_xH) * this.wcx.interval_size;
	    var y_Lc = (this.wcx.y - this.wcx.n_steps_yH) * this.wcx.interval_size;

	    //this 2D variable may be a cartesian coordinate or a complex value
	    var indep_variable = this.wcx.isComplex ? {z: math.complex(x_Lc, y_Lc)} : {x: x_Lc, y: y_Lc};
	    var my_fz = this.wcx.compilled_formula.eval(indep_variable);/////MATHS EVALUATION AT POINT
	    var my_h = this.wcx.isComplex ? my_fz.re : my_fz;

	    // 2.store calculated value....
	    samples.push(my_h);

	    // 3. Draw onto canvas
	    // 3.1 Set colour according to conversion function.
	    this.wcx.canvas_ctx.fillStyle = this.HexColour_from_fnValue(my_h);

	    // 3.2 determine draw location
	    var x_location_px = Math.round((this.wcx.winW/2) + (random_x - this.wcx.n_steps_xH - 0.5)*this.wcx.cell_size);
	    var y_location_px = Math.round((this.wcx.winH/2) + (this.wcx.y - this.wcx.n_steps_yH - 0.5)*this.wcx.cell_size);
	    this.wcx.canvas_ctx.fillRect (x_location_px, y_location_px, this.wcx.cell_size, this.wcx.cell_size);//x,y,w,h
	    this.wcx.y++;
	    

	    // Iteration control, for state variables...
	    if (this.wcx.y >= this.wcx.n_steps_y){//test if column finished
		this.wcx.y=0;
		this.wcx.x++;

		//Case: whole screen finished....
		if (this.wcx.x >= this.wcx.n_steps_x){
		    this.wcx.x = 0;
		    this.wcx.res++;

		    // now we have a complete point-set, draw histogram.
		    plots.histogram_stats(samples);

		    // (A) Test if completely finished drawing at the finest resolution
		    var job_done = (this.wcx.res >= this.CellSizes.length) || (this.CellSizes[this.wcx.res] < this.wcx.res_lim);

		    //recalculate a bunch of resolution stuff
		    // (B) about to redraw it all at a finer resolution
		    if(!job_done){
			this.set_for_res(this.wcx.res);
		    }

		    //whether completely finished, or just finished at a particular res, terminate / pause for a breath here.
		    return {complete: job_done, iterations_run: i}; // return ACTUAL number of iterations.

		}		    
	    }
	}
	
	//designated number of iterations ran, and work is ongoing.
	return {complete: false, iterations_run: iterations};
    },


    // heat map array: white, cream, scarlet, magenta, deep blue, black
    hmA: ["#FFFFFF", "#FFE480", "#FF4C00", "#C70089", "#270385", "#000000"],
    hmCS: [0.9, 0.7, 0.45, 0.2],
    colouring_func: function(value, scheme){

	//assign "value" to a variable called "r"
	r = Math.min(1, Math.max(0, value));	

	if(scheme == 0){//rainbow effect, cycle HUE only

	    return tinycolor.fromRatio({ h: r, s: 1, l: 0.5 }).toHexString();


	}else if(scheme == 1){//greyscale effect
	    return tinycolor.fromRatio({ r: r, g: r, b: r}).toHexString();

	}else if(scheme == 2){//posi-negi effect

	    if(r > 0.5){
		return tinycolor.mix('white', '#E05000', amount = 100 * 2 * (r-0.5) );

	    }else{
		return tinycolor.mix('white', '#0092E0', amount = 100 * 2 * (0.5-r) );

	    }


	}else if(scheme == 3){//heatmap effect	    

	    if(r < this.hmCS[3]){
		return tinycolor.mix(this.hmA[5], this.hmA[4], amount = 100 * r / this.hmCS[3] );

	    }else if(r < this.hmCS[2]){
		return tinycolor.mix(this.hmA[4], this.hmA[3], amount = 100 * (r-this.hmCS[3])/(this.hmCS[2]-this.hmCS[3]) );

	    }else if(r < this.hmCS[1]){
		return tinycolor.mix(this.hmA[3], this.hmA[2], amount = 100 * (r-this.hmCS[2])/(this.hmCS[1]-this.hmCS[2]) );

	    }else if(r < this.hmCS[0]){
		return tinycolor.mix(this.hmA[2], this.hmA[1], amount = 100 * (r-this.hmCS[1])/(this.hmCS[0]-this.hmCS[1]) );

	    }else{
		return tinycolor.mix(this.hmA[1], this.hmA[0], amount = 100 * (r-this.hmCS[0])/(1-this.hmCS[0]) );

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

    },

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

};
