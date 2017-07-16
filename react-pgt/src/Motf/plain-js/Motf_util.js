import * as d3 from "d3";
var _ = require('lodash');


import {fabric}  from 'fabric';

//query split this file up??


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

	
    },


    Fabric_AddShape: function(canvas, props){
	
	// create a rectangle object
	var new_shape = undefined;
	if(props.shape === "obj-ellipse"){//circle
	    new_shape = new fabric.Ellipse({
		left: props.left,
		top: props.top,
		fill: props.fill,
		rx: props.rx,
		ry: props.ry,
		stroke: (props.strokeWidth !== undefined) ? props.stroke : null,
		strokeWidth: props.strokeWidth || null
	    });

	}else if(props.shape === "obj-rectangle"){//rectangle
	    new_shape = new fabric.Rect();

	}else if(props.shape === "obj-triangle"){//triangle
	    new_shape = new fabric.Triangle();

	}else if(props.shape === "obj-hexagon"){//hexagon
	    var W1 = 0.5 * props.width;
	    var W2 = 0.5 * props.height / 0.866;
	    var Wm = Math.min(W1, W2);
	    var Wh = Wm * 0.866;

	    // 'macro' to generate an offset coordinate
	    var OC = function(x,y){
		return {x: x, y: y};
	    };

	    new_shape = new fabric.Polygon(
		[
		    OC(0.5*Wm, 0),//1
		    OC(1.5*Wm, 0),
		    OC(2*Wm, Wh),
		    OC(1.5*Wm, 2*Wh),//4
		    OC(0.5*Wm, 2*Wh),
		    OC(0, Wh)
		], {
		    left: props.left,
		    top: props.top,
		    fill: props.fill
		}
	    );


	}else if(props.shape === "obj-line"){//line
	    new_shape = new fabric.Line();
	    new_shape.set({
		strokeWidth: props.strokeWidth,
		stroke: 'black',
	    });

	}

	if((props.shape === "obj-rectangle")||(props.shape === "obj-triangle")||(props.shape === "obj-line")){
	    new_shape.set({
		left: props.left,
		top: props.top,
		fill: props.fill,
		stroke: (props.strokeWidth !== undefined) ? props.stroke : null, //Fabric assumes strokeWidth 1 if stroke supplied
		strokeWidth: props.strokeWidth || null,// undefined causes problems but null OK!
		width: props.width,
		height: props.height
	    });
	}

	if(props.angle){
	    new_shape.set({angle: props.angle});
	}

	//set UID according to value provided.
	new_shape.PGTuid = props.PGTuid;
	
	// "add" rectangle onto canvas
	canvas.add(new_shape);
	
    }

}


export {Motf_util as default};
