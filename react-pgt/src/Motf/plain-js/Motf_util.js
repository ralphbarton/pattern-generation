import * as d3 from "d3";
var _ = require('lodash');

var Motf_util = {

/*
    motf_Add: function(){
	var qty_new = $.grep(this.motfArray, function(e){ return e.Name.includes("New Mtf"); }).length + 1;

	//it will be 50% a circle, 50% a rectangle...
	var isCircle = Math.random() > 0.5;
	var Motif_Element_One = {
	    "shape": isCircle ? "obj-ellipse" : "obj-rectangle",
	    "left": isCircle ? 0 : 50,
	    "top": isCircle ? 0 : 50,
	    "fill": tinycolor.random().toHexString(),
	    "stroke": null,
	    "PGTuid": 0
	};
	
	if(isCircle){
	    Motif_Element_One["rx"] = 200;
	    Motif_Element_One["ry"] = 200;	    
	}else{
	    Motif_Element_One["width"]  = 300;
	    Motif_Element_One["height"] = 300;	    
	}
	
	this.motfArray.push({
	    Name: "New Motif",
	    uid: this.uid.createNew("motf"),
	    Params: {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    Elements: [Motif_Element_One]
	});
	return this.motfArray.length - 1;//return index of newly added element
    },
*/
    
    newRandomMotif: function(){

	return {};
    },


    putMotifSVG: function(svg_el, Motif, options){

	const d3_svg = d3.select(svg_el);
	d3_svg.selectAll("*").remove();


	// todo: determine what is the point of this param....
	var center_zero = false;

	// Iterate over the shapes of the Motif (its Elements)
	_.forEach(Motif.Elements, function(E, key) {//E is element properties object

	    //	    console.log(i, JSON.stringify(E, null, 2));
	    var E_x = E.left + (center_zero ? -200 : 0);
	    var E_y = E.top + (center_zero ? -200 : 0);
	    
	    //Create an Ellipse
	    if(E.shape === "obj-ellipse"){
		
		//an angle may not be in data passed...
		d3_svg.append("ellipse").attr("class","some-obj")
		    .attr("cx", E_x + E.rx)
		    .attr("cy", E_y + E.ry)
		    .attr("rx", E.rx)
		    .attr("ry", E.ry)
		    .style("fill", E.fill)
		    .attr("transform", "rotate("+(E.angle||0)+", "+E_x+", "+E_y+")")
		    .style("stroke", E.stroke);
		
	    }else if(E.shape === "obj-rectangle"){
		
		//Create a Rectangle
		d3_svg.append("rect").attr("class","some-obj")
		    .attr("x", E_x)
		    .attr("y", E_y)
		    .attr("width", E.width)
		    .attr("height", E.height)
		    .style("fill", E.fill)
		    .attr("transform", "rotate("+(E.angle||0)+", "+E_x+", "+E_y+")")
		    .style("stroke", E.stroke);

	    }


	    
	    
	});

	
    }
    


    /*
    CreateMotifSVG: function(Motif, options){


//	  Options:

//	  d3_selection - a new SVG element (within a DIV) gets created and returned, if 
//	  no d3 selection is provided...
	  
//	  dim - the dimention...

	
	options = options || {};

	var d3_selection;
	var center_zero = false;
	if(options.d3_selection != undefined){
	    d3_selection = options.d3_selection
	    center_zero = true;
	    
	}else{
	    var $svg_container = $("<div/>")
	    d3_selection = d3.select($svg_container[0]).append("svg")
		.attr("width", options.dim)
		.attr("height", options.dim)
		.attr("viewBox", "0 0 400 400");
	}
	    
	$.each( Motif.Elements, function(i, E) {//E is element properties object

	    //	    console.log(i, JSON.stringify(E, null, 2));
	    var E_x = E.left + (center_zero ? -200 : 0);
	    var E_y = E.top + (center_zero ? -200 : 0);
	    
	    //Create an Ellipse
	    if(E.shape == "obj-ellipse"){
		
		//an angle may not be in data passed...
		d3_selection.append("ellipse").attr("class","some-obj")
		    .attr("cx", E_x + E.rx)
		    .attr("cy", E_y + E.ry)
		    .attr("rx", E.rx)
		    .attr("ry", E.ry)
		    .style("fill", E.fill)
		    .attr("transform", "rotate("+(E.angle||0)+", "+E_x+", "+E_y+")")
		    .style("stroke", E.stroke);
		
	    }else if(E.shape == "obj-rectangle"){
		
		//Create a Rectangle
		d3_selection.append("rect").attr("class","some-obj")
		    .attr("x", E_x)
		    .attr("y", E_y)
		    .attr("width", E.width)
		    .attr("height", E.height)
		    .style("fill", E.fill)
		    .attr("transform", "rotate("+(E.angle||0)+", "+E_x+", "+E_y+")")
		    .style("stroke", E.stroke);

	    }


	});
	
	return $svg_container;

    }
*/

}



export {Motf_util as default};
