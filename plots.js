var plots = {

    selected_row_i: undefined,
    showing_plot_active: false,
    InputsValues: {"prom_factor": 2},
    
    UI_props: {
	//properties of the PREVIEW tab
	prev: {
	    contours: 3,
	    res_limit: 3,
	    colouring: 1 /* 0  would be rainbow... */
	},

	plots_canvas_qualities: {},

	zoom: {
	    mouse_zoom: undefined,
	    steps: undefined,

	}
    },

    init: function(){

	this.regenerate_table();

	plots2.load_colours_prelookup();

	plots2.render_plot_canvases_background();
	
	//swathes of code are being copy-pasted here, for similiar functionality accross different tabs.
	// aaargh!!

	// Handler for -ADD-
	$("#Tab-plot #undr-tabl-btns #add").click(function(){
	    if(plots.selected_row_i != undefined){//create a new row and select it
		DM.plot_Add();
		plots.selected_row_i = DM.plotArray.length - 1;
		plots.regenerate_table();
	    }
	});

	// Handler for -DELETE-
	$("#Tab-plot #undr-tabl-btns #delete").click(function(){
	    if(plots.selected_row_i != undefined){//create a new row and select it
		DM.plot_Delete(plots.selected_row_i);
		//"selected" row **may** move up by one
		plots.selected_row_i = Math.min(plots.selected_row_i, DM.plotArray.length-1);
		if(plots.selected_row_i < 0){plots.selected_row_i = undefined;}
		plots.regenerate_table();

	    }
	});

	$("#Tab-plot #z-5 .button#plot").click(function(){
	    if(plots.selected_row_i != undefined){
		plots2.draw_job();//this will abort the existing job and start afresh
		plots.showing_plot_active = true;
	    }
	});

	$("#Tab-plot #z-5 .action-link#clear").click(function(){
	    plots2.abort_recursive_work();

	    // hide all plot canvases...
	    $("body > #backgrounds canvas.plot").hide();

	    plots.showing_plot_active = false;

	    //Delete all the bars of the barchart.
	    d3.select("#hist svg")
		.selectAll("rect").remove();
	    plots.first_hist = true;

	});

	$("#Tab-plot #z-5 .action-link#open-pointset-p").click(function(){
	    $(".zone#z-5").fadeOut({duration: 400, easing: "linear"});
	    $(".zone#z-6").fadeIn({duration: 400, easing: "linear"});
	});



	
	// Within Pointset Preview...

	// Numeric button
	var qty_pnts = undefined;
	$("#Tab-plot #z-6 .button").click(function(){
	    if($(this).hasClass("ui-disabled")){return;}
	    
	    //show buttons in disabled state
	    $("#Tab-plot #z-6 .button").addClass("ui-disabled");
	    qty_pnts = parseInt( $(this).attr("id").replace(/[^0-9]/g,'') );

	    var Plot_i = DM.plotArray[plots.selected_row_i];
	    
	    //Regenerate the CDF for the plot, using the desired Prominence
	    var Prom_function = function(x){return x ** plots.InputsValues["prom_factor"]};
	    density_util.Create_density_CDF(Plot_i.uid, Prom_function);

	    // Timeout is necessary because clicking must trigger a UI change (buttons disable)
	    setTimeout(function(){

		// this function may do a lot of work
		density_util.Draw_many_using_CDF(qty_pnts, {clearAllExisting: true, dotAsMotif: true});

		//show buttons in disabled state
		$("#Tab-plot #z-6 .button").removeClass("ui-disabled");

		
	    }, 200);
	});

	
	// "clear points" link
	$("#Tab-plot #z-6 .action-link#clear-points").click(function(){
	    // remove all points
	    density_util.Draw_many_using_CDF(0, {clearAllExisting: true, dotAsMotif: true});
	});


	//moving between main tabs must also clear the pointset pane and any points
	$("#cpanel-main-tabs li").click(function(){
	    density_util.Draw_many_using_CDF(0, {clearAllExisting: true, dotAsMotif: true});
	    $(".zone#z-6").hide();
	    $(".zone#z-5").show();
	});
	

	// Initialise SmartInput for "Prominence Factor"
	$("#Tab-plot #z-6 #prom-factor input").SmartInput({
	    data_class: "dimentionless",
	    data_class_override: {min: 1, max:8, steps:[0.1, 0.5, 1]},
	    underlying_obj: plots.InputsValues,
	    underlying_key: "prom_factor",
	    cb_focusout: function(){// responsing to the change event can cause system to hang...
		if(qty_pnts > 200){return;}
		
		var Plot_i = DM.plotArray[plots.selected_row_i];

		//Regenerate the CDF for the plot, using the desired Prominence
		var Prom_function = function(x){return x ** plots.InputsValues["prom_factor"]};
		density_util.Create_density_CDF(Plot_i.uid, Prom_function);

		// this function may do a lot of work
		density_util.Draw_many_using_CDF(qty_pnts, {clearAllExisting: true, dotAsMotif: true});
	    }
	});

	//Hide/show underlying density
	$("#Tab-plot #z-6 .act-mutex.underyling-density").MutexActionLink([1, 0], [
	    function(){//hide it
		$("body > #backgrounds canvas.plot").hide();
		plots.showing_plot_active = false;
	    },
	    function(){//show it
		var Plot_i = DM.plotArray[plots.selected_row_i];
		var pID = "plot-" + Plot_i.uid;
		$("body > #backgrounds canvas.plot").hide();
		$("body > #backgrounds canvas#" + pID).show();
		plots.showing_plot_active = true;
	    }
	]);
	
	// "close" link
	$("#Tab-plot #z-6 .action-link#close-pointset-p").click(function(){
	    $(".zone#z-6").fadeOut({duration: 400, easing: "linear"});
	    $(".zone#z-5").fadeIn({duration: 400, easing: "linear"});
	});



	
	
	

	// == Within Preview Options ==

	// 3-way mutex action link Logic: colouring
	//todo: add immediate effect colour change.
	var change_colouring = function(i){
	    plots.UI_props.prev.colouring = i;
	    if(plots.showing_plot_active){
		plots2.draw_job();//this will abort the existing job and start afresh
	    }
	};

	$("#colouring.act-mutex").MutexActionLink([1, 1, 1], [//make all options "enabled" initially
	    function(){change_colouring(1);},
	    function(){change_colouring(2);},
	    function(){change_colouring(3);}
	]);


	// this hides multiple comments of class 'comment'. Using ID, they will get individually shown
	$("#z-3.zone .comment").hide();
 
	//set an assumed res-limit value of 3 pixels
	$("#Tab-plot #z-5 #res-lim input").val(3);

	//initiate the smart-inputs
	["min", "max", "mid"].forEach(function(str) {

	    $("#Tab-plot #value-"+str+" input").SmartInput({
		underlying_key: "val_"+str,
		data_class: "dimentionless",
		cb_change: function(){
		    if(plots.selected_row_i != undefined){
			// 1. flag as manual (reset to Auto upon)
			var Plot_iH = DM.plotArray[plots.selected_row_i].histogram;
			Plot_iH.manual = true;

			// 2. Redraw plot
			plots2.draw_job();//this will abort the existing job and start afresh
		    }
		}
	    });

	});


	// Note 26-Mar-2017 - even in its incompleted state, this action link makes some impact,
	// since the 'val-min' and 'val-max' parameters are used by the software.
	$("#Tab-plot #z-2 .action-link#hist-reset").click(function(){
	    // 1. reset to auto.
	    var Plot_iH = DM.plotArray[plots.selected_row_i].histogram;
	    Plot_iH.manual = false;

	    // 2. Redraw plot
	    plots2.draw_job();//this will abort the existing job and start afresh
	    
	});

    },



    regenerate_table: function(){

	var check_eqn_type = function(input_elem){//check the equation...

	    var usrFn = math.compile($(input_elem).val());

	    var OK_real = true;
	    try{         usrFn.eval({x:0, y:0}); }
	    catch (e){   OK_real = false;        }

	    var OK_cplx = true;
	    try{         usrFn.eval({z:0}); }
	    catch (e){   OK_cplx = false;        }

	    return OK_real ? "real" : (OK_cplx ? "cplx" : "invalid");
	};

	var set_EQN_row_class = function(input_elem){//check the equation...
	    var eqnTy = check_eqn_type(input_elem);

	    //parent x2 -> containing elems for <tr> for the <input>
	    if(eqnTy == "real"){
		$(input_elem).parent().parent().toggleClass("pink", false);
	    }else if(eqnTy == "cplx"){
		$(input_elem).parent().parent().toggleClass("pink", true);
	    }

	    $(input_elem).parent().parent().toggleClass("invalid", (eqnTy != "real") && (eqnTy != "cplx"));
	};

	var set_EQN_type_msg = function(input_elem){//check the equation...
	    var eqnTy = check_eqn_type(input_elem);

	    if(eqnTy == "real"){
		$("#z-3.zone #real").fadeIn({duration:200, easing: "linear"});
		$("#z-3.zone #cplx").fadeOut({duration:200, easing: "linear"});
		$("#z-3.zone #invalid").fadeOut({duration:200, easing: "linear"});
	    }else if(eqnTy == "cplx"){
		$("#z-3.zone #real").fadeOut({duration:200, easing: "linear"});
		$("#z-3.zone #cplx").fadeIn({duration:200, easing: "linear"});
		$("#z-3.zone #invalid").fadeOut({duration:200, easing: "linear"});
	    }else{
		$("#z-3.zone #real").fadeOut({duration:200, easing: "linear"});
		$("#z-3.zone #cplx").fadeOut({duration:200, easing: "linear"});
		$("#z-3.zone #invalid").fadeIn({duration:200, easing: "linear"});
	    }			    
	};

	var prevFormula = undefined;

	//wipe the entire table of rows...
	$("#plots-table tbody").html("");


	DM.plotArray.forEach(function(plot_obj, i){
	    
    	    $("#plots-table tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>')
				.addClass("blue-cell")//for css styling
				.SmartInput({
				    underlying_obj: DM.plotArray[i],
				    underlying_key: "formula",
				    data_class: "text",
				    text_length: 120, // setting a 120 char limit on the formula...
				    click_filter: function(){return plots.selected_row_i == i;},
				    cb_focusout: function(el){
					set_EQN_row_class(el);

					var latestFormula = DM.plotArray[plots.selected_row_i].formula;

					//if the formula is changed, on focusout, recalculation is necessary.
					if(prevFormula != latestFormula){
					    if(plots.showing_plot_active){
						plots2.draw_job();
					    }else{
						//hidden regen, for the sake of the thumbnails..
						plots2.draw_job(plot_obj.uid, {visible: false, res_lim: 1});
					    }
					}
				    },
				    //defer call:  <input> doesn't have the right parent elems until Append call finishes
				    cb_init: function(el){setTimeout(function(){set_EQN_row_class(el);},10);},
			    })
			),
			$('<td/>').addClass("col-3").text("x"),
			$('<td/>').addClass("col-4").append(//Preview column
			    $('<canvas/>')
				.attr("width", 40)
				.attr("height", 40)
				.attr("id", "th-pl-"+ plot_obj.uid)
			    	.addClass("thumb")
			),
			$('<td/>').addClass("col-5").text("x")
		    ).on("click",function(){ //click on the row
			if(plots.selected_row_i != $(this).data("index")){//no action if row already selected

			    plots.selected_row_i = $(this).data("index");
			    // 1. manage row selection witin the table itself
			    $("#plots-table tr.selected").removeClass("selected");
			    $(this).addClass("selected");

			    set_EQN_type_msg($("#plots-table tr.selected td input"));

			    var Plot_i = DM.plotArray[plots.selected_row_i];

			    //update the smart inputs to refer to the right underlying data
			    ["min", "max", "mid"].forEach(function(str) {
				$("#Tab-plot #value-"+str+" input").SmartInput("update", {
				    underlying_obj: Plot_i.histogram
				});
			    });

			    // Hide the "Render Pointset" pane when a new row is selected.
			    $(".zone#z-6").hide();
			    $(".zone#z-5").show();
			    // remove all points
			    density_util.Draw_many_using_CDF(0, {clearAllExisting: true, dotAsMotif: true});
			    
			    prevFormula = Plot_i.formula;

			    if(plots.showing_plot_active){
				
				//only initiate redrawing if there isn't a canvas there for this plot...
				var pID = "plot-" + Plot_i.uid;
				var $c = $("body > #backgrounds canvas#" + pID);
				if( $c.length == 0 ){
				    plots2.draw_job();//this will abort the existing job and start afresh
				}else{
				    // simply show the relevant canvas.

				    $("body > #backgrounds canvas.plot").hide();
				    $("body > #backgrounds canvas#" + pID).show();
				}
			    }

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



    //ideally, call any really computationally expensive functions within this by a timeout.
    // this will prevent it adding to cost calculation for plotting - not that that's so bad...
    first_hist: true,
    persistent_in_colour: false,
    histogram_stats: function(samples){

	var A1 = new Date();

	function compare(a, b) {
	    if (a < b) return -1;
	    if (a > b) return 1;
	    return 0;
	}

	samples.sort(compare);
//	console.log("Time taken to sort (ms):",(new Date())-A1);

	var grab = function(ind_real){
	    var i = parseInt(ind_real);
	    return samples[i].toFixed(2);
	};

	var L = samples.length;

	$(".zone#z-2 #hist-stats #points  span").text(L);
	$(".zone#z-2 #hist-stats #min     span").text(grab(0) );
	$(".zone#z-2 #hist-stats #max     span").text(grab(L-1));
	$(".zone#z-2 #hist-stats #low-10  span").text(grab(L*0.1));
	$(".zone#z-2 #hist-stats #high-10 span").text(grab(L*0.9));
	$(".zone#z-2 #hist-stats #median  span").text(grab(L*0.5));


	var num_grab = function(ind_real){
	    var i = parseInt(ind_real);
	    return samples[i];
	};


	var Plot_iH = DM.plotArray[plots.selected_row_i].histogram;

	if(Plot_iH.manual){

	    plots2.wcx.val_lower_saturate_colour = Plot_iH.val_min;
	    plots2.wcx.val_upper_saturate_colour = Plot_iH.val_max;

	}else{

	    plots2.wcx.val_lower_saturate_colour = num_grab(L * 0.1);
	    plots2.wcx.val_upper_saturate_colour = num_grab(L * 0.9);

	    // also need to update Input boxes here...
	    Plot_iH.val_min = plots2.wcx.val_lower_saturate_colour;
	    Plot_iH.val_max = plots2.wcx.val_upper_saturate_colour;	    
	    $("#Tab-plot #value-min input").SmartInput("update", {data_change: true});
	    $("#Tab-plot #value-max input").SmartInput("update", {data_change: true});	    

	}


	////maybe split into separate function: D3 histogram drawing here...

	var n_bars = 16;
	var V_min = plots2.wcx.val_lower_saturate_colour;
	var V_max = plots2.wcx.val_upper_saturate_colour;
	var value_step = (V_max - V_min) / n_bars;

	var bar_heights = [0];
	var bar_counter = 0;
	var max_bar_height = 0;

	//turn the sorted array of values into a set of bins
	for(var i = 0; i < samples.length; i++){
	    bar_heights[bar_counter]++;
	    max_bar_height = Math.max(bar_heights[bar_counter], max_bar_height);

	    while(samples[i] > V_min+((bar_counter+1)*value_step)){
		//you'd have thought this wouldn't be necessary, but a superflous bin can be created otherwise
		if(bar_counter == (n_bars-1)){break;}
		bar_counter++;
		bar_heights.push(0);
	    }
	}

	//Width and height
	var w = parseInt($("#hist").css("width"));
	var h = parseInt($("#hist").css("height"));
	var barPadding = 1;
	
	var scaled_bars = [];
	bar_heights.forEach(function(element) {
	    scaled_bars.push(h*0.97*element/max_bar_height);
	});

	var bar_w = Math.floor(w / scaled_bars.length);

	

	//Create SVG element
	var selection = d3.select("#hist svg")
	    .attr("width", w)
	    .attr("height", h)
	    .selectAll("rect")
	    .data(scaled_bars);


	if(this.first_hist){

	    selection
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
		    return i * bar_w + 2;
		})
		.attr("y", function(d) {
		    return (h - d);
		})
		.attr("width", bar_w - barPadding)
		.attr("height", function(d) {return d;});

	    this.first_hist=false;

	}else{

	    selection
		.transition()
		.duration(500)
		.attr("y", function(d) {
		    return (h - d);
		})
		.attr("height", function(d) {return d;});

	}


	var HistInColour = function(use_colour){

	    var selection = d3.select("#hist svg")
		.selectAll("rect")
		.attr("fill", function(d, i) {

		    if(use_colour == false){
			return "rgba(0, 0, 0, 0.5)";
		    }else if (i == 0){
			return plots2.HexColour_from_fnValue(0, true);
		    }else if(i == (n_bars-1)){
			return plots2.HexColour_from_fnValue(1, true);
		    }else{
			return plots2.HexColour_from_fnValue( (i+0.5)/n_bars , true);
		    }
		});

	};

	//set the colours every time
	HistInColour(this.persistent_in_colour);

	$("#hist svg").off()
	    .on("mouseenter", function () {
		HistInColour(true);
	    })
	    .on("mouseleave", function () {
		if(!plots.persistent_in_colour){
		    HistInColour(false);
		}
	    })
	    .on("click", function () {
		plots.persistent_in_colour = !plots.persistent_in_colour;
	    });

    }

};
