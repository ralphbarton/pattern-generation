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

	    {ab:"rotation", key: "angle"},
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


    DeleteMotifElem_itemHTML: function(PGTuid){
	$( "#motif-props-zone #m-elem-" + PGTuid ).remove();
    },
    

    AddMotifElem_itemHTML: function(PGTuid, DM_instance_props){

	// 1. Clone HTML content (from template) to create a new Motif Element properties list
	var $ME_plist = $( "#motif-props-zone #m-elem-template" ).clone()
	    .attr('id',('m-elem-' + PGTuid))
	    .show();



	// 2. Adding callback functions to the HTML elements

	// 2.1  - Buttons to hide/show the property sets
	$ME_plist.find(".props-tables-vis-buttons > button").click(function(){
	    $(this).toggleClass('sel');
	    var btn_of_4 = $(this).attr('id');

	    //traverse DOM tree to the specific table-chunk relating to the same Motif element
	    var $clicked_motif_element = $(this).closest(".m-elem");
	    $clicked_motif_element.find(".props-table-chunk." + btn_of_4).slideToggle();
	});

	// 2.2 - "Delete Element" button
	$ME_plist.find(".delete-m-elem").click(function(){
	    motifs_edit.deleteMotifElement(PGTuid);
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

		//the two properties in this row of the table, by ref'd by internal key..
		var key1 = props_set[i].key;
		var key2 = props_set[i+1].key;

		$(this).find("table").append(
		    $("<tr\>").append(
			// First Prop
			$("<td\>").addClass("col-prop " + key1).text(props_set[i].ab),
			$("<td\>").addClass("col-valu " + key1).text(
			    DM_instance_props[
				props_set[i].key
			    ]
			),
			$("<td\>").addClass("col-more " + key1).text("..."),
			// Second Prop
			$("<td\>").addClass("col-prop " + key2).text(props_set[i+1].ab),
			$("<td\>").addClass("col-valu " + key2).text(
			    DM_instance_props[
				props_set[i+1].key
			    ]
			),
			$("<td\>").addClass("col-more " + key2).text("...")
		    )
		);
	    }
	});
	

	// 4. Finally, add the element into the DOM tree...
	$ME_plist.appendTo("#motif-props-zone .contents");

	// 5. auto scroll to the new element
	this.MotifElem_focusListing(PGTuid, {autoScroll: true});
    },


    UpdateMotifElem_itemHTML: function(PGTuid, DM_changed_props){

	var $ME_plist = $('#m-elem-' + PGTuid);
	
	//use jQuery to iterate over elements of 'DM_changed_props'
	$.each( DM_changed_props, function( key, value ) {
	    $ME_plist.find("td.col-valu." + key).text(value);// HTML update
	    $ME_plist.find("td." + key).addClass("recent-change");
	    //and hold the class for 1 seconds
	    setTimeout(function(){
		$ME_plist.find("td." + key).removeClass("recent-change");
	    }, 1000);
	});

    },


    // "focus" refers to scrolling to the location
    MotifElem_focusListing: function(PGTuid, options){
	options = options || {}; // in case of no options object provided...

	var $ME_plist = $('#m-elem-' + PGTuid);

	// 1. Auto scroll to the Motif Element's Propery Listing
	if(options.autoScroll){
	    $(".listing-box .contents").scrollTop(0);
	    var new_elem_TOP = $ME_plist.position().top - 28;// height offset of 27 pixels...
	    $(".listing-box .contents").scrollTop(new_elem_TOP);
	}

	// 2. Change styling
	if(options.focusHighlight){
	    // defocus any already focussed elements
	    $(".m-elem.focus").removeClass("focus");

	    $ME_plist.toggleClass("focus", (options.removeHighlight != true) );
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

	var new_uid = DM.Motif_newElement_data(DM_props);

	new_shape.PGTuid = new_uid;

	// Add the properties listing for the added shape...
	this.AddMotifElem_itemHTML(new_uid, DM_props);

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

	var props_snapshot = function(fObj){
	    fObj.props_preTransform = {
		left: fObj.left,
		top: fObj.top,
		width: fObj.width,
		height: fObj.height,
		angle: fObj.angle
	    };
	};

	canvas.on('object:selected', function(options) {

	    if (options.target) {

		var fObj = options.target;

		// scroll to and highlight the item in the list
		var PGTuid = fObj.PGTuid;
		
		// note that a group may get selected, but this will not have a PGTuid defined.
		// In this case, no autoscroll/highlight (although I will want these later).
		if(PGTuid !== undefined){

		    props_snapshot(fObj);

		    motifs_props.MotifElem_focusListing(PGTuid, {
			autoScroll: true,
			focusHighlight: true
		    });
		}

	    }
	});


	canvas.on('before:selection:cleared', function(options) {
	    if (options.target) {

		// de-highlight item in list
		var PGTuid = options.target.PGTuid;
		motifs_props.MotifElem_focusListing(PGTuid, {
		    focusHighlight: true,
		    removeHighlight: true
		});
	    }
	});

	// this event is triggerd one the modification activity is completed.
	canvas.on('object:modified', function(options) {
	    if (options.target) {

		var fObj = options.target;
		var PGTuid = fObj.PGTuid;

		// use scale change to directly change with width/height rather than holding
		if(fObj.scaleX != 1){
		    fObj.width = Math.round(fObj.width * fObj.scaleX, 0);
		    fObj.scaleX = 1;
		}
		if(fObj.scaleY != 1){
		    fObj.height = Math.round(fObj.height * fObj.scaleY, 0);
		    fObj.scaleY = 1;
		}

		//iterate through the properties that *may* be modified
		var cng = {};
		$.each(fObj.props_preTransform, function( key, value ) {
		    //determine which *were* modified
		    if(value != fObj[key]){

			//We don't particularly care about accuracy loss for a manually created motif, and 1 d.p. precision is
			// fine for pixels and angles...
			cng[key] = Math.round(10 * fObj[key]) / 10;
		    }
		});

		// this does (re)edit Fabric Object properties too, but this is at worst harmless
		motifs_edit.updateMotifElement(PGTuid, cng);

		props_snapshot(fObj);

		console.log('object:modified', options.target.PGTuid);
	    }
	});


    },


};
