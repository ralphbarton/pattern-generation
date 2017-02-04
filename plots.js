var plots = {

    selected_row_i: undefined,

    UI_props: {
	//properties of the PREVIEW tab
	prev: {
	    contours: 3,
	    res_limit: 3,
	    colouring: 0
	},

	zoom: {
	    mouse_zoom: undefined,
	    steps: undefined,

	}
    },

    init: function(){

	this.regenerate_table();

	//swathes of code are being copy-pasted here, for similiar functionality accross different tabs.
	// aaargh!!

	// Handler for -ADD-
	$("#tabs-4 #undr-tabl-btns #add").click(function(){
	    if(plots.selected_row_i != undefined){//create a new row and select it
		DM.addRow_plot();
		plots.selected_row_i = DM.PlotsArray.length - 1;
		plots.regenerate_table();
	    }
	});

	// Handler for -DELETE-
	$("#tabs-4 #undr-tabl-btns #delete").click(function(){
	    if(plots.selected_row_i != undefined){//create a new row and select it
		DM.deleteRow_plot(plots.selected_row_i);
		//"selected" row **may** move up by one
		plots.selected_row_i = Math.min(plots.selected_row_i, DM.PlotsArray.length-1);
		if(plots.selected_row_i < 0){plots.selected_row_i = undefined;}
		plots.regenerate_table();

	    }
	});

	$("#tabs-4 #z-5 .button#plot").click(function(){
	    if(plots.selected_row_i != undefined){
		plots.draw_job();
	    }
	});


	// == Within Preview Options ==

	// 3-way mutex action link Logic: colouring
	//todo: add immediate effect colour change.
	var change_colouring = function(i){
	    if(plots.wcx.running){
		plots.wcx.req_abort = true;
	    }
	    plots.UI_props.prev.colouring = i;
	};

	widgets.actionLink_init("#colouring.act-mutex", [
	    function(){change_colouring(1);},
	    function(){change_colouring(2);},
	    function(){change_colouring(3);}    ]);
	widgets.actionLink_unset("#colouring.act-mutex", null);//make all options "enabled" initially


	////////////////////?TEMP
	$("#temp-density-plots input#equation").SmartInput({
	    underlying_obj: this.eq2,
	    underlying_key: "func",
	    style_class: "plain-cell",
	    data_class: "text",
	    underlying_from_DOM_onChange: true,
//	    cb_change: 
	});


	$("#temp-density-plots input#cell-px").SmartInput({
	    underlying_obj: this.eq2,
	    underlying_key: "cell_px",
	    style_class: "plain-cell",
	    data_class: "pixels",
	});


	$("#temp-density-plots #exec-plot").click(function(){
	    $("#temp-density-plots #status").text("calculating...");
	    plots.draw_job();
	});

    },

    regenerate_table: function(){

	//wipe the entire table of rows...
	$("#plots-table tbody").html("");


	DM.PlotsArray.forEach(function(plot_obj, i){

    	    $("#plots-table tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>').SmartInput({
				underlying_obj: DM.PlotsArray[i],
				underlying_key: "formula",
				style_class: "blue-cell",//change styling classes....
				data_class: "text",
				text_length: 120,//max name length 18 char
				click_filter: function(){return plots.selected_row_i == i;}
			    })
			),
			$('<td/>').addClass("col-3").text("x"),
			$('<td/>').addClass("col-4").text("x"),
			$('<td/>').addClass("col-5").text("x")
		    ).on("click",function(){ //click on the row
			if(plots.selected_row_i != $(this).data("index")){//no action if row already selected

			    plots.selected_row_i = $(this).data("index");
			    // 1. manage row selection witin the table itself
			    $("#plots-table tr.selected").removeClass("selected");
			    $(this).addClass("selected");

			    /*
			      Take a lot of rendering actions here...
			    var Grid_i = DM.GridsArray[i];			
			    grids.update_bg_grid(Grid_i);// update the background accordingly
			    grids.update_panel_items(Grid_i);// update the panel accordingly
			    */
			}
		    })
	    );
	});

	// set a particular row as selected...
	if(this.selected_row_i != undefined){
	    var click_me_i = this.selected_row_i;
	    this.selected_row_i = undefined;//necessary for this dummy click to cause an action.
	    $($("#plots-table tbody tr")[click_me_i]).click();
	}

    },




    CellSizes: [81, 27, 9, 3, 1],
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
	req_abort: false,
	running: false
    },

    draw_job: function(){
	
	
	if(this.wcx.running != false){
	    this.wcx.req_abort = true;

	}else{

	    $("#tabs-4 #z-5 #res-lim").css("background-color", "rgba(147, 90, 9, 0.7)");

	    var Plot_i = DM.PlotsArray[this.selected_row_i];
	    this.wcx.compilled_formula = math.compile(Plot_i.formula);

	    //get or create new canvas for the plot...
	    //TODO - use multiple canvases, one for each plot...

	    //sets the global this.wcx.canvas_ctx
	    this.wcx.winW = $(window).width();
	    this.wcx.winH = $(window).height();

	    if($("#plot-canv").length > 0){
		this.wcx.canvas_ctx = $("#plot-canv")[0].getContext('2d');
		$("#plot-canv").attr("width", this.wcx.winW)
		    .attr("height", this.wcx.winH);

	    }else{
		var $pc = $('<canvas/>')
		    .attr("width", this.wcx.winW)
		    .attr("height", this.wcx.winH)
		    .attr("id", "plot-canv");
		$("#backgrounds").append($pc);
		this.wcx.canvas_ctx = $pc[0].getContext('2d');
	    }

	    //function calls
	    this.set_for_res(0);
	    // 10000 iterations seems to take around 100ms on my laptop => around 50% duty
	    this.work(200, 100);//start the chain Work=200, rest=100
	}
    },

    set_for_res: function(res){

	this.wcx.res = res;
	this.wcx.phase = 0;
	this.wcx.x = 0;
	this.wcx.y = 0;

	this.wcx.cell_size = this.CellSizes[this.wcx.res];
	this.wcx.interval_size = 2 * (this.wcx.cell_size/this.wcx.winW);// in units of [-1, +1] for function
	this.wcx.r_aspect = this.wcx.winH / this.wcx.winW;

	this.wcx.n_steps_x = Math.ceil((1 / this.wcx.interval_size) - 0.5)*2 + 1;
	this.wcx.n_steps_y = Math.ceil((this.wcx.r_aspect / this.wcx.interval_size) - 0.5)*2 + 1;
	this.wcx.n_steps_xH = Math.floor(this.wcx.n_steps_x/2)// number of steps wholely contained in x<0 half
	this.wcx.n_steps_yH = Math.floor(this.wcx.n_steps_y/2)// number of steps wholely contained in x<0 half

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
	}
	else{

	    // CARRY OUT the work for fixed number of iterations.
	    for(var i = 0; i<iterations; i++){

		if(this.wcx.samples_sets[this.wcx.res] == undefined){
		    this.wcx.samples_sets[this.wcx.res] = [];
		}

		// Shorthand....
		var samples = this.wcx.samples_sets[this.wcx.res];

		var random_x = this.wcx.x_randomise[this.wcx.x].i; // this is an ACCESS operation on an array of randomised
		if(this.wcx.phase == 0){
		    // 1. calculating the sample
		    var x_location = (random_x - this.wcx.n_steps_xH) * this.wcx.interval_size;
		    var y_location = (this.wcx.y - this.wcx.n_steps_yH) * this.wcx.interval_size;
		    var my_z = math.complex(x_location, y_location)
		    var my_fz = this.wcx.compilled_formula.eval({z: my_z});/////MATHS EVALUATION AT POINT
		    var my_h = my_fz.re;

		    if(samples[random_x] == undefined){
			samples[random_x] = [];
		    }

		    // 2.store calculated value....
		    samples[random_x][this.wcx.y] = my_h; 

		    // 3. Draw onto canvas

		    // 3.1 Set colour according to conversion function.
		    this.wcx.canvas_ctx.fillStyle = this.colouring_func(my_h, this.UI_props.prev.colouring);

		    // 3.2 determine draw location
		    var x_location_px = Math.round((this.wcx.winW/2) + (random_x - this.wcx.n_steps_xH - 0.5)*this.wcx.cell_size);
		    var y_location_px = Math.round((this.wcx.winH/2) + (this.wcx.y - this.wcx.n_steps_yH - 0.5)*this.wcx.cell_size);
		    this.wcx.canvas_ctx.fillRect (x_location_px, y_location_px, this.wcx.cell_size, this.wcx.cell_size);//x,y,w,h
		    this.wcx.y++;
		

		}else if(this.wcx.phase == 1){

		    if(this.wcx.res == 0){
			
			var vals = [];
			samples.forEach(function(column) {
			    column.forEach(function(datum) {
				vals.push()
			    });
			});
	
			

		    }
		    samples[random_x][this.wcx.y]

		    if(false){//move on
			next_phase = true;
		    }

		}





		// Iteration control, for state variables...
		if((this.wcx.y >= this.wcx.n_steps_y)||(next_phase)){//test if column finished
		    this.wcx.y=0;
		    this.wcx.x++;

		    if((this.wcx.x >= this.wcx.n_steps_x)||(next_phase)){//test if screen finished
			this.wcx.x = 0;
			this.wcx.phase++;
			
			if(this.wcx.phase > 1){// dont use multiple phases...
			    this.wcx.phase = 0;
			    this.wcx.res++;
			    var res_lim = parseInt($("#tabs-4 #z-5 #res-lim input").val());
			    //test full completion
			    if((this.wcx.res>=this.CellSizes.length)||(this.CellSizes[this.wcx.res]<res_lim)){
				/// terminate and flag no further callbacks
				completed = true;
				break;
			    }else{
				//recalculate a bunch of resolution stuff
				this.set_for_res(this.wcx.res);
				break; //also, pause for breath after doing so.
			    }
			}		    
		    }
		}
	    }

	    
	    if(!completed){
		setTimeout(function(){
		    plots.work(work_duration_targ, free_duration);
		}, free_duration);
	    }else{
		//something to indicate we're finished...
		$("#tabs-4 #z-5 #res-lim").css("background-color", "transparent");
	    }

	}

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

	var UU = 2;
	var LL = -2;
	var r = (value - LL) / (UU - LL);
	r = Math.min(1, Math.max(0, r));
	

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

    }

};
