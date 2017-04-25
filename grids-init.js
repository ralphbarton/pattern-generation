var grids_init = {

    init: function(){

	//cuts and copies of DOM content
	$("#line-set-2").append($("#line-set-1").clone().html());
	$("#line-set-2 .title").text("Line Set 2");
	
	//move SVGs into position
	$("#svg-angle-1").appendTo("#line-set-1 .angle-indicator-icon");
	$("#svg-angle-2").appendTo("#line-set-2 .angle-indicator-icon");

	// Handler for -DUPLICATE-
	$("#grids-buttons #add").click(function(){
	    //mutate the data structure
	    if(grids.selected_row_i != undefined){

		//add new grid and select its (new) row index...
		grids.selected_row_i = DM.add_grid();

		//refresh view
		grids.regenerate_table();
	    }
	});

	// Handler for -DELETE-
	$("#grids-buttons #delete").click(function(){
	    if(grids.selected_row_i != undefined){
		//mutate the data structure
		DM.deleteRow_grid(grids.selected_row_i);
		//now, leave selected either replacing row in same position, or final row
		grids.selected_row_i = Math.min(grids.selected_row_i, DM.GridsArray.length-1);
		//refresh view
		grids.regenerate_table();
	    }
	});

	// Handler for -Show- preview
	$("#Tab-grid .button#show").click(function(){
	    if((grids.selected_row_i != undefined) && (!$(this).hasClass("ui-disabled"))){
		grids.showing_preview = true;
		grids.update_bg_grid();
		$(this).addClass("ui-disabled");
	    }
	});

	// Handler for -Hide- preview
	$("#Tab-grid .action-link#hide").click(function(){
	    grids.clear_bg_grid();
	    grids.showing_preview = false;
	    $("#Tab-grid .button#show").removeClass("ui-disabled");
	});


	
	//add logic for input boxes:

	// handle a change in one of the <input> boxes for the grid array
	var GA_mod = function(obj, ls, key){
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
		grids.update_bg_grid();
		//reset the Isometric / Square / Diamond so all are available as options
		grids.enable_Iso_Square_Hex_for_current_grid();
	    }
	};




	//initiate 6 input boxes in this way...
	[0,1].forEach(function(ls) {
	    [{k:"spacing", u:"pixels"}, /*{k:"shift", u:"percent"},*/ {k:"angle", u:"degrees"}].forEach(function(TY) {

		//whether %, px or qty, minimum value of 1 for spacing. It prevents script freezing.
		var dco = TY.k == "spacing" ? {min: 1} : undefined;
		
		//INITIATE
		var $input = $("#line-set-"+(ls+1)+" .ls-param."+TY.k+" input");
		$input.SmartInput({
		    //underlying_obj: - this property set on row-select, it varies with row...
		    underlying_key: TY.k,
		    data_class: TY.u, // TODO - this is not necesarily correct. Interval may NOT be px!
		    data_class_override: dco,
		    underlying_from_DOM_onChange: false, // cannot do this - full logic uses old value
		    cb_change: function(){GA_mod($input[0], ls, TY.k);}//all the graphical change...
		});
	    });
	});



	// change grid array units...
	var GAu_mod = function(ls, units_new){
	    if(grids.selected_row_i != undefined){

		// CONVERT the spacing value (such that it is equivalent with new units)
		//as a side effect, this function updates the object it is passed by reference
		var Grid_i = DM.GridsArray[grids.selected_row_i];
		grids.spacing_unit_objectUpdater(Grid_i.line_sets[ls], units_new);

		$("#line-set-"+(ls+1)+" .ls-param.spacing input").SmartInput("update", {
		    UI_enable: false,
		    data_change: true,
		    new_dc_key: units_new // arguably, because this is referenceable from the updated underlying object,
		    // should not have to pass again aws a parameter here... ( = even more refactoring and ?? re-inventing
		    // something 'React'-like myself!!
		});
	    }
	};

	// add logic to the action links
	[0,1].forEach(function(ls) {
	    widgets.actionLink_init("#line-set-"+(ls+1)+" .px-pc-qty.act-mutex",[
		function(){GAu_mod(ls, 'pixels');},
		function(){GAu_mod(ls, 'percent');},
		function(){GAu_mod(ls, 'quantity');},
	    ]
				   );
	});

	// Logic for 3-way action-link:  Isometric / Square / Diamond
	var AdjustGridToPresetType = function(type){
	    var Grid_i = DM.GridsArray[grids.selected_row_i];
	    var LS = Grid_i.line_sets
	    if(type == "iso"){
		if(LS[0].angle > 60){
		    LS[0].angle -=60;//rotating back by 60 keeps within range...
		}
		LS[1].angle = 60 - LS[0].angle;
		grids.lock_angles = false;//resets lock		
		widgets.actionLink_unset("#link-angles.act-mutex", 1);//show unlinked
	    }
	    if(type == "squ"){
		LS[1].angle = 90 - LS[0].angle;
		grids.lock_angles = false;//resets lock		
		widgets.actionLink_unset("#link-angles.act-mutex", 1);//show unlinked
	    }
	    if(type == "dia"){
		if(grids.lock_angles){
		    var ave_angle = (LS[0].angle + LS[1].angle)/2;
		    LS[0].angle = ave_angle;
		    LS[1].angle = ave_angle;
		}else{
		    if(LS[0].angle != 0){
			LS[1].angle = LS[0].angle;
		    }
		}
	    }

	    //rhomboid. (And its getting crazy if we do this with equal line quantities)
	    if(LS[0].spacing_unit == "quantity"){GAu_mod(0, 'pixels');}
	    if(LS[1].spacing_unit == "quantity"){GAu_mod(1, 'pixels');}
	    LS[1].spacing = LS[0].spacing; 
	    LS[1].spacing_unit = LS[0].spacing_unit; // important to set units same (e.g. both to %).

	    //update display. Input elems and grid.
	    grids.update_all_input_elements_values(Grid_i);
	    grids.update_bg_grid();
	};

	widgets.actionLink_init("#preset-grid.act-mutex", [
	    function(){AdjustGridToPresetType("iso")},
	    function(){AdjustGridToPresetType("squ")},
	    function(){AdjustGridToPresetType("dia")}    ]);

	//put them all "set"
	grids.enable_Iso_Square_Hex_for_current_grid();
	
	// lock/link angles together
	widgets.actionLink_init("#link-angles.act-mutex", [
	    function(){grids.lock_angles = true;},
	    function(){grids.lock_angles = false;}    ]);

	// switch between 1D and 2D grid.

	var set_2D = function(make_2d){
	    var Grid_i = DM.GridsArray[grids.selected_row_i];
	    Grid_i.n_dimentions = make_2d ? 2 : 1;
	    grids.update_bg_grid();
	    $("#Tab-grid #line-set-2.boxie").toggleClass("ui-disabled", !make_2d);
	    $("#Tab-grid #line-set-2.boxie vinput").prop('disabled', !make_2d);   //Disable input
	};

	widgets.actionLink_init("#lines-v-grid.act-mutex", [
	    function(){set_2D(false);},
	    function(){set_2D(true);}    ]);


	widgets.actionLink_init("#show-points.act-mutex",[
	    function(){
		//hide
	    },
	    function(){
		//show
		grids.gen_grid_intersection_points();
	    }
	]
			       );


	
	//Call this last so as to ensure pre-requestite initialisation (of SmartInputs etc.) has happened.
	grids.regenerate_table();

    }
    
};
