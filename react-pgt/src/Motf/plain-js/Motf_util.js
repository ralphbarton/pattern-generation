import {select} from "d3-selection";
import "d3-selection-multi";

var _ = require('lodash');
import tinycolor from 'tinycolor2';

import {fabric}  from 'fabric';

import Motf_lists from './Motf_lists';

//query split this file up??


var Motf_util = {
    
    newRandomMotif: function(){

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
	

	return {
	    name: "New Motif",
	    Params: {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    Elements: [Motif_Element_One]
	};
    },


    putMotifSVG: function(svg_el, Motif, options){

	const d3_svg = select(svg_el);
	d3_svg.selectAll("*").remove();

	// Iterate over the shapes of the Motif (its Elements)
	_.forEach(Motif.Elements, function(E, key) {//E is element properties object

	    // This is a hack...
	    // in the sense that key-conversion should be handled elsewhere...
	    if( E["strokeWidth"] ){ E["stroke-width"] = E["strokeWidth"]; }

	    // further tweaking of properties format to suit the d3 requirements on object properties

	    // put the origin in the middle of the Image (other ways to do this in an SVG?)
	    // I don't think this is a final solution, below...
	    E["x"] = E.left - (options.originZero ? 200 : 0);
	    E["y"] = E.top  - (options.originZero ? 200 : 0);

	    E["transform"] = "rotate("+(E.angle||0)+", "+E.x+", "+E.y+")";

	    // ellipse is positioned by its center point (these props are for ellipse only)
	    E["cx"] = E.x + E.rx;
	    E["cy"] = E.y + E.ry;

	    //Create an Ellipse
	    if(E.shape === "obj-ellipse"){

		
		//an angle may not be in data passed...
		d3_svg.append("ellipse").attr("class","some-obj")
		// some properties can be utilised verbatim (d3/svg attrs)
		    .attrs( _.pick(E, ["cx", "cy", "rx", "ry", "transform"]))
		// some properties can be utilised verbatim (d3/svg styles)
		    .styles( _.pick(E, ["fill", "stroke", "stroke-width"]) );
		
	    }else if(E.shape === "obj-rectangle"){
		
		//Create a Rectangle
		d3_svg.append("rect").attr("class","some-obj")
		// some properties can be utilised verbatim (d3/svg attrs)
		    .attrs( _.pick(E, ["x", "y", "width", "height", "transform"]))
		// some properties can be utilised verbatim (d3/svg styles)
		    .styles( _.pick(E, ["fill", "stroke", "stroke-width"]) );

	    }	    
	    
	});

	
    },


    // generate Fabric object from object saved in DatH
    Fabric_AddShape: function(canvas, props){

	const ShapeDetails = _.find(Motf_lists.ObjectTypes, {DatH_name: props.shape} );
	var new_shape = undefined;
	
	if(ShapeDetails.fabricKey){ // test if this shape has a Fabric key stored with...
	    // its a native Fabric shape

	    // Every Fabric key is the string used as its DatH_Keys
	    const validKeys = ShapeDetails.ObjectFabricProperties.map( o =>{return o.DatH_Key ;} );

	    // Filter the props object, using Lodash pick
	    new_shape = new fabric[ShapeDetails.fabricKey]( _.pick(props, validKeys) );

	    /*
	      // I have not re-integrated this logic...
	      stroke: (props.strokeWidth !== undefined) ? props.stroke : null, //Fabric assumes strokeWidth 1 if stroke supplied
	      strokeWidth: props.strokeWidth || null,// undefined causes problems but null OK!
	     */
	    
	}else{
	    // not a Native shape for fabric JS...

/*

  //   Hexagon...
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
*/	    
	}

	//Not done by the Fabric Contructor: set UID according to value provided.
	new_shape.PGTuid = props.PGTuid;	
	canvas.add(new_shape);
    },

    fObj_to_DatH: function(fObj){

	// convert Fabrif JS type name into DatH type name.
	const ShapeDetails = _.find(Motf_lists.ObjectTypes, {fabricObjType: fObj.type} );
	const absorb = ShapeDetails.scaleAbsorb;
	
	if(fObj.scaleX !== 1){    fObj[absorb.scaleX] *= fObj.scaleX;   }
	if(fObj.scaleY !== 1){    fObj[absorb.scaleY] *= fObj.scaleY;   }

	//if(ShapeDetails.fabricKey){} 	// handle special cases like hexagons??

	// Keys relevant to the specific type of shape... (note: every Fabric key is is also the DatH_Key of that property)
	const validKeys = ShapeDetails.ObjectFabricProperties.map( o =>{return o.DatH_Key ;} );
	
	// Filter the props object, using Lodash pick
	var DatH_Elem = _.pick(fObj, validKeys)

	DatH_Elem = _.mapValues(DatH_Elem, v=>{return isNaN(v) ? v : _.round(v,1)}); // any numbers rounded to 1 d.p.
	
	// set some props manually...
	DatH_Elem["shape"] = ShapeDetails.DatH_name;
	DatH_Elem["PGTuid"] = fObj.PGTuid;

	//I also want to Round some props. how do we manage that (numeric ones only...) (map and filter functions...)
//	const Rnd = function (x){return _.round(x, 1);};
	
	return DatH_Elem;		
    },

    DatH_NewShape: function(boundingBox, DT_UI, ExistingElements){

	/*
	  Logic is needed to convert Bounding Box into dimentions for non-rectangles

	 */
	let pos_size_Obj = {};

	if (DT_UI.shape === "obj-ellipse"){
	    pos_size_Obj = _.extend(
		_.pick(boundingBox, ["left", "top"]),
		{
		    rx: (boundingBox.width/2),
		    ry: (boundingBox.height/2),
		}
	    );
	}
	else if (DT_UI.shape === "obj-rectangle"){
	    pos_size_Obj = _.pick(boundingBox, ["left", "top", "width", "height"]);
	    
	}else{
	    console.error("handler not implemented for this shape");
	}


	// generate a new PGTuid. There may be no objects, in which case a value of 0 is used.
	const mElemMax = _.maxBy(ExistingElements, 'PGTuid');
	const newPGTuid = mElemMax ? (mElemMax.PGTuid + 1) : 0;
	
	return _.extend(
	    {
		PGTuid: newPGTuid,// one greater than largest found
	    },
	    pos_size_Obj,
	    _.pick(DT_UI, ["shape", "fill", "stroke", "strokeWidth"])
	);
    },

    /*
      This function is to apply a Change to Motif Element(s).
      The change may be occur on single or multiple elements, depending on what is selected.
      It will return a "changes object", which can be used update the Motif data using the immutable-helper "update" function.
      
      The argument '$change' passed is an object of the format:
      Change = {mElem_property: {$set: 235}}

      Alternatively:
      Change = "delete"
      In this case, the objects contained in the selection will be "spliced out" of the motif.
     */
    $ChgObj_ChangeMotfBySelection: function(Motf, selectedMElemsUIDArr, Change){

	if(selectedMElemsUIDArr.length === 0){return {};}// no mutation required if no object selected.

	const splicings = [];
	const modifications = {};

	// 1. Loop through all selected objects, to compose the change-set.
	selectedMElemsUIDArr.forEach( ePGTuid => {
	    const mElem_index = _.findIndex(Motf.Elements, {PGTuid: ePGTuid} );

	    if(Change === "delete"){
		splicings.push([mElem_index,1]); //delete the object
	    }else{
		modifications[mElem_index] = Change; //modify the object
	    }
	});

	// 2. Return the "changes object"
	if(Change === "delete"){
	    //since object / batch of objects is now deleted, set selection to empty
	    const sorted_splicings = _.reverse( _.sortBy(splicings, [function(arr) { return arr[0]; }]) );
	    return { Elements: {$splice: sorted_splicings }};
	}else{
	    return { Elements: modifications };
	}
    },

    generateFriendlyShapeNames: function(MElemsArr){
	var names = {};
	var counts = {};
	MElemsArr.forEach(function(mElem, i){
	    const ShapeDetails = _.find(Motf_lists.ObjectTypes, {DatH_name: mElem.shape} );
	    const ShapeName = ShapeDetails.fullName;
	    if(counts[ShapeName]){
		counts[ShapeName]++;
	    }else{
		counts[ShapeName] = 1;
	    }
	    names[ mElem.PGTuid ] = ShapeName + " " + counts[ShapeName];
	});
	return names;
    }

}


export default Motf_util;
