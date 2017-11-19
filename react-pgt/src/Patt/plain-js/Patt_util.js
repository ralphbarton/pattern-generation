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

    connectMotifLinksToPatt: function(Motif, PattLinks){

	// Working under the assumption (as in "putPatternSVG") of just one motif. Extract its linked params here...

	/* 1. In a MOTF object, the array of parameters looks like this.
	   Params: [
	   {
	   id: 0,
	   type: 0, //link
	   name: "LP01",
	   min: 30,
	   max: 75
	   }
	*/
	const Motf_link_Params = _.filter(Motif.Params , {type: 0}); // of just 1 motif

	/* 1. In a PATT object, the array of (linked) parameters looks like this.
	   links: [
	   {
	   motf: 0, // uid
	   parameter: 0, //uid
	   type: "plot", 
	   target_uid: 8 // uid of the plot
	   }
	*/
	
	return _.map( Motf_link_Params, mlp => {

	    const Patt_lp = _.find(PattLinks, {motf: Motif.uid, parameter: mlp.id} ) || {};

	    /* in case where there is nothing in Patt corresponding with a Motif param, 
	       'type' and 'target_uid' attributes will be undefined (taken from an empty object)
	    */
	    
	    return {
		name: mlp.name, // parameter's name within the motif (will appear in formula strings)
		min: mlp.min,
		max: mlp.max,
		type: Patt_lp.type, 
		target_uid: Patt_lp.target_uid
	    };
	})
    },    
    
    putPatternSVG: function(svg_el, Pointset, Motif, motif_props, PlotImgCache, PattLinks){

	const d3_svg = select(svg_el);
	d3_svg.selectAll("*").remove();

	if(!Pointset){return;}// passing a null pointset will trigger svg clear only

	// the 'motif' has "dangling links". The 'pattern' associates these to particular densities/plots.
	const MotifConnectedLinks = this.connectMotifLinksToPatt(Motif, PattLinks);
	
	// An approach that does not use the svg <use> element - there's going to be lots more repetition in the SVG
	_.each(Pointset, p => {

	    var svg_Grp = d3_svg.append("g");
	    
	    /*
	      todo: the work can happen here to extract the values from the motif
	    */

	    const p_x = Math.round(p.x);
	    const p_y = Math.round(p.y);
	    
	    const linkedParam_KVPs = {};
	    MotifConnectedLinks.forEach( P => {

		let R;
		if(P.type === "plot"){

		    // extract ImgData from cache...
		    const Cached4Plot = PlotImgCache[P.target_uid];
		    if(!Cached4Plot){return;} // abort if no data retrieved (seems to sometimes happen when new Plot added)

		    const ImgData = Cached4Plot.ImgData.single["greyscale"]; //width, height, data

		    const outsideB = p_x >= ImgData.width || p_x < 0 || p_y >= ImgData.height || p_y < 0;
		    const pixel_index = (p_x + ImgData.width*p_y) * 4;

		    // use a default value of 0.5 if outside bounds.
		    // (a more sophisticated behaviour in this case would be to take the closest value inside bounds...)
		    const redPixel = ImgData.data[pixel_index];
		    R = outsideB ? 0.5 : redPixel/255;

		}else{// this will be for density paintings....

		}

		    
		linkedParam_KVPs[P.name] = P.min + R * (P.max-P.min);
	    });	    

	    
	    Motf_util.putMotifSVG(svg_Grp.node(), Motif, linkedParam_KVPs);

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
