import update from 'immutability-helper';
var _ = require('lodash');

var Motf_lists = {

    GenericPropertyArrangement: {

	// properties are referenced here by their 'DatH_name'
	
	pos_size: //Table 1. Placement & Size
	[ "left",        "top",
	  "width",       "height",
	  "angle",       "hide"],

	appearance:/* Table 2. Appearance */
	["fill",         "stroke",
	 "strokeWidth",  "strokeDashArray",
	 "opacity",      "shadowColour",
	 "shadowOpacity","shadowBlur",
	 "shadowX",      "shadowY"],

	repetition:/* Table 3. Repetition */
	["qtyIRepetition", "qtyJRepetition"],

	more:/* Table 4. More Properties */
	["originX",      "originY",
	 "advancedFill", "outlineMitre",
	 "zIndex", ""]
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
	    propertyCustomisation: { // Will be deleted after init
		pos_size: {
		    2: {$set: "rx"},
		    3: {$set: "ry"}
		}
	    },
	    PropertyArrangement: {}, // Will be set programatically
	    ObjectFabricProperties: [] // Will be set programatically
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
		    10: {$set: "cornerRX"},
		    11: {$set: "cornerRY"}
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
	    delete o.propertyCustomisation; // it has served is ts purpose
	});
    },

    applyFilteredObjectPropertiesForShapes: function(){

	this.ObjectTypes.forEach(function(o) {

	    // 1. generate a simple array of all 'DatH_Key', relevant to this shape
	    const ShapePropsList = _.flatMap(o.PropertyArrangement, x => {return x} );

	    // 2. now, for each DatH_Key, get the full properties details object
	    const ShapePropsDetailsList = ShapePropsList.map( DatH_Key => {
		return _.find(Motf_lists.ObjectProperties, {DatH_Key: DatH_Key} );
	    });

	    // 3. Array of property-details objects, where the properties are
	    //  (1) relevant to this shape
	    //  (2) are Fabric Properties
	    o.ObjectFabricProperties = ShapePropsDetailsList.filter( pDeets => {return pDeets && pDeets.isFabricKey} );
	});
    },

    
    ObjectProperties:[
	// 1. Placement & Size
	{
	    shortName: "x",
	    isFabricKey: true,
	    DatH_Key: "left",
	    manditory: true,
	    type: "number",
	    unit: "pixels"
	},
	{
	    shortName: "y",
	    isFabricKey: true,
	    DatH_Key: "top",
	    type: "number",
	    unit: "pixels"
	},
	{
	    shortName: "width",
	    isFabricKey: true,
	    DatH_Key: "width",
	    type: "number",
	    unit: "pixels"
	},
	{
	    shortName: "height",
	    isFabricKey: true,
	    DatH_Key: "height",
	    type: "number",
	    unit: "pixels"
	},
	{//ellipse
	    shortName: "radius x",
	    isFabricKey: true,
	    DatH_Key: "rx",
	    type: "number",
	    unit: "pixels"
	},
	{//ellipse
	    shortName: "radius y",
	    isFabricKey: true,
	    DatH_Key: "ry",
	    type: "number",
	    unit: "pixels"
	},
	{
	    shortName: "rotation",
	    isFabricKey: true,
	    DatH_Key: "angle",
	    type: "number",
	    unit: "degrees"
	},
	{
	    shortName: "hide",
	    DatH_Key: "hide",
	    type: "enum"
//	    unit: "text"
	},

	// 2. Appearance
	{
	    shortName: "fill",
	    isFabricKey: true,
	    DatH_Key: "fill",
	    type: "colour"
	},
	{
	    shortName: "outline",
	    isFabricKey: true,
	    DatH_Key: "stroke",
	    type: "colour"
	},
	{
	    shortName: "outl thick",
	    isFabricKey: true,
	    DatH_Key: "strokeWidth",
	    type: "number"
	},
	{
	    shortName: "outl pat",
	    isFabricKey: true,
	    DatH_Key: "strokeDashArray"
	},
	{
	    shortName: "opacity",
	    isFabricKey: true,
	    DatH_Key: "opacity"
	},
	{
	    shortName: "shadow",
	    DatH_Key: "shadowColour",
	    type: "colour"
	},
	{
	    shortName: "shad opac",
	    DatH_Key: "shadowOpacity"
	},
	{
	    shortName: "shad blur",
	    DatH_Key: "shadowBlur"
	},
	{
	    shortName: "shad x",
	    DatH_Key: "shadowX"
	},
	{
	    shortName: "shad y",
	    DatH_Key: "shadowY"
	},

	{
	    shortName: "corner rx",
	    isFabricKey: false, // it is a fabric key, but not uniquely...
	    DatH_Key: "cornerRX",
	    fabricKey: "rx"
	},
	{
	    shortName: "corner ry",
	    isFabricKey: false, // it is a fabric key, but not uniquely...
	    DatH_Key: "cornerRY",
	    fabricKey: "ry"
	},

	// 3. Repetition
	{
	    shortName: "qty i-reps",
	    DatH_Key: "qtyIRepetition"
	},
	{
	    shortName: "qty i-reps",
	    DatH_Key: "qtyJRepetition"
	},

	// 4. More Properties	
	{
	    shortName: "origin x",
	    isFabricKey: true,
	    DatH_Key: "originX"
	},
	{
	    shortName: "origin y",
	    isFabricKey: true,
	    DatH_Key: "originY"
	},
	{
	    shortName: "adv fill",
	    DatH_Key: "advancedFill"
	},
	{
	    shortName: "outl mr",
	    DatH_Key: "outlineMitre"
	},
	{
	    shortName: "z index",
	    DatH_Key: "zIndex",
	    type: null // this will not be a property that can be set directly. Changes will affect Array ordering
	},
    ],

    GridSizes: {
	Cartesian: {
	    Arr: [10, 25, 50],
	    Dict: {"small": 10, "medium": 25, "large": 50}
	}
    },

    objectOrigins: {
	"center": {
	    originX: "center",
	    originY: "center"
	},
	"TL1": {
	    originX: "left",
	    originY: "top"
	},
	"TL2": {
	    originX: "left",
	    originY: "top"
	}
    }
    
}


Motf_lists.applyObjectTypesPropertyCustomisation();
Motf_lists.applyFilteredObjectPropertiesForShapes();

export default Motf_lists;
