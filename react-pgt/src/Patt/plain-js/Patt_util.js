var _ = require('lodash');

import {select} from "d3-selection";
import "d3-selection-multi";

import Motf_util from '../../Motf/plain-js/Motf_util';

var Patt_util = {

    newEmptyPattern: function(){
	return {//default data
	    name: "New Pattern",
	    /*uid:  (added later)  */
	    Motif_set: [],
	    grid_uid: undefined,
	    plot_uid: undefined,
	    paint_uid: undefined
	};
    },

    putPatternSVG: function(svg_el, Pointset, Motif, motif_props){

	const d3_svg = select(svg_el);
	d3_svg.selectAll("*").remove();

	if(!Pointset){return;}// passing a null pointset will trigger svg clear only
	
	// An approach that does not use the svg <use> element - there's going to be lots more repetition in the SVG
	_.each(Pointset, p => {

	    var svg_Grp = d3_svg.append("g");
	    Motf_util.putMotifSVG(svg_Grp.node(), Motif);

	    //the point object is just {x:123, y:456}
	    svg_Grp
		.attr("transform", `translate(${p.x} ${p.y}) rotate(${motif_props.angle}) scale(${motif_props.scale})`)
		.attr("opacity", motif_props.opacity);
	});

	/*
	// create a <defs> element in the SVG, contatining one group element... 
	const mID = 34;
	var svg_sub_el = d3_svg.append("defs").attr("class", "pattern_pid").append("g").attr("id", mID).node();

	// put the motif into <defs>
	Motf_util.putMotifSVG(svg_sub_el, Motif, {originZero: true});
	
	//Add all data afresh...
	d3_svg.append("g").attr("class", "pattern_pid")
	    .selectAll("use") //there will, however, be none
	    .data(Pointset)
	    .enter()
	    .append("use")
	    .attr("class","live")
	    .attr("xlink:href", "#"+mID)
	    .attr("transform", function(d){
		return "translate("+d.x+" "+d.y+") rotate(" + motif_props.angle + ") scale(" + motif_props.scale + ")";
	    })
	    .attr("opacity", motif_props.opacity);
	*/
    }
}



export {Patt_util as default};
