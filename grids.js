var grids = {

    showing_preview: false,
    lock_angles: false,
    selected_row_i: undefined,
    previousGrid: {line_sets:[]},

    init: function(){

	this.regenerate_table();


	//cuts and copies of DOM content
	$("#line-set-2").append($("#line-set-1").clone().html());
	$("#line-set-2 .title").text("Line Set 2");
	
	//move SVGs into position
	$("#svg-angle-1").appendTo("#line-set-1 .k-pix");
	$("#svg-angle-2").appendTo("#line-set-2 .k-pix");

	// Handler for -DUPLICATE-
	$("#grids-buttons #duplicate").click(function(){
	    //mutate the data structure
	    if(grids.selected_row_i != undefined){
		DM.duplicate_grid(grids.selected_row_i);
		//select the row just created...
		grids.selected_row_i += 1;
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
	$("#grid-preview-visibility #show").click(function(){
	    var my_i = grids.selected_row_i;
	    if((my_i != undefined) && (!$(this).hasClass("ui-disabled"))){
		grids.showing_preview = true;
		grids.update_bg_grid(DM.GridsArray[my_i]);
		$(this).addClass("ui-disabled");
	    }
	});


	$(".action-link.translate").click(function() {
	    $("#tabs-3 #extra-content").show({duration: 400});
	});

	//add logic for input boxes:

	// handle a change in one of the <input> boxes for the grid array
	var GA_mod = function(obj, ls, key){
	    var my_i = grids.selected_row_i;
	    if(my_i != undefined){
		var Grid_i = DM.GridsArray[grids.selected_row_i];
		var old_val = Grid_i.line_sets[ls][key];
		$("#line-set-"+(ls+1)+" .k-"+key+" input").SmartInput("update", {change_underlying_from_DOM: true});
		var new_val = Grid_i.line_sets[ls][key];

		//For angle changes (1) animate svg (2) logic for locking angles
		if(key=="angle"){
		    grids.update_preview_svg_angle(ls, new_val);
		    if(grids.lock_angles){
			Grid_i.line_sets[1-ls].angle -= (new_val - old_val);
			// visually update other angle
			$("#line-set-"+(2-ls)+" .k-angle input").SmartInput("update", {data_change: true});
			grids.update_preview_svg_angle(1-ls, Grid_i.line_sets[1-ls].angle);
		    }
		}
		
		//animated grid change...
		grids.update_bg_grid(Grid_i);
		//reset the Isometric / Square / Diamond so all are available as options
		grids.preset_grid_action_links_enablement();
	    }
	};




	//initiate 6 input boxes in this way...
	[0,1].forEach(function(ls) {
	    [{k:"spacing", u:"pixels"}, /*{k:"shift", u:"percent"},*/ {k:"angle", u:"degrees"}].forEach(function(TY) {

		//INITIATE
		var $input = $("#line-set-"+(ls+1)+" .k-"+TY.k+" input");
		$input.SmartInput({
//		    underlying_obj: Grid_i.line_sets[ls], // this property set on row-select, it is a function of row...
		    underlying_key: TY.k,
		    style_class: "plain-cell",
		    data_class: TY.u, //TODO - isn't this just an arbirary choice, as above -> delete this line?
		    underlying_from_DOM_onChange: false, // cannot do this - full logic uses old value
		    cb_change: function(){GA_mod($input[0], ls, TY.k);}//all the graphical change...
		});
	    });
	});



	// change grid array units...
	var GAu_mod = function(ls, units_new){
	    var my_i = grids.selected_row_i;
	    if(my_i != undefined){

		// CONVERT the spacing value (such that it is equivalent with new units)
		//as a side effect, this function updates the object it is passed by reference
		grids.spacing_unit_objectUpdater(DM.GridsArray[my_i].line_sets[ls], units_new);

		$("#line-set-"+(ls+1)+" .k-spacing input").SmartInput("update", {
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
	    grids.update_bg_grid(Grid_i);
	};

	widgets.actionLink_init("#preset-grid.act-mutex", [
	    function(){AdjustGridToPresetType("iso")},
	    function(){AdjustGridToPresetType("squ")},
	    function(){AdjustGridToPresetType("dia")}    ]);

	//put them all "set"
	grids.preset_grid_action_links_enablement();
	
	// lock/link angles together
	widgets.actionLink_init("#link-angles.act-mutex", [
	    function(){grids.lock_angles = true;},
	    function(){grids.lock_angles = false;}    ]);

	// switch between 1D and 2D grid.

	var set_2D = function(make_2d){
	    DM.GridsArray[grids.selected_row_i].n_dimentions = make_2d ? 2 : 1;
	    var Grid_i = DM.GridsArray[grids.selected_row_i];
	    grids.update_bg_grid(Grid_i);
	    $("#tabs-3 #line-set-2.boxie").toggleClass("ui-disabled", !make_2d);
	    $("#tabs-3 #line-set-2.boxie vinput").prop('disabled', !make_2d);   //Disable input
	};

	widgets.actionLink_init("#lines-v-grid.act-mutex", [
	    function(){set_2D(false);},
	    function(){set_2D(true);}    ]);

    },

    preset_grid_action_links_enablement: function(){
	widgets.actionLink_unset("#preset-grid.act-mutex", null);
	var my_i = grids.selected_row_i;
	if(my_i != undefined){
	    var LS = DM.GridsArray[my_i].line_sets;
	    if((LS[0].angle == LS[1].angle) || (LS[0].angle == 0)){//can't apply diamond if angle zero
		$($("#preset-grid.act-mutex div")[2]).removeClass("action-link");
	    }
	}
    },


    regenerate_table: function(){

	//wipe the entire table of rows...
	$("#grids-table tbody").html("");

	DM.GridsArray.forEach(function(grid_obj, i){

    	    $("#grids-table tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>').SmartInput({
				underlying_obj: DM.GridsArray[i],
				underlying_key: "description",
				style_class: "blue-cell",
				data_class: "text",
				text_length: 18,//max name length 18 char
				click_filter: function(){return grids.selected_row_i == i;}
			    })
			)
		    ).on("click",function(){ //click on the row

			//it it ok we're not testing here for if row is already selected...

			// 1. manage row selection witin the table itself
			$("#grids-table tr.selected").removeClass("selected");
			$(this).addClass("selected");
			grids.selected_row_i = $(this).data("index");

			// 2. populate the right section of screen using data from that specific grid
			var Grid_i = DM.GridsArray[i];
			grids.update_all_input_elements_values(Grid_i);

			// show the content for editing
			$("#tabs-3 div#row-content").fadeIn({duration:400, easing: "linear"});

			// update to this Grid.
			grids.update_bg_grid(Grid_i);
			grids.preset_grid_action_links_enablement();
			widgets.actionLink_unset("#lines-v-grid.act-mutex", Grid_i.n_dimentions == 2);

			//update referenced underlying data of 6 input boxes in this way...
			[0,1].forEach(function(ls) {
			    [{k:"spacing"}, {k:"angle"}].forEach(function(TY) {

				//UPDATE
				var $input = $("#line-set-"+(ls+1)+" .k-"+TY.k+" input").SmartInput("update", {
				    underlying_obj: Grid_i.line_sets[ls]
				});
			    });
			});

		    })
	    );

	    //edit_cp.table_row(element, i);
	});

	// use click handler to achieve re-selection
	if(this.selected_row_i != undefined){
	    var tr_selected = $("#grids-table tbody tr")[this.selected_row_i];
	    //this.selected_row_i = undefined;//reset selection - necessary for effect of next line
	    tr_selected.click();
	}

	
    },

    update_all_input_elements_values: function (grid_obj){
	//k-angle=angle, k-spacing=spacing
	var Gx = grid_obj.line_sets;

	[0,1].forEach(function(ls) {
	    grids.update_preview_svg_angle(ls, grid_obj.line_sets[ls]["angle"]);//update the SVG
	    [{k:"spacing"}, {k:"angle"}].forEach(function(TY) {
		//UPDATE
		$("#line-set-"+(ls+1)+" .k-"+TY.k+" input").SmartInput("update", {data_change: true});
	    });
	});
    },

    update_preview_svg_angle: function (ls, angle){
	var dy = ls ? 8 : 62;
	var svg_id = "#svg-angle-" + (ls+1);
	var angle = ls ? angle : -angle;

	d3.select(svg_id + " #my_arrow")
	    .transition()
	    .duration(500)
	    .attr("transform", "translate(8 "+dy+") rotate("+angle+")");
    },

    update_bg_grid: function (grid_obj){

	if(grids.showing_preview){
	    var winW = $(window).width();
	    var winH = $(window).height();

	    $("#svg-bg-fullscreen").css("width", winW).css("height", winH);

	    this.screen_update_line_set(grid_obj.line_sets[0], this.previousGrid.line_sets[0], winW, winH, 0);
	    this.screen_update_line_set(grid_obj.line_sets[1], this.previousGrid.line_sets[1], winW, winH, 1, grid_obj.n_dimentions == 1);

	    this.previousGrid = grid_obj;
	}
    },

    screen_update_line_set: function (LineSet, prev_LineSet, W, H, ls_i, b_remove){

	var Dia = Math.sqrt(W*W + H*H);
	var origX = W/2;
	var origY = H/2;
	var Radius = Dia/2;
	var first = prev_LineSet == undefined;
	var neg_ang = (ls_i == 0 ? -1 : 1);

	//assuming data in pixels here...
	var LineSet_px = grids.spacing_unit_objectUpdater(LineSet, "pixels", true);
	var inte_target = LineSet_px.spacing;

	var angle_target = LineSet.angle * neg_ang;
	var inte_starting = inte_target; // may reassign just below... hmm... consideration needed.
	if(prev_LineSet){
	    var prev_LineSet_px = grids.spacing_unit_objectUpdater(prev_LineSet, "pixels", true);
	    var inte_starting = first ? inte_target : prev_LineSet_px.spacing;
	}

	var angle_starting = first ? angle_target : (prev_LineSet.angle * neg_ang);

	var N1 = Math.ceil((Dia/2) / inte_target);//N1 is the number of lines in just the upper half
	
	var lines_class = "lines-"+(ls_i + 1);

	//this is an array to apply D3 to and generate one line set...
	var lines1_genData = [];
	if(b_remove !== true){
	    for (var i = 0; i < N1; i++){
		lines1_genData.push(i);
		if(i != 0){
		    lines1_genData.push(-i);
		}
	    }
	}

	//select the set of lines
	var selection = d3.select("#svg-bg-fullscreen")
	    .selectAll("."+lines_class).data(lines1_genData);

	first = first || selection.size() == 0; //if 

	// first pass - change the set to contain the correct number of lines
	selection.enter()
	    .append("line").attr("class", lines_class)
	    .attr("x1", -Radius)
	    .attr("x2", +Radius)
	    .attr("y1", function(d){return d*inte_starting;})
	    .attr("y2", function(d){return d*inte_starting;})
	    .attr("transform", "translate("+origX+" "+origY+") rotate("+angle_starting+")")
	    .attr("stroke","rgba(0,0,0,0)")
	    .attr("stroke-width","1")
	    .transition()// ok, let's animate the arrival of new lines...
	    .duration(first ? 500:0)//this animation can be overridden by a later one, causing it to stop
	    .attr("stroke", "black");


	selection.exit()
	    .transition()
	    .delay(b_remove ? 0 : 500)
	    .duration(b_remove ? 500 : 1300)
	    .ease(d3.easeLinear)//not sure what easing is best for opacity changes
	    .attr("stroke", "rgba(0,0,0,0)")
	    .remove();

	//second pass. Animate (this will often have no impact where previous and current are the same)
	// (which means an opportunity to optimise, arguably).
	if(!first){
	    var selection = d3.select("#svg-bg-fullscreen")
		.selectAll("."+lines_class).data(lines1_genData)
		.transition()
		.delay(function(d, i) {
		    return (i / N1) * (grids.lock_angles ? 0 : 250); // max of (i/N2) = 2
		})
		.duration(500)
		.attr("y1", function(d){return d*inte_target;})
		.attr("y2", function(d){return d*inte_target;})
		.attr("transform", "translate("+origX+" "+origY+") rotate("+angle_target+")");
	}
    },

    spacing_unit_objectUpdater: function(LineSet, units_new, no_side_effect__return_new){
	var winW = $(window).width();
	var winH = $(window).height();
	var phi_rad = LineSet.angle * 2 * Math.PI / 360;
	var theta_rad = Math.atan(winH/winW);
	var to_deg = 180/Math.PI;
	var L_eff = Math.sqrt(winW*winW + winH*winH) * Math.sin(Math.abs(phi_rad + theta_rad));

	//whatever units are, restore them as px
	var spacing_px = LineSet.spacing;
	if(LineSet.spacing_unit == 'percent'){
	    spacing_px = winW * LineSet.spacing/100; //convert percent into px
	}else if(LineSet.spacing_unit == 'quantity'){
	    spacing_px = L_eff / LineSet.spacing; //convert qty into px
	}

	var spacing_new = spacing_px;
	if(units_new == 'percent'){
	    spacing_new = (spacing_px/winW) * 100;
	}else if(units_new == 'quantity'){
	    spacing_new = L_eff / spacing_px;
	}

	if(no_side_effect__return_new !== true){
	    // "LineSet" (that passed into a function by value) is a reference to an object
	    // assigning a new object to it would only change the temporary reference. We need to de-reference, as below
	    LineSet.spacing = spacing_new;
	    LineSet.spacing_unit = units_new;
	    LineSet.shift = LineSet.shift;
	    LineSet.angle = LineSet.angle;
	}else{
	    return {
		spacing: spacing_new,
		spacing_unit: units_new,
		shift: LineSet.shift,
		angle: LineSet.angle
	    };
	}
    }

};
