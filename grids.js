var grids = {

    showing_preview: false,
    lock_angles: false,
    selected_row_i: 0,//let's have the top row selected by default


    enable_Iso_Square_Hex_for_current_grid: function(){
	var my_i = this.selected_row_i;
	widgets.actionLink_unset("#preset-grid.act-mutex", null);//make all options "enabled" initially
	if(my_i != undefined){
	    var LS = DM.GridsArray[my_i].line_sets;
	    // disable "diamond" if (1) angles already equal => no effect, or (2) angle zero => cannot be applied
	    if((LS[0].angle == LS[1].angle) || (LS[0].angle == 0)){
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
			    $('<input/>')
			    	.addClass("blue-cell")//for css styling
				.SmartInput({
				underlying_obj: DM.GridsArray[i],
				underlying_key: "description",
				data_class: "text",
				text_length: 16,//max name length 16 char
				click_filter: function(){return grids.selected_row_i == i;}
			    })
			)
		    ).on("click",function(){ //click on the row
			if(grids.selected_row_i != $(this).data("index")){

			    // 1. manage row selection witin the table itself
			    grids.selected_row_i = $(this).data("index");
			    $("#grids-table tr.selected").removeClass("selected");
			    $(this).addClass("selected");

			    var Grid_i = DM.GridsArray[i];

			    // 2. update the background (this checks if grid-showing is active)
			    grids.update_bg_grid(Grid_i);

			    // 3. Update the panel to reflect the selected grid...

			    // 3.1 - update action links
			    grids.enable_Iso_Square_Hex_for_current_grid();
			    widgets.actionLink_unset("#lines-v-grid.act-mutex", Grid_i.n_dimentions == 2);

			    // 3.2 - update input elements values
			    grids.update_all_input_elements_values(Grid_i);
			    //update referenced underlying data of 6 input boxes in this way...
			    [0,1].forEach(function(ls) {
				[{k:"spacing"}, {k:"angle"}].forEach(function(TY) {

				    //UPDATE
				    var $input = $("#line-set-"+(ls+1)+" .ls-param."+TY.k+" input").SmartInput("update", {
					underlying_obj: Grid_i.line_sets[ls]
				    });
				});
			    });

			}
		    })
	    );
	});

	// use click handler to achieve re-selection
	if(this.selected_row_i != undefined){
	    var click_me_i = this.selected_row_i;
	    this.selected_row_i = undefined;//necessary for this dummy click to cause an action.
	    $($("#grids-table tbody tr")[click_me_i]).click();
	}

	
    },


    update_all_input_elements_values: function (grid_obj){
	//ls-param.angle=angle, ls-param.spacing=spacing
	var Gx = grid_obj.line_sets;

	[0,1].forEach(function(ls) {
	    grids.update_preview_svg_angle(ls, grid_obj.line_sets[ls]["angle"]);//update the SVG
	    [{k:"spacing"}, {k:"angle"}].forEach(function(TY) {
		//UPDATE
		$("#line-set-"+(ls+1)+" .ls-param."+TY.k+" input").SmartInput("update", {data_change: true});
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

    
    previousGrid: {line_sets:[]},
    update_bg_grid: function (){

	if(grids.showing_preview){

	    var Grid_i = DM.GridsArray[this.selected_row_i];

	    this.screen_update_line_set(0);
	    this.screen_update_line_set(1, Grid_i.n_dimentions == 1);

	    //produce a deep copy of the old grid, for saving...
	    // i'm thinking this may prevent errors
	    // OK - it does not prevent errors.
	    this.previousGrid = Grid_i;
//	    this.previousGrid = jQuery.extend(true, {}, Grid_i);
	    
	}
    },


    clear_bg_grid: function (){

	if(grids.showing_preview){
	    //remove both line sets...
	    this.screen_update_line_set(0, true);
	    this.screen_update_line_set(1, true);
	    this.previousGrid = {line_sets:[]};
	}	
    },

    
    // interact with the svg....
    screen_update_line_set: function (line_set_index, b_remove){

	// 1. Setting the variables. "Diameter" is of a circle containing the rectangle of the screen. 
	var W = $(window).width();
	var H = $(window).height();	
	$("#svg-bg-fullscreen").css("width", W).css("height", H);
	
	var Grid_i = DM.GridsArray[this.selected_row_i];
	var LineSet = Grid_i.line_sets[line_set_index];
	var prev_LineSet = this.previousGrid.line_sets[line_set_index];
	
	var Dia = Math.sqrt(W*W + H*H);
	var origX = W/2;
	var origY = H/2;
	var Radius = Dia/2;
	var first = prev_LineSet == undefined;
	var neg_ang = (line_set_index == 0 ? -1 : 1);

	var LineSet_px = grids.spacing_unit_objectUpdater(LineSet, "pixels", true);

	// interval & angle - starting & target
	var inte_target = LineSet_px.spacing;
	var angle_target = LineSet.angle * neg_ang;
	var inte_starting = inte_target; // may reassign just below... hmm... consideration needed.
	if(prev_LineSet){
	    var prev_LineSet_px = grids.spacing_unit_objectUpdater(prev_LineSet, "pixels", true);
	    var inte_starting = first ? inte_target : prev_LineSet_px.spacing;
	}
	var angle_starting = first ? angle_target : (prev_LineSet.angle * neg_ang);


	// N1 is the number of lines in just the upper half
	// this is the 'target' quantity of lines.
	var N1 = Math.ceil(Radius / inte_target);
	
	var lines_class = "lines-"+(line_set_index + 1);

	// 2. Generate data to apply the D3 to, for one line set. This is an array of positive and negative indices.
	// i.e. [0, 1, -1, 2, -2, 3, -3.....]
	var lines_indices_list = [];
	if(b_remove !== true){
	    for (var i = 0; i < N1; i++){
		lines_indices_list.push(i);
		if(i != 0){
		    lines_indices_list.push(-i);
		}
	    }
	}

	//select the set of lines
	var selection = d3.select("#svg-bg-fullscreen")
	    .selectAll("."+lines_class).data(lines_indices_list);

	//if no lines have been selected....
	first = first || selection.size() == 0;

	// 3. First pass of D3, runs unconditionally: change the set to contain the correct (final) number of lines
	
	// 3.1 CREATE any lines which are absent
	// these lines will be created based upon the 'starting', not the 'target' angle and interval.
	// they will be transparent, animating to solid black
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
	    .duration(500)//this animation can be overridden by a later one, causing it to stop
	    .attr("stroke", "black");

	// 3.2 REMOVE any lines that are excess
	selection.exit()
	    .transition()
	    .duration(500)
	    .ease(d3.easeLinear) //I think 'linear' is best for opacity changes
	    .attr("stroke", "rgba(0,0,0,0)")
	    .remove();

	// 4. Second pass of D3: Animate (all the lines by now created)
	// (this will often have no impact where previous and current are the same)
	if(!first){
	    var selection = d3.select("#svg-bg-fullscreen")
		.selectAll("."+lines_class).data(lines_indices_list)
	    //first run a transition to instantaneously make them all black
		.transition()
		.duration(0)
		.attr("stroke", "black")
	    //now run a cascading & non-instantaneous transition on position+angle
		.transition()
		.delay(function(d, i) {
		    // Cascading the animation (by a variable deley) is a pretty cool effect
		    // for 'locked angle' behaviour, I think it's better if the whole grid rotates rigidly.
		    // The largest "delay multiplier" is (i/N1) = 2
		    return (i / N1) * (grids.lock_angles ? 0 : 250);
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
    },


    PointSet: {},
    gen_grid_intersection_points: function(){

	// function can only operate if a Grid is selected...
	if(this.selected_row_i === undefined){return;}


	
	// 1. Calculate the Basis vectors

	var grid_obj = DM.GridsArray[this.selected_row_i];
	var S1 = this.spacing_unit_objectUpdater(grid_obj.line_sets[0], "pixels", true);
	var S2 = this.spacing_unit_objectUpdater(grid_obj.line_sets[1], "pixels", true);

	var ang1 = S1.angle * 2 * Math.PI / 360;
	var ang2 = S2.angle * 2 * Math.PI / 360;

	//vector parallel to a LS 1 lines
	var q = S2.spacing / Math.sin(ang1 + ang2);
	var Q_x = q * Math.cos(ang1);
	var Q_y = - q * Math.sin(ang1);

	//vector parallel to a LS 2 lines
	var p = S1.spacing / Math.sin(ang1 + ang2);
	var P_x = p * Math.cos(ang2);
	var P_y = p * Math.sin(ang2);



	// 2. Define a variety of helper functions for handling the data...
 	var set = function(Pi,Qi,A){
	    grids.PointSet[Pi+'^'+Qi] = A;
	};
 	var get = function(Pi,Qi){
	    return grids.PointSet[Pi+'^'+Qi];
	};

	var winW = $(window).width();
	var winH = $(window).height();

	var origX = winW/2;
	var origY = winH/2;

 	var convert = function(Pi,Qi){
	    return {x: (origX + P_x*Pi + Q_x*Qi), y: (origY + P_y*Pi + Q_y*Qi)};
	};
	

	var test = function(Pi,Qi){
	};


	var rGen = function(Pi,Qi){

	    //the point tested may be:
	    // undefined - never yet visited
	    // true - visited already, and found to be in the set
	    // false - visited already, not in the set
	    var Here = get(Pi,Qi);

	    if(Here === undefined){
		// Is this point (passed by P-index and Q-index) inside the window? 
		var pnt = convert(Pi,Qi);
		var p_inside = (pnt.x >= 0) && (pnt.x < winW) && (pnt.y >= 0) && (pnt.y < winH);
		
		set(Pi, Qi, p_inside ? pnt : false);

		if(p_inside == true){
		    //4 recursive calls...
		    rGen(Pi+1, Qi);
		    rGen(Pi-1, Qi);
		    rGen(Pi, Qi+1);
		    rGen(Pi, Qi-1);
		}
	    }
	};

	//trigger a recursive call...
	rGen(0,0);

	var my_monkey = [];
	$.each( grids.PointSet, function( key, value ) {

	    //some entries will represent points found to be outside boundary.
	    if (value === false){return;}

	    my_monkey.push(value);

	    d3.select("#svg-bg-fullscreen")
		.append("circle")
		.attr("cx", value.x)
		.attr("cy", value.y)
		.attr("r", 3)
		.attr("fill", "red")
		.attr("stroke","black")
		.attr("stroke-width","1")
		.attr("class","intesec-dot");

	});

	//reset the pointset
	this.PointSet = {};
	
    }

};
