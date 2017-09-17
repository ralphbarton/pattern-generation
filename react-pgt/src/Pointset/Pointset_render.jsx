import React from 'react';

import * as d3 from "d3";

class Pointset_render extends React.PureComponent {

    update(options){
	options = options || {};
	
	// 1. All the existing dots just need to fade out. get rid of them all.
	d3.select("#grids-bg-svg").selectAll(".dot")
	    .attr("class","vanishing")
	    .transition()
	    .duration(500)
	    .attr("r", 0)
	    .remove();

	// 2. get the new data. This may mean an empty array depending upon boolean 'display'
	var display = options.display !== undefined ? options.display : this.showingIntersectionPoints;
	this.showingIntersectionPoints = display;
	
	var myIntersectionPoints = display ? this.props.points : [];


	// 3. Animate in the appearance of all the new dots... ( 'enter()', because all will be new.)
	d3.select("#grids-bg-svg").selectAll(".dot").data(myIntersectionPoints).enter()
	    .append("circle").attr("class","dot")
	    .attr("cx", function(d){return d.x;})
	    .attr("cy", function(d){return d.y;})
	    .attr("r", 0)
	    .attr("fill", "red")
	    .attr("stroke","black")
	    .attr("stroke-width","1")
	    .transition()
	    .duration(500)
	    .attr("r", 3);
	
    }

    
    render() {
	return(
	    <svg
	       style={{
		   width:  100,
		   height:  100,
		   background: "green"
	       }}
	       />
	);
    }
}

export default Pointset_render;
