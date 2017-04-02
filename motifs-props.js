var motifs_props = {

    //Note to self: what does this DO???
    //top-left cartesian by default...
    current_placement_style: [
	{ // Array - 0 
	    originX: 'left',
	    originY: 'left'
	},
	{ // Array - 1
	    originX: 'center',
	    originY: 'center'
	},
	{ // Array - 2
	    originX: 'center',
	    originY: 'center'
	},
    ],


    //these span 2 columns and appear in pairs...
    props_list_generic: {
	pos_size:[

	    "x",
	    "y",

	    "width",
	    "height",

	    "rotation",
	    "hide"
	],
	appearance:[

	    "fill",
	    "outline",

	    "opacity",
	    "shadow",

	    "shad opac",
	    "shad blur",

	    "shad x",
	    "shad y",

	    "outl thick",
	    "outl pat"
	],
	repetition:[
	    "qty i-reps",
	    "qty j-reps",
	],
	more:[
	    "origin x",
	    "origin y",

	    "adv fill",
	    "outl mr",

	    "z index",
	    "",
	]
    },

    
    props_lists_per_shape: [],

    init_props_lists_per_shape: function(){
	
	/* Deep copy
	   var newObject = jQuery.extend(true, {}, oldObject);
	*/


	// 1. Ellipse - copy generic, then manipulate it to suit...
	var props_list_Ellipse = jQuery.extend(true, {}, this.props_list_generic);

	props_list_Ellipse.name = "Ellipse";
	props_list_Ellipse.shape_type = "shap1";
	props_list_Ellipse.shape_constructor = fabric.Ellipse;

	// 1.2 - edit data structure
	props_list_Ellipse.pos_size[2] = "radius x";
	props_list_Ellipse.pos_size[3] = "radius y";

	// 1.3 - "Submit"
	this.props_lists_per_shape.push(props_list_Ellipse);



	// 2. Rectangle
	var props_list_Rect = jQuery.extend(true, {}, this.props_list_generic);

	props_list_Rect.name = "Rectangle";
	props_list_Rect.shape_type = "shap2";
	props_list_Rect.shape_constructor = fabric.Rect;

	// 2.2 - edit data structure
	props_list_Rect.pos_size.concat([
	    "corner rx",
	    "corner ry"
	]);

	this.props_lists_per_shape.push(props_list_Rect);



	// 3. Triangle
	var props_list_Triangle = jQuery.extend(true, {}, this.props_list_generic);

	props_list_Triangle.name = "Triangle";
	props_list_Triangle.shape_type = "shap3";
	props_list_Triangle.shape_constructor = fabric.Triangle;

	// 3.2 - edit data structure
	// (none)

	// 3.3 - "Submit"
	this.props_lists_per_shape.push(props_list_Triangle);



	// 4. Hexagon
	var props_list_Hexagon = jQuery.extend(true, {}, this.props_list_generic);

	props_list_Hexagon.name = "Hexagon";
	props_list_Hexagon.shape_type = "shap4";
	props_list_Hexagon.shape_constructor = fabric.Polygon;

	// 4.2 - edit data structure
	props_list_Ellipse.pos_size[2] = "side len";
	props_list_Ellipse.pos_size[3] = "";

	// 4.3 - "Submit"
	this.props_lists_per_shape.push(props_list_Hexagon);


    },


    AddMotifElem_itemHTML: function(){


    },



    /*
      shape_type: rect, ellipse, triangle, hexagon, line, circle, square

     */
    AddShape: function(shape_type, props_TLWH){

	// create a rectangle object
	var new_shape = undefined;
	if(shape_type == "shap1"){//circle
	    new_shape = new fabric.Ellipse({
		left: props_TLWH.left,
		top: props_TLWH.top,
		fill: 'red',
		rx: (props_TLWH.width/2),
		ry: (props_TLWH.height/2)
	    });

	}else if(shape_type == "shap2"){//rectangle
	    new_shape = new fabric.Rect();

	}else if(shape_type == "shap3"){//triangle
	    new_shape = new fabric.Triangle();

	}else if(shape_type == "shap4"){//hexagon
	    var W1 = 0.5 * props_TLWH.width;
	    var W2 = 0.5 * props_TLWH.height / 0.866;
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
		    left: props_TLWH.left,
		    top: props_TLWH.top,
//		    angle: 0,
		    fill: '#89ac56'
		}
	    );


	}else if(shape_type == "shap5"){//line
	    new_shape = new fabric.Line();
	    new_shape.set({
		strokeWidth: 1,
		stroke: 'black'
	    });

	}

	if((shape_type == "shap2")||(shape_type == "shap3")||(shape_type == "shap5")){
	    new_shape.set({
		left: props_TLWH.left,
		top: props_TLWH.top,
		fill: 'blue',
		width: props_TLWH.width,
		height: props_TLWH.height
	    });
	}

	// "add" rectangle onto canvas
	var canvas = motifs_edit.Fabric_Canvas;
	canvas.add(new_shape);

	var new_uid = DM.Motif_newElement({
	    shape: shape_type,
	    left: new_shape.left,
	    top: new_shape.top,
	    width: new_shape.width,
	    height: new_shape.height,
	    fill: new_shape.fill,
	    stroke: new_shape.stroke,
	    rx: new_shape.rx,
	    ry: new_shape.ry,
	});

	new_shape.PGTuid = new_uid;

    },
    
    DeleteShape: function(){

    },
    
    OnScreenAdjust: function(){

    },
    
    ExternalAdjust: function(){},



    RenderMotif: function(){

    },
    
    DerenderMotif: function(){

    }

};
