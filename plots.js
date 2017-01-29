var plots = {

    selected_row_i: undefined,
    tab_props: {
	contours: 3,
	res_limit: 3
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
		plots.exec(0);
	    }
	});


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
	    setTimeout(function(){plots.exec();}, 10);

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


    prep: function(){},

    work: function(){},

    exec: function(res){

	var winW = $(window).width();
	var winH = $(window).height();

	//get or create new canvas for the plot...

	//TODO - use multiple canvases, one for each plot...
	if($("#plot-canv").length > 0){
	    var ctx = $("#plot-canv")[0].getContext('2d');
	    $("#plot-canv").attr("width", winW)
		.attr("height", winH);

	}else{
	    var $pc = $('<canvas/>')
		.attr("width", winW)
		.attr("height", winH)
		.attr("id", "plot-canv");
	    $("#backgrounds").append($pc);
	    var ctx = $pc[0].getContext('2d');
	}

	var Plot_i = DM.PlotsArray[this.selected_row_i];
	var compilled_formula = math.compile(Plot_i.formula);

	var resolution = [81, 27, 9, 3, 1];// max_i =4
//	var samples_sets = []; DO WE NEED TO STORE THE CALCULATED VALUES?????????????
	var cell_size = resolution[res];
//	var samples = samples_sets[res];
	var interval_size = 2 * (cell_size/winW);// in units of [-1, +1] for function
	var r_aspect = winH / winW;

	var n_steps_x = Math.ceil((1 / interval_size) - 0.5)*2 + 1;
	var n_steps_y = Math.ceil((r_aspect / interval_size) - 0.5)*2 + 1;
	var n_steps_xH = Math.floor(n_steps_x/2)// number of steps wholely contained in x<0 half
	var n_steps_yH = Math.floor(n_steps_y/2)// number of steps wholely contained in x<0 half
//	console.log(winW, winH, n_steps_x, n_steps_y);

	var x = 0;

	while(x < n_steps_x){		
//	    samples[x] = [];
	    y = 0;
	    while(y < n_steps_y){		

		// 1. calculating the sample
		var x_location = (x - n_steps_xH) * interval_size;
		var y_location = (y - n_steps_yH) * interval_size;
		var my_z = math.complex(x_location, y_location)
		var my_fz = compilled_formula.eval({z: my_z});
		var my_h = my_fz.im;

		//samples[x][y] = my_h; // store calculated value....

		// 2. convert value into colour
		var UU = 2;
		var LL = -2;
		var hue = (my_h - LL) / (UU - LL);
		var color = tinycolor.fromRatio({ h: hue, s: 1, l: 0.5 });

		// 3. Draw onto canvas
		ctx.fillStyle = "#" + color.toHex();
		var x_location_px = Math.round((winW/2) + (x - n_steps_xH - 0.5)*cell_size);
		var y_location_px = Math.round((winH/2) + (y - n_steps_yH - 0.5)*cell_size);

		ctx.fillRect (x_location_px, y_location_px, cell_size, cell_size);//x,y,w,h
		
		y++;
	    }
	    x++;
	}

	res++;
	var res_lim = parseInt($("#tabs-4 #z-5 #res-lim input").val());
	console.log(res_lim);
	if((res<5)&&(resolution[res]>=res_lim)){
	    setTimeout(function(){plots.exec(res);}, 100);
	}

/*

	var BOX = 32; // how many pixels per box

	var sf = 2 / winW; //how many units per 1 pixel
	var x_or = winH / 2;
	var y_or = winW / 2;




	// 1. Calculating the underlying data
	var starting = new Date();//record start time
	var Curve = [];
	var G_max = null;
	var G_min = null;
	var count = 0;
	for(var x=0; x < winW; x += BOX){	
	    Curve[x] = [];
	    for(var y=0; y < winH; y += BOX){	

		var Xm = (x - x_or) * sf;
		var Ym = (y - y_or) * sf;
		//console.log(Xm,Ym);

		var my_z = math.complex(Xm, Ym)
		var my_fz = compilled_formula.eval({z: my_z});
		var my_h = my_fz.im;

		//store that pixel!
		Curve[x][y] = my_h;
		
		count++;
		G_max = Math.max(G_max, my_h);
		G_min = Math.min(G_min, my_h);

	    }
	}
	console.log("Data creation took (ms) : ", new Date()-starting);
	console.log("min:", G_min, "max:", G_max, "count:", count);

	// 2. convert to pixel colours
	starting = new Date();//record start time
	var Curve_cols = [];
	
	var UU = 2;
	var LL = -2;

	for(var x=0; x < winW; x += BOX){	
	    Curve_cols[x] = [];
	    for(var y=0; y < winH; y += BOX){	
		var my_h = Curve[x][y];

		//draw that pixel
		var hue = (my_h - LL) / (UU - LL);
		var color = tinycolor.fromRatio({ h: hue, s: 1, l: 0.5 });
		Curve_cols[x][y] = "#" + color.toHex();
	    }
	}
	console.log("converting numbers to px colours (ms) : ", new Date()-starting);

	// 3. plot on canvas
	starting = new Date();//record start time
	for(var x=0; x < winW; x += BOX){	
	    for(var y=0; y < winH; y += BOX){	


		ctx.fillStyle = Curve_cols[x][y];
		ctx.fillRect (x, y, BOX, BOX);//x,y,w,h

	    }
	}
	console.log("Putting data into Canvas took (ms) : ", new Date()-starting);

	$("#temp-density-plots #status").text("complete...");
*/
    }

};
