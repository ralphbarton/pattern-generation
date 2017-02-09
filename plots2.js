var plots2 = {

    CellSizes: [81, 27, 9, 3, 1],

    //context information for a broken up piece of (plotting) Work
    wcx: {
	compilled_formula: undefined,
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
	phase: undefined,
	res: undefined,
	res_lim: undefined,
	req_abort: false,
	running: false,
	start_time: undefined,
	res_start_time: undefined,
	iterations_expected: 0,
	iterations_counted: 0,
	val_upper_saturate_colour: 2,
	val_lower_saturate_colour: -2
    },

    plotting_canv: function(clear){

	//get or create new canvas for the plot...
	//TODO - use multiple canvases, one for each plot...

	//sets the global this.wcx.canvas_ctx
	this.wcx.winW = $(window).width();
	this.wcx.winH = $(window).height();

	var my_W = this.wcx.winW;
	var my_H = this.wcx.winH;

	var canv_ctx = undefined;

	if($("#plot-canv").length > 0){
	    canv_ctx = $("#plot-canv")[0].getContext('2d');
	    $("#plot-canv").attr("width", my_W)
		.attr("height", my_H);

	}else{
	    var $pc = $('<canvas/>')
		.attr("width", my_W)
		.attr("height", my_H)
		.attr("id", "plot-canv");
	    $("#backgrounds").append($pc);
	    canv_ctx = $pc[0].getContext('2d');
	}

	if(clear){
	    canv_ctx.clearRect(0, 0, my_W, my_H);
	}

	return canv_ctx;

    },

    draw_job: function(){
	
	this.wcx.req_abort = false;
	if(this.wcx.running != false){
	    this.wcx.req_abort = true;

	}else{

	    $("#tabs-4 #z-5 #plot-status div").hide();
	    $("#tabs-4 #z-5 #working").show();

	    this.wcx.start_time = new Date();

	    var Plot_i = DM.PlotsArray[plots.selected_row_i];
	    this.wcx.compilled_formula = math.compile(Plot_i.formula);

	    //assume 1 otherwise
	    this.wcx.res_lim = parseInt($("#tabs-4 #z-5 #res-lim input").val()) || 1;

	    this.wcx.canvas_ctx = this.plotting_canv(false);

	    //function calls
	    this.wcx.iterations_counted = 0;
	    this.wcx.iterations_expected = this.calc_total_iterations();//call after grabbing canvas

	    this.set_for_res(0);

	    // 10000 iterations seems to take around 100ms on my laptop => around 50% duty
	    this.work(200, 200);//start the chain Work=200, rest=100
	}
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

	    $("#tabs-4 #z-5 #working #res-cur").text(this.wcx.cell_size);
	}
    },



    av_step_time: [1/100],// as a starting value, assume a single iteration takes 0.01ms
    work: function(work_duration_targ, free_duration){

	var sum = this.av_step_time.reduce(function(a, b) { return a + b; });
	var avg = sum / this.av_step_time.length; // the average durations of recent work chunks
	var iterations = work_duration_targ / avg;
	var next_phase = false;

	var t_sta = new Date();
	var completed = false;
	if(this.wcx.req_abort){
	    this.wcx.running = false;
	    this.wcx.req_abort = false;

	    $("#tabs-4 #z-5 #plot-status div").hide();
	    $("#tabs-4 #z-5 #aborted").show();
	}
	else{

	    this.wcx.running = true;

	    // CARRY OUT the work for fixed number of iterations.
	    for(var i = 0; i<iterations; i++){

		//set to a blank array (may be scrapping old data, or first assignment).
		if((this.wcx.x == 0)&&(this.wcx.y == 0)){
		    this.wcx.samples_sets[this.wcx.res] = [];
		}

		// Shorthand....
		var samples = this.wcx.samples_sets[this.wcx.res];
		var random_x = this.wcx.x_randomise[this.wcx.x].i; // this is an ACCESS operation on an array of randomised


		// 1. calculating the sample
		var x_location = (random_x - this.wcx.n_steps_xH) * this.wcx.interval_size;
		var y_location = (this.wcx.y - this.wcx.n_steps_yH) * this.wcx.interval_size;
		var my_z = math.complex(x_location, y_location)
		var my_fz = this.wcx.compilled_formula.eval({z: my_z});/////MATHS EVALUATION AT POINT
		var my_h = my_fz.re;

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
		if((this.wcx.y >= this.wcx.n_steps_y)||(next_phase)){//test if column finished
		    this.wcx.y=0;
		    this.wcx.x++;

		    if((this.wcx.x >= this.wcx.n_steps_x)||(next_phase)){//test if screen finished
			this.wcx.x = 0;
			this.wcx.res++;

			// now we have a complete point-set, draw histogram.
			plots.histogram_stats(samples);

			// (A) Completely finished drawing at the finest resolution
			if((this.wcx.res >= this.CellSizes.length) || (this.CellSizes[this.wcx.res] < this.wcx.res_lim)){
			    /// terminate and flag no further callbacks
			    completed = true;
			    break;

			// (B) about to redraw it all at a finer resolution
			}else{

			    //recalculate a bunch of resolution stuff
			    this.set_for_res(this.wcx.res);
			}

			iterations = i;//set to actual
			break; //whether completely finished, or just finished at a particular res, pause for a breath here.
		    }		    
		}
	    }

	    
	    if(!completed){
		setTimeout(function(){
		    plots2.work(work_duration_targ, free_duration);
		}, free_duration);
	    }else{
		//something to indicate we're finished...
		$("#tabs-4 #z-5 #plot-status div").hide();
		$("#tabs-4 #z-5 #complete").show();

		var t_now = new Date();
		var t_overall = t_now - this.wcx.start_time;
		var t_final = t_now - this.wcx.res_start_time;
		$("#tabs-4 #z-5 #complete #t-overall").text((t_overall/1000).toFixed(1));
		$("#tabs-4 #z-5 #complete #t-final").text((t_final/1000).toFixed(1));

		this.wcx.running = false;
	    }

	}

	this.wcx.iterations_counted += iterations;
	var pc_raw = 100 * this.wcx.iterations_counted / this.wcx.iterations_expected
	$("#tabs-4 #z-5 #working #pc-compl").text(pc_raw.toFixed(1));

	var dur = (new Date() - t_sta);
	//add the new time and pop the old one
	this.av_step_time.push(dur/iterations);
	if(this.av_step_time.length > 4){
	    this.av_step_time.splice(0,1);
	}
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
