import update from 'immutability-helper';
var _ = require('lodash');

var Motf_lists = {

    GenericPropertyArrangement: {

	// properties are referenced here by their 'DatH_name'
	
	pos_size: //Table 1. Placement & Size
	[ "x",         "y",
	  "width",     "height",
	  "rotation",  "hide"],

	appearance:/* Table 2. Appearance */
	["fill",       "outline",
	 "outl thick", "outl pat",
	 "opacity",    "shadow",
	 "shad opac",  "shad blur",
	 "shad x",     "shad y"],

	repetition:/* Table 3. Repetition */
	["qty i-reps", "qty j-reps"],

	more:/* Table 4. More Properties */
	["origin x","origin y",
	 "adv fill", "outl mr",
	 "z index", ""]
    },
    
    ObjectTypes: [

	{ // Ellipse
	    fullName: "Ellipse", // Name shown to user
	    fabricKey: "Ellipse", // Fabric JS contsructor
	    fabricObjType: "ellipse", // Fabric Object Type
	    DatH_name: "obj-ellipse", // PGT storage name
	    /* When 'absorbing' scaleX and scaleY parameters into other properties,
	       which are the properties that need changing?
	     */
	    scaleAbsorb: { 
		scaleX: "rx",
		scaleY: "ry"
	    },
	    propertyCustomisation: {
		pos_size: {
		    2: {$set: "radius x"},
		    3: {$set: "radius y"}
		}
	    }
	},

	{ // Rectangle
	    fullName: "Rectangle",
	    fabricKey: "Rect",
	    fabricObjType: "rect",
	    DatH_name: "obj-rectangle",
	    scaleAbsorb: { 
		scaleX: "width",
		scaleY: "height"
	    },
	    propertyCustomisation: {
		appearance: {
		    10: {$set: "corner rx"},
		    11: {$set: "corner ry"}
		}
	    }
	},

	{ // Triangle
	    fullName: "Triangle",
	    fabricKey: "Triangle",
	    DatH_name: "obj-triangle",
	    scaleAbsorb: { 
		scaleX: "width",
		scaleY: "height"
	    },
	    propertyCustomisation: {}
	},
	
	{ // Hexagon
	    fullName: "Hexagon",
	    fabricKey: null, // "Polygon", - its a non-native shape
	    DatH_name: "obj-hexagon",
	    scaleAbsorb: {}, // maybe not straightforward...
	    pos_size: {
		2: {$set: "side len"},
		3: {$set: ""}
	    }
	},

	{ // Line
	    fullName: "Line",
	    fabricKey: "Line",
	    DatH_name: "obj-line",
	    scaleAbsorb: { 
		scaleX: "width",
		scaleY: "height"
	    },
	    propertyCustomisation: {}
	}
	
    ],

    applyObjectTypesPropertyCustomisation: function(){

	const Generic = this.GenericPropertyArrangement;
	this.ObjectTypes.forEach(function(o) {

	    const Customisation = o.propertyCustomisation;
	    if(_.size(Customisation) === 0){return;}

	    o.PropertyArrangement = update(Generic, Customisation);
	});
    },

    
    ObjectProperties:[
	// 1. Placement & Size
	{
	    shortName: "x",
	    fabricKey: "left",
	    manditory: true,
	    type: "number"
	},
	{
	    shortName: "y",
	    fabricKey: "top"
	},
	{
	    shortName: "width",
	    fabricKey: "width"
	},
	{
	    shortName: "height",
	    fabricKey: "height"
	},
	{//ellipse
	    shortName: "radius x",
	    fabricKey: "rx"
	},
	{//ellipse
	    shortName: "radius y",
	    fabricKey: "ry"
	},
	{
	    shortName: "rotation",
	    fabricKey: "angle"
	},
	{
	    shortName: "hide",
	    fabricKey: null
	},

	// 2. Appearance
	{
	    shortName: "fill",
	    fabricKey: "fill",
	    type: "colour"
	},
	{
	    shortName: "outline",
	    fabricKey: "stroke",
	    type: "colour"
	},
	{
	    shortName: "outl thick",
	    fabricKey: "strokeWidth"
	},
	{
	    shortName: "outl pat",
	    fabricKey: "strokeDashArray"
	},
	{
	    shortName: "opacity",
	    fabricKey: "opacity"
	},
	{
	    shortName: "shadow",
	    fabricKey: null,
	    type: "colour"
	},
	{
	    shortName: "shad opac",
	    fabricKey: null
	},
	{
	    shortName: "shad blur",
	    fabricKey: null
	},
	{
	    shortName: "shad x",
	    fabricKey: null
	},
	{
	    shortName: "shad y",
	    fabricKey: null
	},

	{
	    shortName: "corner rx",
	    fabricKey: "rx"
	},
	{
	    shortName: "corner ry",
	    fabricKey: "ry"
	},

	// 3. Repetition
	{
	    shortName: "qty i-reps",
	    fabricKey: null
	},
	{
	    shortName: "qty j-reps",
	    fabricKey: null
	},

	// 4. More Properties	
	{
	    shortName: "origin x",
	    fabricKey: "originX"
	},
	{
	    shortName: "origin y",
	    fabricKey: "originY"
	},
	{
	    shortName: "adv fill",
	    fabricKey: null
	},
	{
	    shortName: "outl mr",
	    fabricKey: null
	},
	{
	    shortName: "z index",
	    fabricKey: null
	},
    ]
    
}

Motf_lists.applyObjectTypesPropertyCustomisation();

export default Motf_lists;
