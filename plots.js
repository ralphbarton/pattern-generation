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
		plots2.draw_job();//this will abort the existing job and start afresh
	    }
	});

	$("#tabs-4 #z-5 .action-link#clear").click(function(){
	    plots2.wcx.req_abort = true;
	    plots2.plotting_canv(true);//clear the canvas...
	});



	// == Within Preview Options ==

	// 3-way mutex action link Logic: colouring
	//todo: add immediate effect colour change.
	var change_colouring = function(i){
	    plots.UI_props.prev.colouring = i;
	    if(plots2.wcx.canvas_ctx !== undefined){
		plots2.draw_job();//this will abort the existing job and start afres
	    }
	};

	widgets.actionLink_init("#colouring.act-mutex", [
	    function(){change_colouring(1);},
	    function(){change_colouring(2);},
	    function(){change_colouring(3);}    ]);
	widgets.actionLink_unset("#colouring.act-mutex", null);//make all options "enabled" initially

	$("#z-3.zone .comment").hide();
 
	//set an assumed res-limit value of 3 pixels
	$("#tabs-4 #z-5 #res-lim input").val(3);




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
	    plots2.draw_job();
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
				click_filter: function(){return plots.selected_row_i == i;},
				cb_focusout: set_EQN_row_class,
				//defer call because of <input> doesn't have the right parent elems until Append call finishes
				cb_init: function(el){setTimeout(function(){set_EQN_row_class(el);},10)},
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

			    set_EQN_type_msg($("#plots-table tr.selected td input"));

			    /*
			      Take a lot of rendering actions here...
			      //so in the case of GRIDs we would display a different grid
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

    }

};
