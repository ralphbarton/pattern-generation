var grids_init = {

    init: function(){


	// 1. Table of Grids (listing on the left)



	
	// 1.1 - Buttons underneath grids listing table

	// Button Handler: ADD
	// new grid by duplicating hidden template
	$("#grids-buttons #add").click(function(){
	    if(grids.selected_row_i != undefined){
		//add new grid and select its (new) row index...
		grids.selected_row_i = DM.add_grid();
		grids.regenerate_table(); //refresh view
	    }
	});

	// Button Handler: DELETE
	// removes selected
	$("#grids-buttons #delete").click(function(){
	    if(grids.selected_row_i != undefined){
		DM.deleteRow_grid(grids.selected_row_i);
		//now, leave selected either replacing row in same position, or final row
		grids.selected_row_i = Math.min(grids.selected_row_i, DM.GridsArray.length-1);
		grids.regenerate_table(); //refresh view
	    }
	});






	
	// 2. Grids control pane




	// 2.1 - Line sets control boxes

	// 2.1.1 - DOM manipulations to initialise display

	// Create box 2 by cloning box 1 (cuts down duplication in the HTML)
	$("#line-set-2").append($("#line-set-1").clone().html());
	$("#line-set-2 .title").text("Line Set 2");
	
	// Move SVGs into position
	$("#svg-angle-1").appendTo("#line-set-1 .angle-indicator-icon");
	$("#svg-angle-2").appendTo("#line-set-2 .angle-indicator-icon");

	

	// 2.1.2 - Functionality of ALL of the Grid Properties SmartInput Boxes

	// Part A - Define the generalised on_Change callback
	var GA_mod = function(ls, key){
	    if(grids.selected_row_i != undefined){
		var Grid_i = DM.GridsArray[grids.selected_row_i];
		var old_val = Grid_i.line_sets[ls][key];
		$("#line-set-"+(ls+1)+" .ls-param."+key+" input").SmartInput("update", {change_underlying_from_DOM: true});
		var new_val = Grid_i.line_sets[ls][key];

		//For angle changes (1) animate svg (2) logic for locking angles
		if(key=="angle"){
		    grids.update_preview_svg_angle(ls, new_val);
		    if(grids.lock_angles){
			Grid_i.line_sets[1-ls].angle -= (new_val - old_val);
			// visually update other angle
			$("#line-set-"+(2-ls)+" .ls-param.angle input").SmartInput("update", {data_change: true});
			grids.update_preview_svg_angle(1-ls, Grid_i.line_sets[1-ls].angle);
		    }
		}
		
		//animated grid change...
		grids.grid_change();
	    }
	};
	
	// Part B - Apply it in SmartInput initialisation for each (of the 6) elements
	[0,1].forEach(function(ls) {
	    [{k:"spacing", u:"pixels"}, /*{k:"shift", u:"percent"},*/ {k:"angle", u:"degrees"}].forEach(function(TY) {

		//whether %, px or qty, minimum value of 1 for spacing. It prevents script freezing.
		// however, I don't really like the offset of 1 this causes on the steps.
		var dco = TY.k == "spacing" ? {min: 1} : undefined;
		
		//INITIATE
		var $input = $("#line-set-"+(ls+1)+" .ls-param."+TY.k+" input");
		$input.SmartInput({
		    //underlying_obj: - this property set on row-select, it varies with row...
		    underlying_key: TY.k,
		    data_class: TY.u, // TODO - this is not necesarily correct. Interval may NOT be px!
		    data_class_override: dco,
		    underlying_from_DOM_onChange: false, // cannot do this - full logic uses old value
		    cb_change: function(){GA_mod(ls, TY.k);}//all the graphical change...
		});
	    });
	});




	
	// 2.1.3 - Functionality of Units change MutexActionLinks (for SPACING only) -- px / % / qty

	// Part A - Define the on_Click callback
	var GAu_mod = function(ls, units_new){
	    if(grids.selected_row_i != undefined){

		// CONVERT the spacing value (such that it is equivalent with new units)
		// This function updates the object it is passed by reference ("side-effect")
		var Grid_i = DM.GridsArray[grids.selected_row_i];
		grids.spacing_unit_objectUpdater(Grid_i.line_sets[ls], units_new);

		$("#line-set-"+(ls+1)+" .ls-param.spacing input").SmartInput("update", {
		    UI_enable: false,
		    data_change: true,
		    new_dc_key: units_new // is there a way this parameter could not be passed. It is in the data?
		});
	    }
	};

	// Part B - Apply it to MutexActionLinks of Line Set 1 and Line Set 2
	[0,1].forEach(function(ls) {

	    //determine starting state
	    var Grid_i = DM.GridsArray[grids.selected_row_i];
	    var my_unit = Grid_i.line_sets[ls].spacing_unit;
	    var en_state = [my_unit != 'pixels', my_unit != 'percent', my_unit != 'quantity'];
	    
	    $("#line-set-"+(ls+1)+" .px-pc-qty.act-mutex").MutexActionLink(en_state, [
		function(){GAu_mod(ls, 'pixels');},
		function(){GAu_mod(ls, 'percent');},
		function(){GAu_mod(ls, 'quantity');},
	    ]);

	});




	
	// 2.2 - above line sets control boxes

	// 2.2.1 - switch between 1D and 2D grid


	$("#lines-v-grid.act-mutex").MutexActionLink([1, 0], [
	    function(){  grids.set_grid_to_2D(false);   grids.grid_change();  },
	    function(){  grids.set_grid_to_2D(true);    grids.grid_change();  } 
	]);
	

	

	// 2.3 - beneath line sets control boxes

	// 2.3.1 - Convert Grid - Iso / Square / Diamond

	// Part A - Define grid conversion callback
	var AdjustGridToPresetType = function(type){
	    var Grid_i = DM.GridsArray[grids.selected_row_i];
	    var LS = Grid_i.line_sets

	    // (1.) Manage angles...
	    if(type == "iso"){
		if(LS[0].angle > 60){
		    LS[0].angle -=60;//rotating back by 60 keeps within range...
		}
		LS[1].angle = 60 - LS[0].angle;
		grids.lock_angles = false;//resets lock		
		$("#link-angles.act-mutex").MutexActionLink([1, 0]);//show unlinked
	    }
	    if(type == "squ"){
		LS[1].angle = 90 - LS[0].angle;
		grids.lock_angles = false;//resets lock		
		$("#link-angles.act-mutex").MutexActionLink([1, 0]);//show unlinked
	    }
	    if(type == "dia"){

		var isRect = ((LS[0].angle == 0) && (LS[1].angle == 90)) || ((LS[0].angle == 90) && (LS[1].angle == 0));

		if(grids.lock_angles || isRect){
		    var ave_angle = (LS[0].angle + LS[1].angle)/2;
		    LS[0].angle = ave_angle;
		    LS[1].angle = ave_angle;
		}else{
		    if(LS[0].angle != 0){
			LS[1].angle = LS[0].angle;
		    }
		}
	    }

	    // (2.) Manage spacings. All options involve setting them to equal.
	    // we cannot possibly use spacing units of quantity.
	    // So unless both dimentions are in units of percent, set them both to pixels:
	    if((LS[0].spacing_unit != "percent")||(LS[1].spacing_unit != "percent")){
		GAu_mod(0, 'pixels');
		GAu_mod(1, 'pixels');
	    }
	    // set spacings equal, and set spacing units equal.
	    var av_spacing = (LS[0].spacing + LS[1].spacing)/2; 
	    LS[0].spacing = av_spacing;
	    LS[1].spacing = av_spacing;

	    //update display. Input elems and grid.
	    grids.update_all_input_elements_values(Grid_i);
	    grids.grid_change();
	};

	// Part B - Apply function to the 3-way MutexActionLink
	$("#preset-grid.act-mutex").MutexActionLink([1, 1, 1], [
	    function(){AdjustGridToPresetType("iso")},
	    function(){AdjustGridToPresetType("squ")},
	    function(){AdjustGridToPresetType("dia")}
	]);

	
	// 2.3.2 - Lock & Unlock angles
	$("#link-angles.act-mutex").MutexActionLink([1, 0], [
	    function(){grids.lock_angles = true;},
	    function(){grids.lock_angles = false;}
	]);





	
	
	// 2.4 - Preview Options box

	// 2.4.1 - Show vs hide intersection points...
	$("#show-points.act-mutex").MutexActionLink([0, 1], [
	    function(){ grids.update_grid_intersection_points({display: false}); },
	    function(){ grids.update_grid_intersection_points({display: true }); }
	]);


	// 2.4.2 - Overall visibility controls
	
	// Button Handler: SHOW
	$("#Tab-grid .button#show").click(function(){
	    if((grids.selected_row_i != undefined) && (!$(this).hasClass("ui-disabled"))){
		grids.showing_preview = true;
		grids.grid_change();
		$(this).addClass("ui-disabled");
	    }
	});

	// Action Link Handler: HIDE
	$("#Tab-grid .action-link#hide").click(function(){
	    grids.grid_change({hide: true});
	    grids.showing_preview = false;
	    $("#Tab-grid .button#show").removeClass("ui-disabled");
	});



	
	// 3. Background SVG













	
	//Call this last so as to ensure pre-requestite initialisation (of SmartInputs etc.) has happened.
	grids.regenerate_table();

    }
    
};
