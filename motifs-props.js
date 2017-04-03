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
	    
	    // ab - the 'abbreviated' name for the property shown to the user
	    // key - the key by which this property is stored in my own data model
	    //     keys starting with CUS-...  are custom properties for shapes, not part of Fabric JS

	    {ab:"x", key: "left"},
	    {ab:"y", key: "top"},

	    {ab:"width", key: "width"},
	    {ab:"height", key: "height"},

	    {ab:"rotation", key: "rotation"},
	    {ab:"hide", key: "CUS-hide"},
	],
	appearance:[

	    {ab:"fill", key: "fill"},
	    {ab:"outline", key: "stroke"},

	    {ab:"opacity", key: "opacity"},
	    {ab:"shadow", key: "CUS-"},

	    {ab:"shad opac", key: "CUS-"},
	    {ab:"shad blur", key: "CUS-"},

	    {ab:"shad x", key: "CUS-"},
	    {ab:"shad y", key: "CUS-"},

	    {ab:"outl thick", key: "strokeWidth"},
	    {ab:"outl pat", key: "strokeDashArray"},
	],
	repetition:[
	    {ab:"qty i-reps", key: "CUS-i-reps"},
	    {ab:"qty j-reps", key: "CUS-j-reps"},
	],
	more:[
	    {ab:"origin x", key: "originX"},
	    {ab:"origin y", key: "originY"},

	    {ab:"adv fill", key: "CUS-"},
	    {ab:"outl mr", key: "CUS-"},

	    {ab:"z index", key: "CUS-"},
	    {ab:"", key: "var"},
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
	props_list_Ellipse.pos_size[2] = {ab:"radius x", key: "rx"},
	props_list_Ellipse.pos_size[3] = {ab:"radius y", key: "ry"},

	// 1.3 - "Submit"
	this.props_lists_per_shape.push(props_list_Ellipse);



	// 2. Rectangle
	var props_list_Rect = jQuery.extend(true, {}, this.props_list_generic);

	props_list_Rect.name = "Rectangle";
	props_list_Rect.shape_type = "shap2";
	props_list_Rect.shape_constructor = fabric.Rect;

	// 2.2 - edit data structure
	props_list_Rect.appearance.push(
	    {ab:"corner rx", key: "var"},
	    {ab:"corner ry", key: "var"}
	);

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
	props_list_Hexagon.pos_size[2] = "side len";
	props_list_Hexagon.pos_size[3] = "";

	// 4.3 - "Submit"
	this.props_lists_per_shape.push(props_list_Hexagon);

    },

    
    AddMotifElem_itemHTML: function(DM_instance_props, PGTuid){

	// 1. Get create a new Motif Element properties list from the template.
	var $ME_plist = $( "#motif-props-zone #m-elem-template" ).clone()
	    .attr('id',('m-elem-' + PGTuid))
	    .show();

	// 2. Add callback functions to the Buttons to hide/show the property sets
	$ME_plist.find(".props-tables-vis-buttons > button").click(function(){
	    $(this).toggleClass('sel');
	    var btn_of_4 = $(this).attr('id');

	    //traverse DOM tree to the specific table-chunk relating to the same Motif element
	    var $clicked_motif_element = $(this).closest(".m-elem");
	    $clicked_motif_element.find(".props-table-chunk." + btn_of_4).slideToggle();
	});

	// 3. Create and populate the tables html...

	// 3.1 Get the set of props which applies for this shape...
	var ShapeProps = $.grep(this.props_lists_per_shape, function(e){ return e.shape_type == DM_instance_props.shape; })[0];
	$ME_plist.find(".heading-bar .name").text(ShapeProps.name + " " + PGTuid);

	var SetName = {
            "set-1": "pos_size",
            "set-2": "appearance",
            "set-3": "repetition",
            "set-4": "more"
	};

	$ME_plist.find(".props-table-chunk").each(function(){
	    var myClass = $(this).attr("class").replace("props-table-chunk ", "");
	    var props_set = ShapeProps[SetName[myClass]];

	    // Create the table (of which there are 4) row by row here
	    for (var i = 0; i < props_set.length; i+=2){
		$(this).find("table").append(
		    $("<tr\>").append(
			$("<td\>").addClass("col-prop").text(props_set[i].ab),
			$("<td\>").addClass("col-valu").text(
			    DM_instance_props[
				props_set[i].key
			    ]
			),
			$("<td\>").addClass("col-more").text("..."),
			$("<td\>").addClass("col-prop").text(props_set[i+1].ab),
			$("<td\>").addClass("col-valu").text(
			    DM_instance_props[
				props_set[i+1].key
			    ]
			),
			$("<td\>").addClass("col-more").text("...")
		    )
		);
	    }
	});
	

	// 4. Finally, add the element into the DOM tree...
	$ME_plist.appendTo("#motif-props-zone .contents");

	// 5. auto scroll to the new element
	this.MotifElem_focusListing({uid: PGTuid});
    },

    MotifElem_focusListing: function(options){

	var $ME_plist = $('#m-elem-' + options.uid);

	// 1. Auto scroll to the Motif Element's Propery Listing
	$(".listing-box .contents").scrollTop(0);
	var new_elem_TOP = $ME_plist.position().top - 28;// height offset of 27 pixels...
	$(".listing-box .contents").scrollTop(new_elem_TOP);

	// 2. Change styling
	if(options.focus){
	    // defocus any already focussed elements
	    $(".m-elem.focus").removeClass("focus");

	    $ME_plist.addClass("focus");
	}

    },





    /*
      shape_type: rect, ellipse, triangle, hexagon, line, circle, square

     */
    AddShape: function(shape_type, props_TLWH){



	var fill_col = $("#motifs-edit .fill .mini-picker").colorpicker().toCssString('rgba');
	var outl_col = $("#motifs-edit .outl .mini-picker").colorpicker().toCssString('rgba');





	// create a rectangle object
	var new_shape = undefined;
	if(shape_type == "shap1"){//circle
	    new_shape = new fabric.Ellipse({
		left: props_TLWH.left,
		top: props_TLWH.top,
		fill: fill_col,
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
		    fill: fill_col
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
		fill: fill_col,
		stroke: outl_col,
		width: props_TLWH.width,
		height: props_TLWH.height,
		strokeWidth: 4
	    });
	}

	// "add" rectangle onto canvas
	var canvas = motifs_edit.Fabric_Canvas;
	canvas.add(new_shape);

	var DM_props = {
	    shape: shape_type,
	    left: new_shape.left,
	    top: new_shape.top,
	    width: new_shape.width,
	    height: new_shape.height,
	    fill: new_shape.fill,
	    stroke: new_shape.stroke,
	    rx: new_shape.rx,
	    ry: new_shape.ry,
	};

	var new_uid = DM.Motif_newElement(DM_props);

	new_shape.PGTuid = new_uid;

	// Add the properties listing for the added shape...
	this.AddMotifElem_itemHTML(DM_props, new_uid);

    },
    
    DeleteShape: function(){

    },
    
    OnScreenAdjust: function(){

    },
    
    ExternalAdjust: function(){},



    RenderMotif: function(){

    },
    
    DerenderMotif: function(){

    },

    init_canvas_selection_events: function(){

	var canvas = motifs_edit.Fabric_Canvas;

	canvas.on('object:selected', function(options) {
	    if (options.target) {

		var uid = options.target.PGTuid;

		motifs_props.MotifElem_focusListing({
		    focus: true,
		    uid: uid
		});

		console.log('object:selected', uid);
	    }
	});


	canvas.on('before:selection:cleared', function(options) {
	    if (options.target) {
		console.log('before:selection:cleared', options.target.PGTuid);
	    }
	});


	canvas.on('object:modified', function(options) {
	    if (options.target) {
		console.log('object:modified', options.target.PGTuid);
	    }
	});


    },



};
