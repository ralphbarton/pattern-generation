import {select} from "d3-selection";
import "d3-selection-multi";

var _ = require('lodash');
import tinycolor from 'tinycolor2';

import {fabric}  from 'fabric';

import Motf_lists from './Motf_lists';

// for demo below
//import TextureImg from '../../asset/texture.png';

//query split this file up??


var Motf_util = {
    
    newRandomMotif: function(){
	
	const isCircle = Math.random() > 0.5;	// 50% chance of circle; 50% chance of rectangle...

	return {
	    name: "New Motif",
	    Params: {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    Elements: [
		_.assign(
		    {
			"shape": isCircle ? "obj-ellipse" : "obj-rectangle",
			"left": isCircle ? 0 : 50,
			"top": isCircle ? 0 : 50,
			"fill": tinycolor.random().toHexString(),
			"stroke": null,
			"PGTuid": 0
		    },
		    isCircle ?
			{
			    "rx": 200,
			    "ry": 200
			} : {
			    "width":  300,
			    "height": 300
			}

		)
	    ]
	};
    },

	    /*
	      //demo code for adding applying a background pattern in Fabric JS

	    fabric.util.loadImage(TextureImg, function(img) {
		new_shape.set('fill', new fabric.Pattern({
		    source: img,
		    repeat: "repeat"
		}));
	    });
	    */
    
    parseMotifElement: function(format, Element, options){

	const ShapeDetails = _.find(Motf_lists.ObjectTypes, {DatH_name: Element.shape} );

	if(format === 'fabric'){ // "properties object" for Fabric

	    if(ShapeDetails.fabricKey){ // Shapes for which a key "fabricKey" is non-null are 'native Fabric shapes'		
		
		// Every Fabric key (of the Element) is the string used as its DatH_Key
		const validKeys = ShapeDetails.ObjectFabricProperties.map( o =>{return o.DatH_Key ;} );

		/*
		// Todo: somehow re-integrated this logic...

		//Fabric assumes strokeWidth 1 if stroke supplied
		stroke: (Element.strokeWidth !== undefined) ? Element.stroke : null, 
		strokeWidth: Element.strokeWidth || null,// undefined causes problems but null OK!
	     */
		
		// Filter the Element object for valid props, using Lodash pick
		return {
		    name: ShapeDetails.fabricKey,
		    Properties: _.pick(Element, validKeys)
		};
	    
	    }else{ // A shape for which key "fabricKey" is null a 'non-native Fabric shape' (e.g. hexagon)

		/*
		//   Hexagon...
		var W1 = 0.5 * Element.width;
		var W2 = 0.5 * Element.height / 0.866;
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
			left: Element.left,
			top: Element.top,
			fill: Element.fill
		    }
		);
		*/	    
	    }


	}else if(format === 'svg'){ // "properties object" for SVG


	    // 1. get Attrs
	    // "attributes" of svg object defined the geometry

	    // put the origin in the middle of the Image (other ways to do this in an SVG?)
	    // I don't think this is a final solution, below...
	    const elementLeft = Element["left"] - (options.originZero ? 200 : 0);
	    const elementTop  = Element["top"]  - (options.originZero ? 200 : 0);

	    const elementTransformAttr = Element.angle ?
		  {"transform": `rotate(${ Element.angle }, ${ elementLeft }, ${ elementTop })`} : {};
	    
	    const Attrs = (()=>{
		if (Element.shape === "obj-rectangle"){
		    return _.assign({},
				    { // src 1
					"x": elementLeft,
					"y": elementTop
				    },
				    _.pick(Element, ["width", "height"]), // src 2
				    elementTransformAttr // src 3
				   );
		}
		if (Element.shape === "obj-ellipse"){
		    return _.assign({},
				    { // src 1
					"cx": elementLeft + Element["rx"],
					"cy": elementTop + Element["ry"]
				    },
				    _.pick(Element, ["rx", "ry"]), // src 2
				    elementTransformAttr // src 3
				   );
		}
		console.error("parseMotifElement() encountered unknown Element type (parse for SVG)");
	    })();

	    // 1. get Styles
	    // "styles" of svg object defined colour, border etc.

	    var Styles = {
		..._.pick(Element, ["fill", "stroke"]),
		"stroke-width": Element["strokeWidth"] || 0 // take a 0 value if undefined
	    };

	    return {
		name: Element.shape === "obj-ellipse" ? "ellipse" : "rect", // not very general
		attrs: Attrs,
		styles: Styles
	    };
	    
	}else{
	    console.error("parseMotifElement() was required to convert to an unknown format");
	}
    },

    
    putMotifSVG: function(svg_el, Motif, options){

	const d3_svg = select(svg_el);
	d3_svg.selectAll("*").remove();
	
	// Iterate over the shapes of the Motif (its Elements)
	Motif.Elements.forEach( Element => {
	    
	    // 1. convert the details of this shape to SVG format
	    const rendering_props = this.parseMotifElement('svg', Element, options);
	    
	    // 2. append a new SVG element accordingly
	    d3_svg
		.append(rendering_props.name)
		.attrs( rendering_props.attrs)
		.styles( rendering_props.styles );
	    	    
	});

    },


    // generate Fabric object from object saved in DatH
    Fabric_AddShape: function(canvas, Element){
	const rendering_props = this.parseMotifElement("fabric", Element);
	const new_shape = new fabric[ rendering_props.name ]( rendering_props.Properties );
	new_shape.PGTuid = Element.PGTuid; //Not (obviously) done by the Fabric Contructor: setting UID
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
	  the "left", "top" coordinates passed will never refer to shape center coordinates "(x,y)", always actual top/left
	  however, for a Motif with objectOrigin = "center", in DatH, "left", "top" refer to "(x,y)" which may refer to center
	  conversion I carry out at this point.....
	 */
	const pos_Obj = boundingBox.objectOrigin !== "center" ? _.pick(boundingBox, ["left", "top"]) :
	      {
		  left: boundingBox.left + boundingBox.width/2,
		  top: boundingBox.top + boundingBox.height/2
	      };

	let pos_size_Obj = {};

	// Logic is needed to convert Bounding Box into dimentions for non-rectangles
	if (DT_UI.shape === "obj-ellipse"){
	    pos_size_Obj = _.extend(pos_Obj,
		{
		    rx: (boundingBox.width/2),
		    ry: (boundingBox.height/2),
		}
	    );
	}
	else if (DT_UI.shape === "obj-rectangle"){
	    pos_size_Obj = _.extend(pos_Obj, _.pick(boundingBox, ["width", "height"]));
	    
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

    DatH_DuplicateShape: function(targetMElem, ExistingElements){

	// generate a new PGTuid. There may be no objects, in which case a value of 0 is used.
	// These 2 simple statements are copy-pasted from above.
	const mElemMax = _.maxBy(ExistingElements, 'PGTuid');
	const newPGTuid = mElemMax ? (mElemMax.PGTuid + 1) : 0;

	return _.assign( _.clone(targetMElem), {
	    PGTuid: newPGTuid,
	    left: (targetMElem.left - 10),
	    top: (targetMElem.top + 10)
	});
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
