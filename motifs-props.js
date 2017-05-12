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

	    {ab:"fill", key: "fill", fn: "col"},
	    {ab:"outline", key: "stroke", fn: "col"},

	    {ab:"outl thick", key: "strokeWidth"},
	    {ab:"outl pat", key: "strokeDashArray"},

	    {ab:"opacity", key: "opacity"},
	    {ab:"shadow", key: "CUS-", fn:"col"},

	    {ab:"shad opac", key: "CUS-"},
	    {ab:"shad blur", key: "CUS-"},

	    {ab:"shad x", key: "CUS-"},
	    {ab:"shad y", key: "CUS-"},

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

    
    props_perShapeType: [],

    init_props_perShapeType: function(){
	

	// 1. Ellipse - copy/extend general properties, add those specific to this shape
	var props_list_Ellipse = jQuery.extend(true, {}, this.props_list_generic, {
	    name: "Ellipse",
	    shape: "obj-ellipse",
	    shape_constructor: fabric.Ellipse
	});

	// 1.2 - edit data structure
	props_list_Ellipse.pos_size[2] = {ab:"radius x", key: "rx"},
	props_list_Ellipse.pos_size[3] = {ab:"radius y", key: "ry"},

	// 1.3 - "Submit"
	this.props_perShapeType.push(props_list_Ellipse);


	// 2. Rectangle - copy/extend general properties, add those specific to this shape
	var props_list_Rect = jQuery.extend(true, {}, this.props_list_generic, {
	    name: "Rectangle",
	    shape: "obj-rectangle",
	    shape_constructor: fabric.Rect
	});


	// 2.2 - edit data structure
	props_list_Rect.appearance.push(
	    {ab:"corner rx", key: "var"},
	    {ab:"corner ry", key: "var"}
	);

	this.props_perShapeType.push(props_list_Rect);



	// 3. Triangle - copy/extend general properties, add those specific to this shape
	var props_list_Triangle = jQuery.extend(true, {}, this.props_list_generic, {
	    name: "Triangle",
	    shape: "obj-triangle",
	    shape_constructor: fabric.Triangle
	});

	// 3.2 - edit data structure
	// (none)

	// 3.3 - "Submit"
	this.props_perShapeType.push(props_list_Triangle);



	// 4. Hexagon - copy/extend general properties, add those specific to this shape
	var props_list_Hexagon = jQuery.extend(true, {}, this.props_list_generic, {
	    name: "Hexagon",
	    shape: "obj-hexagon",
	    shape_constructor: fabric.Polygon
	});

	// 4.2 - edit data structure
	props_list_Hexagon.pos_size[2] = {ab:"side len", key: "var"};
	props_list_Hexagon.pos_size[3] = {ab:"", key: "var"};

	// 4.3 - "Submit"
	this.props_perShapeType.push(props_list_Hexagon);



	// 5. Line - copy/extend general properties, add those specific to this shape
	var props_list_Line = jQuery.extend(true, {}, this.props_list_generic, {
	    name: "Line",
	    shape: "obj-line",
	    shape_constructor: fabric.Line
	});


	// 5.1 - edit data structure - quite a number of props need REMOVING here...
	props_list_Line.pos_size[0] = {ab:"x1", key: "var"};
	props_list_Line.pos_size[1] = {ab:"y1", key: "var"};
	props_list_Line.pos_size[2] = {ab:"x2", key: "var"};
	props_list_Line.pos_size[3] = {ab:"y2", key: "var"};

	props_list_Line.appearance[0] = {ab:"colour", key: "var"};
	props_list_Line.appearance[1] = {ab:"", key: "var"};

	this.props_perShapeType.push(props_list_Line);
	
    },


    DeleteMotifElem_itemHTML: function(PGTuid){
	$( "#motif-props-zone #m-elem-" + PGTuid ).remove();
    },
    

    AddMotifElem_itemHTML: function(PGTuid, properties, options){
	
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

	// 2.3 - Clicking the heading bar selects item on canvas
	$ME_plist.find(".heading-bar").click(function(){
	    var canvas = motifs_edit.Fabric_Canvas;
	    var Fabric_Object = DM.GetByKey_( canvas._objects, "PGTuid", PGTuid);
	    
	    canvas.setActiveObject(Fabric_Object);
	});

	

	// 3. Create and populate the tables html...

	// 3.1 Get the set of props which applies for this shape...
	var props_thisShapeType = DM.GetByKey_( this.props_perShapeType, "shape", properties.shape);

	$ME_plist.find(".heading-bar .name").text(props_thisShapeType.name + " " + PGTuid);

	var PropGroupNames = {
            "set-1": "pos_size",
            "set-2": "appearance",
            "set-3": "repetition",
            "set-4": "more"
	};


	var Create_$td_valueCell = function(PropertyInfo){
	    var key = PropertyInfo.key;
	    var $td = $("<td\>").addClass("col-valu " + key);
	    var val = properties[key];
	    
	    //default option is to fill cell with text...
	    if(PropertyInfo.fn === undefined || val === undefined){// most properties are like this
		return $td.text(val);

	    }else if(PropertyInfo.fn === "col"){// colour properties are like this
		var bgrins_id = "bgrins-uid_"+PGTuid+"-prop_"+key;

		// actual initialisation of the BGrins picker must be deferred...
		setTimeout(function(){
		    $("#"+bgrins_id).spectrum({
			color: val,
//			appendTo: "parent",
			
			// below is copied from "BGrinsShow" of cpot-edit-init
			showInput: true, 
			showAlpha: true,

			//for "palette"
			localStorageKey: "spectrum.ralph-patterns-program",
			showPalette: true,
			palette: [ ],
			showSelectionPalette: true,
			selectionPalette: [ ],
			maxSelectionSize: 18,
			showInitial: true,
			preferredFormat: "hsl",
			//Called after the colorpicker is hidden
			hide: function(tinycolor){
			    chg = {};
			    chg[key] = tinycolor.toRgbString()
			    // Update affects: 1. Fabric;  2. DM;  3. HTML
			    motifs_edit.updateMotifElement(PGTuid, chg);
			}
		    })
		}, 0);
		
		return $td.addClass("bgrins-cell")
		    .append(
		    $("<input\>")
			.attr("id",bgrins_id)
			.addClass("item-prop-bgrins")
		);
	    }

	};

	
	$ME_plist.find(".props-table-chunk").each(function(){
	    var myClass = $(this).attr("class").replace("props-table-chunk ", "");
	    var GroupName = PropGroupNames[myClass];
	    var PropertyGroup = props_thisShapeType[GroupName];

	    // Create the table (of which there are 4) row by row here
	    for (var i = 0; i < PropertyGroup.length; i+=2){

		//the two properties in this row of the table, by ref'd by internal key..
		var myProp1 = PropertyGroup[i];
		var myProp2 = PropertyGroup[i+1];

		$(this).find("table").append(
		    $("<tr\>").append(
			// First Prop
			$("<td\>").addClass("col-prop " + myProp1.key).text(myProp1.ab),
			Create_$td_valueCell(myProp1),
			$("<td\>").addClass("col-more " + myProp1.key).text("..."),
			// Second Prop
			$("<td\>").addClass("col-prop " + myProp2.key).text(myProp2.ab),
			Create_$td_valueCell(myProp2),
			$("<td\>").addClass("col-more " + myProp2.key).text("...")
		    )
		);
	    }
	});
	

	// 4. Finally, add the element into the DOM tree...
	$ME_plist.appendTo("#motif-props-zone .contents");

	// 5. auto scroll to the new element
	this.MotifElem_focusListing(PGTuid, {autoScroll: options.autoScroll});
    },


    UpdateMotifElem_itemHTML: function(PGTuid, DM_changed_props){

	var $ME_plist = $('#m-elem-' + PGTuid);
	
	//use jQuery to iterate over elements of 'DM_changed_props'
	$.each( DM_changed_props, function( key, value ) {

	    $value_cell = $ME_plist.find("td.col-valu." + key);
	    if($value_cell.hasClass("bgrins-cell")){
		//Case 1: updating a colour cell...
		$value_cell.find("input").spectrum("set", value);
		
	    }else{
		//Case 2: updating a text cell...
		$value_cell.text(value);// HTML update

	    }

	    // Apply highlighting effect (all cases)
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
	    // (a.) record initial position
	    var old_elem_TOP = $(".listing-box .contents").scrollTop();

	    // (b.) calculate final position
	    $(".listing-box .contents").scrollTop(0);
	    var new_elem_TOP = $ME_plist.position().top - 28;// height offset of 27 pixels...

	    // (c.) animate movement from initial to final...
	    $(".listing-box .contents").scrollTop(old_elem_TOP);
	    $(".listing-box .contents").animate({ scrollTop: new_elem_TOP }, 200);
	}

	// 2. Change styling
	if(options.focusHighlight){
	    // defocus any already focussed elements
	    $(".m-elem.focus").removeClass("focus");

	    $ME_plist.toggleClass("focus", (options.removeHighlight != true) );
	}

    },





    /*
      shape: rect, ellipse, triangle, hexagon, line, circle, square

    */
    Fabric_AddShape: function(PGTuid, props){
	
	
	// create a rectangle object
	var new_shape = undefined;
	if(props.shape == "obj-ellipse"){//circle
	    new_shape = new fabric.Ellipse({
		left: props.left,
		top: props.top,
		fill: props.fill,
		rx: props.rx,
		ry: props.ry,
		stroke: (props.strokeWidth != undefined) ? props.stroke : null,
		strokeWidth: props.strokeWidth || null
	    });

	}else if(props.shape == "obj-rectangle"){//rectangle
	    new_shape = new fabric.Rect();

	}else if(props.shape == "obj-triangle"){//triangle
	    new_shape = new fabric.Triangle();

	}else if(props.shape == "obj-hexagon"){//hexagon
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
		    fill: props.fill,
		}
	    );


	}else if(props.shape == "obj-line"){//line
	    new_shape = new fabric.Line();
	    new_shape.set({
		strokeWidth: props.strokeWidth,
		stroke: 'black',
	    });

	}

	if((props.shape == "obj-rectangle")||(props.shape == "obj-triangle")||(props.shape == "obj-line")){
	    new_shape.set({
		left: props.left,
		top: props.top,
		fill: props.fill,
		stroke: (props.strokeWidth != undefined) ? props.stroke : null, //Fabric assumes strokeWidth 1 if stroke supplied
		strokeWidth: props.strokeWidth || null,// undefined causes problems but null OK!
		width: props.width,
		height: props.height
	    });
	}

	if(props.angle){
	    new_shape.set({angle: props.angle});
	}

	//set UID according to value provided.
	new_shape.PGTuid = PGTuid;
	
	// "add" rectangle onto canvas
	var canvas = motifs_edit.Fabric_Canvas;
	canvas.add(new_shape);

	
    },
    
    RenderMotif: function(){

    },
    
    DerenderMotif: function(){

    }

};
