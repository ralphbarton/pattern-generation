import React from 'react';
import * as d3 from "d3";

class MotfEdit_Section_MotifCanvas_GD extends React.PureComponent {

    bgGridAxesMount(){

	//can this be defined a bit more globally??
	const CartesianGridSizes = [10, 25, 50];
	const SVG = this.svgRef;
	
	// INITIATE the SVG gridlines under the canvas... 
	var draw_4_lines = function(my_set, offset){
	    d3.select(SVG).select(my_set)
		.append('line')// pos vertical
		.attr("x1", 199.5 + offset)
		.attr("y1", 0)
		.attr("x2", 199.5 + offset)
		.attr("y2", 399);

	    d3.select(SVG).select(my_set)
		.append('line')// pos horizontal
		.attr("x1", 0)
		.attr("y1", 199.5 + offset)
		.attr("x2", 399)
		.attr("y2", 199.5 + offset);

	    if(offset !== 0){
		d3.select(SVG).select(my_set)
		    .append('line')// neg vertical
		    .attr("x1", 199.5 - offset)
		    .attr("y1", 0)
		    .attr("x2", 199.5 - offset)
		    .attr("y2", 399);

		d3.select(SVG).select(my_set)
		    .append('line')// neg horizontal
		    .attr("x1", 0)
		    .attr("y1", 199.5 - offset)
		    .attr("x2", 399)
		    .attr("y2", 199.5 - offset);
	    }

	};

	var draw_grid = function(size, size_str){
	    for (var i = 0; i < 400 ; i += size){
		draw_4_lines("g.gridlines g.cartesian g."+size_str, i);
	    }
	};

	draw_grid(CartesianGridSizes[0], "small");
	draw_grid(CartesianGridSizes[1], "medium");
	draw_grid(CartesianGridSizes[2], "large");


	var draw_circles = function(size, size_str){
	    for (var i = size; i <= 200 ; i += size){
		d3.select(SVG).select("g.gridlines g.polar g." + size_str)
		    .append('circle')
		    .attr("cx", 199.5)
		    .attr("cy", 199.5)
		    .attr("r", i);
	    }
	};

	draw_circles(25, "small");
	draw_circles(50, "medium");
	draw_circles(100, "large");

	var draw_diagonal_lines = function(size, size_str){
	    for (var i = 0; i < 180 ; i += size){
		d3.select(SVG).select("g.gridlines g.polar g." + size_str)
		    .append('line')
		    .attr("x1", 199.5 - 300)
		    .attr("y1", 199.5)
		    .attr("x2", 199.5 + 300)
		    .attr("y2", 199.5)
		    .attr("transform", "rotate("+i+" 199.5 199.5)");
	    }
	};

	draw_diagonal_lines(15, "small");
	draw_diagonal_lines(45, "medium");
	draw_diagonal_lines(90, "large");
    }
    
    bgGridAxesUpdate(){

	const SVG = this.svgRef;
	const UI = this.props.CC_UI;

	// overall visiblity of Axes & Grid
	d3.select(SVG).select("g.axes").classed("hidden", !UI.axes);
	d3.select(SVG).select("g.gridlines").classed("hidden", !UI.gridlines);
	
	// update (set) Grid Systen
	d3.select(SVG).select("g.gridlines g.cartesian").classed("hidden", UI.gridSystem !== "cartesian");
	d3.select(SVG).select("g.gridlines g.polar").classed("hidden", UI.gridSystem !== "polar");

	// update (set) Grid Size
	d3.select(SVG).selectAll("g.gridlines g.small").classed("hidden", UI.gridSize !== "small");
	d3.select(SVG).selectAll("g.gridlines g.medium").classed("hidden", UI.gridSize !== "medium");
	d3.select(SVG).selectAll("g.gridlines g.large").classed("hidden", UI.gridSize !== "large");
	
	// update (set) Grid Weight
	d3.select(SVG).select("g.gridlines").classed("faint", UI.gridWeight === "faint");
	d3.select(SVG).select("g.gridlines").classed("strong", UI.gridWeight === "strong");

    }

    componentDidMount(){
	this.bgGridAxesMount();
	this.bgGridAxesUpdate();
    }

    
    componentDidUpdate(){
	this.bgGridAxesUpdate();
    }

    
    render(){

	const UI = this.props.CC_UI;
	
	return (
	    <svg
	       className={"bgAxesAndGrid" + (UI.backgroundBTTW === 3 ? " dark" : "")}
	       width={399}
	       height={399}
	       ref={ (el) => {this.svgRef = el;}}>
				    <g className="gridlines">
				      {/* 3× cartesian grids */}
				      <g className="cartesian">
					<g className="small"></g>
					<g className="medium"></g>
					<g className="large"></g>
				      </g>
				      {/* 3× plar grids */}
				      <g className="polar">
					<g className="small"></g>
					<g className="medium"></g>
					<g className="large"></g>
				      </g>
				    </g>

				    <g className="axes">
				      <line x1="199.5" y1="0" x2="199.5" y2="399" /> {/* vertical */}
				      <line x1="0" y1="199.5" x2="399" y2="199.5" /> {/* horizontal */}
				    </g>

</svg>
	);
    }
}

export default MotfEdit_Section_MotifCanvas_GD;
