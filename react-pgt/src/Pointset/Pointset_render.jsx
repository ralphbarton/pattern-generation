import React from 'react';

import * as d3 from "d3";

class Pointset_render extends React.PureComponent {

    update(){
	
	// 1. All the existing dots just need to fade out. get rid of them all.
	d3.select(this.svgElement).selectAll(".dot")
	    .attr("class","vanishing")
	    .transition()
	    .duration(500)
	    .attr("r", 0)
	    .remove();

	var myIntersectionPoints = this.props.hide ? [] : this.props.points;

	// 2. Animate in the appearance of all the new dots... ( 'enter()', because all will be new.)
	d3.select(this.svgElement).selectAll(".dot").data( myIntersectionPoints ).enter()
	    .append("circle").attr("class","dot")
	    .attr("cx", function(d){return d.x;})
	    .attr("cy", function(d){return d.y;})
	    .attr("r", 0)
	    .attr("fill", this.props.colouring === 1 ? "red" : "cyan")
	    .attr("stroke","black")
	    .attr("stroke-width","1")
	    .transition()
	    .duration(500)
	    .attr("r", 3);	
    }

    componentDidUpdate(){
	this.update();
    }

    componentDidMount(){
	this.update();
    }

    
    render() {
	const winW = window.innerWidth;
	const winH = window.innerHeight;
	return(
	    <svg
	       style={{
		   width:  winW,
		   height:  winH
	       }}
	       ref={ (el) => {this.svgElement = el;}}
	       />
	);
    }
}

export default Pointset_render;
