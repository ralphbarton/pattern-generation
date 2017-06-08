import * as d3 from "d3";
import update from 'immutability-helper';
import Grid_util from './Grid_util';

var Grid_d3draw = {


    randomiseColourSet: function(){

	//these 8 colours are dark enough to show up well on a white background
	const rColours = ["#009a00","#c6001c","#006ebd","#da7a00","#00b7a3","#7300df","#be00c0","#93ad00"].map((e)=>{
	    return {
		col: e,
		rI: Math.random()
	    };
	});
	
	//randomise the order...
	rColours.sort(function (a,b) {
	    if (a.rI < b.rI){return -1;}
	    if (a.rI > b.rI){return 1; }
	    return 0;
	});

	//set persistent object
	this.rColours = rColours.map((e)=>{return e.col});
    },


    lsToPx: function (LineSet){
	return update(LineSet, {
	    spacing: {$set: Grid_util.convertSpacingUnit(LineSet, 'pixels')},
	    spacing_unit: {$set: 'pixels'} 
	});
    },

    //adds the grids uid and the lineset index into the object returned, if non-null.
    getLS: function (Grid, lsIndex){
	if(!Grid){return null;}
	if((Grid.n_dimentions === 1) && (lsIndex === 1)){return null;}
	return update(
	    this.lsToPx(Grid.line_sets[lsIndex]),
	    {uid: {$set: Grid.uid}, lsIndex: {$set: lsIndex}}
	);
    },

    updateBgGrid: function (svgRef, Grid, pGrid, options){

	const svg = d3.select(svgRef);
	
	const LS0 = this.getLS(Grid, 0);
	const prevLS0 = this.getLS(pGrid, 0);
	this.updateLineset(svg, LS0, prevLS0, options);

	const LS1 = this.getLS(Grid, 1);
	const prevLS1 = this.getLS(pGrid, 1);
	this.updateLineset(svg, LS1, prevLS1, options);

    },

    
    // D3 modifies SVG contents from last time...
    updateLineset: function (d3_svg, Lineset, prevLineset, options){
	if(Lineset === null && prevLineset == null){return;}
	
	/*
	  {options} include:

	  'selGridUid'
	  'lockAngles'
	  'showColourGrids'
	 */
	
	
	// 1. Determine what kind of update is required...
	const fromBlank = prevLineset === null;
	const fadeOut = Lineset === null;
	const isSelGrid = (!fadeOut) && options.selGridUid === Lineset.uid;
	const isCol = options.showColourGrids;
	const strokeColour = ((!fadeOut) && isCol) ? (this.rColours[Lineset.uid % 8]) : (isSelGrid ? "black" : "#cccccc");
	const strokeTargetOpac = isSelGrid || (! isCol) ? 1 : 0.7;
	const strokeThickness = (isSelGrid && isCol) ? 1.5 : 1;	
	
	// 2. Setting the dimentional. "Diameter" is of a circle containing the rectangle of the screen. 
	const winW = window.innerWidth;
	const winH = window.innerHeight;
	
	const Dia = Math.sqrt(winW*winW + winH*winH);
	const origX = winW/2;
	const origY = winH/2;
	const Radius = Dia/2;

	
	// interval & angle - starting & target
	if(!fadeOut){
	    var neg_ang = Lineset.lsIndex === 0 ? -1 : 1;
	    var inte_target = Lineset.spacing;
	    var shift_target = Lineset.shift * 0.01 * inte_target;//convert to pixels (frac of inte, in px)
	    var angle_target = Lineset.angle * neg_ang;

	    var inte_starting = fromBlank ?  inte_target  : prevLineset.spacing;
	    var angle_starting = fromBlank ? angle_target : (prevLineset.angle * neg_ang);
	    var shift_starting = fromBlank ? shift_target : (prevLineset.shift * 0.01 * inte_starting);//convert to pixels
	}

	// 3. Generate data to apply the D3 to, for one line set. This is an array of positive and negative indices.
	// N1 is the number of lines in just the upper half. It is the 'target' quantity of lines.
	var N1 = Math.ceil(Radius / inte_target);

	// i.e. [0, 1, -1, 2, -2, 3, -3.....]
	var lines_indices_list = [];
	if(fadeOut !== true){
	    for (var i = 0; i < N1; i++){
		lines_indices_list.push(i);
		if(i !== 0){
		    lines_indices_list.push(-i);
		}
	    }
	}
	
	// 4. First pass of D3, runs unconditionally: change the set to contain the correct (final) number of lines
	
	// Perform a JOIN opeation between data and lines
	const lsClass = "ls-" + (fadeOut ? prevLineset.lsIndex : Lineset.lsIndex);

	var selection = d3_svg
	    .selectAll('.'+lsClass).data(lines_indices_list);	
	
	// 4.1 CREATE any lines which are absent
	// these lines will be created based upon the 'starting', not the 'target' angle and interval.
	// they will be transparent, animating to solid black
	selection.enter()
	    .append("line").attr("class", lsClass)
	    .attr("x1", -Radius)
	    .attr("x2", +Radius)
	    .attr("y1", function(d){return d*inte_starting + shift_starting;})
	    .attr("y2", function(d){return d*inte_starting + shift_starting;})
	    .attr("transform", "translate("+origX+" "+origY+") rotate("+angle_starting+")")
	    .attr("stroke", strokeColour)
	    .attr("opacity", 0)
	    .attr("stroke-width", strokeThickness);
	
	// 4.2 REMOVE any lines that are excess
	selection.exit()
	    .transition()
	    .duration(500)
	    .ease(d3.easeLinear) //I think 'linear' is best for opacity changes
	    .attr("opacity", 0)
	    .remove();

	
	// 5. Second pass of D3: Animate (all the lines by now created)
	
	// Perform another JOIN opeation between data and lines. This will pick up every line, newly added and old.
	// joining the new data is necessary because what we don't want to pick up is old lines that are fading out
	var reselection = d3_svg
	    .selectAll('.'+lsClass).data(lines_indices_list);

	//first run a transition to instantaneously make them all opacity=1
	reselection
	    .transition()
	    .duration(fromBlank ? 500 : 0)
	    .ease(d3.easeLinear)
	    .attr("opacity", strokeTargetOpac)
	    .attr("stroke", strokeColour)
	    .attr("stroke-width", strokeThickness)
	//now run a cascading & non-instantaneous transition on position+angle
	    .transition()
	    .delay(function(d, i) {
		// Cascading the animation (by a variable deley) is a pretty cool effect
		// for 'locked angle' behaviour, I think it's better if the whole grid rotates rigidly.
		// The largest "delay multiplier" is (i/N1) = 2
		return (i / N1) * (options.lockAngles ? 0 : 250);
	    })
	    .duration(500)
	    .attr("y1", function(d){return d*inte_target + shift_target;})
	    .attr("y2", function(d){return d*inte_target + shift_target;})
	    .attr("transform", "translate("+origX+" "+origY+") rotate("+angle_target+")");

    }

}



export {Grid_d3draw as default};
