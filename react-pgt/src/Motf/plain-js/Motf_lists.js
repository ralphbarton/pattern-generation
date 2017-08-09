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
	    fullName: "Ellipse",
	    fabricKey: "Ellipse",
	    DatH_name: "obj-ellipse",
	    propertyCustomisation:{
		"pos_size[2]": "radius x",
		"pos_size[3]": "radius y",
	    }
	},

	{ // Rectangle
	    fullName: "Rectangle",
	    fabricKey: "Rect",
	    DatH_name: "obj-rectangle",
	    propertyCustomisation: {
		"appearance[10]": "corner rx",
		"appearance[11]": "corner ry",
	    }
	},

	{ // Triangle
	    fullName: "Triangle",
	    fabricKey: "Triangle",
	    DatH_name: "obj-triangle",
	    propertyCustomisation: {}
	},
	
	{ // Hexagon
	    fullName: "Hexagon",
	    fabricKey: null, // "Polygon", - its a non-native shape
	    DatH_name: "obj-hexagon",
	    propertyCustomisation: {
		"pos_size[2]": "side len",
		"pos_size[3]": "",
	    }
	},

	{ // Line
	    fullName: "Line",
	    fabricKey: "Line",
	    DatH_name: "obj-line",
	    propertyCustomisation: {}
	}
	
    ],

    ObjectProperties:[
	// 1. Placement & Size
	{
	    shortName:"x",
	    fabricKey: "left",
	    manditory: true,
	    type: "number"
	},
	{
	    shortName:"y",
	    fabricKey: "top"
	},
	{
	    shortName:"width",
	    fabricKey: "width"
	},
	{
	    shortName:"height",
	    fabricKey: "height"
	},
	{//ellipse
	    shortName:"radius x",
	    fabricKey: "rx"
	},
	{//ellipse
	    shortName:"radius y",
	    fabricKey: "ry"
	},
	{
	    shortName:"rotation",
	    fabricKey: "angle"
	},
	{
	    shortName:"hide",
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

export default Motf_lists;
