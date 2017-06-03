import * as d3 from "d3";

var Grid_d3draw = {

/*
    previousGrid: {line_sets:[]},
    grid_change: function (options){
	options = options || {};

	//Adjust the appearance of the 'action links'...
	//postpone function call, so it overrides the MutexActionLink default behaviour
	setTimeout(function(){
	    grids.setMutexState_iso_squ_dia();
	}, 10);
	    
	if(grids.showing_preview){

	    var Grid_i = DM.gridArray[this.selected_row_i];

	    this.screen_update_line_set(0, options.hide);
	    this.screen_update_line_set(1, options.hide || Grid_i.n_dimentions === 1);

	    //produce a deep copy of the old grid, for saving...
	    // i'm thinking this may prevent errors
	    // OK - it does not prevent errors.

	    // Why does the line below work???!!
	    this.previousGrid = options.hide ? {line_sets:[]} : Grid_i;
//	    this.previousGrid = jQuery.extend(true, {}, Grid_i);

	    //may update points, and will certainly hide them if required.
	    var ops = options.hide ? {display: false} : undefined;
	    this.update_grid_intersection_points(ops);
	    
	}
    },
*/
    
    
    // interact with the svg....
    /*
      'Grid', 'previousGrid' - these parameters may be null for new appearance / disappearance...
       */
    updatLineset: function (svg, Grid, previousGrid, line_set_index, b_remove, options){
	
	// 1. Setting the variables. "Diameter" is of a circle containing the rectangle of the screen. 
	const winW = window.innerWidth;
	const winH = window.innerHeight;
	
	var prev_LineSet = previousGrid !== null ?  previousGrid.line_sets[line_set_index] : undefined;
	var LineSet = Grid ? Grid.line_sets[line_set_index] : prev_LineSet;
	
	b_remove = b_remove || (!(Grid && true));
	
	var Dia = Math.sqrt(winW*winW + winH*winH);
	var origX = winW/2;
	var origY = winH/2;
	var Radius = Dia/2;
	var first = (prev_LineSet === undefined) || (line_set_index === 1 && this.previousGrid.n_dimentions === 1);
	var neg_ang = (line_set_index === 0 ? -1 : 1);


	//this assumes LineSet is always pixels!
	var LineSet_px = LineSet;////////grids.spacing_unit_objectUpdater(LineSet, "pixels", true);
	
	
	// interval & angle - starting & target
	var inte_target = LineSet_px.spacing;
	var shift_target = LineSet_px.shift * 0.01 * inte_target;//convert to pixels (frac of inte, in px)
	var angle_target = LineSet.angle * neg_ang;
	

	// commenting herewith assumes LineSet is always pixels!
	if(prev_LineSet){
	    var prev_LineSet_px = prev_LineSet;//grids.spacing_unit_objectUpdater(prev_LineSet, "pixels", true);
	}


	var inte_starting = first ?  inte_target  : prev_LineSet_px.spacing;
	var angle_starting = first ? angle_target : (prev_LineSet.angle * neg_ang);
	var shift_starting = first ? shift_target : (prev_LineSet.shift * 0.01 * inte_starting);//convert to pixels

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
		if(i !== 0){
		    lines_indices_list.push(-i);
		}
	    }
	}
	
	// Perform a JOIN opeation between data and lines
	var selection = d3.select(svg)
	    .selectAll("."+lines_class).data(lines_indices_list);
	
	// 3. First pass of D3, runs unconditionally: change the set to contain the correct (final) number of lines
	
	// 3.1 CREATE any lines which are absent
	// these lines will be created based upon the 'starting', not the 'target' angle and interval.
	// they will be transparent, animating to solid black
	selection.enter()
	    .append("line").attr("class", lines_class)
	    .attr("x1", -Radius)
	    .attr("x2", +Radius)
	    .attr("y1", function(d){return d*inte_starting + shift_starting;})
	    .attr("y2", function(d){return d*inte_starting + shift_starting;})
	    .attr("transform", "translate("+origX+" "+origY+") rotate("+angle_starting+")")
	    .attr("stroke", "rgba(0,0,0,0)")
	    .attr("stroke-width","1");
	
	// 3.2 REMOVE any lines that are excess
	selection.exit()
	    .transition()
	    .duration(500)
	    .ease(d3.easeLinear) //I think 'linear' is best for opacity changes
	    .attr("stroke", "rgba(0,0,0,0)")
	    .remove();

	
	// 4. Second pass of D3: Animate (all the lines by now created)
	
	// Perform another JOIN opeation between data and lines. This will pick up every line, newly added and old.
	// joining the new data is necessary because what we don't want to pick up is old lines that are fading out
	var reselection = d3.select(svg)
	    .selectAll("."+lines_class).data(lines_indices_list);

	//first run a transition to instantaneously make them all black
	reselection
	    .transition()
	    .duration(first ? 500 : 0)
	    .ease(d3.easeLinear)
	    .attr("stroke", "black")
	//now run a cascading & non-instantaneous transition on position+angle
	    .transition()
	    .delay(function(d, i) {
		// Cascading the animation (by a variable deley) is a pretty cool effect
		// for 'locked angle' behaviour, I think it's better if the whole grid rotates rigidly.
		// The largest "delay multiplier" is (i/N1) = 2
		return (i / N1) * (options.lock_angles ? 0 : 250);
	    })
	    .duration(500)
	    .attr("y1", function(d){return d*inte_target + shift_target;})
	    .attr("y2", function(d){return d*inte_target + shift_target;})
	    .attr("transform", "translate("+origX+" "+origY+") rotate("+angle_target+")");

    }

}



export {Grid_d3draw as default};
