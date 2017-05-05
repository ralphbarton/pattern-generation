var motifs_edit_init = {

    init: function(){

	// 1. Add handlers for the "main" (Done / Cancel) buttons...

	// 1.1 - Cancel
	$("#motifs-edit .main-buttons #cancel").click(function(){
	    motifs_edit.hide({save:false});
	});
	
	// 1.2 - Done
	$("#motifs-edit .main-buttons #done").click(function(){
	    //it is inconsistent for the Hide function to do so much work with underlying data
	    // (i.e. saving) as is happening here...
	    motifs_edit.hide({save:true});
	});
	

	// 1.3 Initiate SmartInput for the Title (no specific pot set)
	$("#motifs-edit .motif-title input#motif-name").SmartInput({
	    underlying_key: "Name",
	    data_class: "text",
	});
	
	//initiate tabs...
	$("#motifs-edit .tabs").tabs();

	// 2. Designing additional interaction with the canvas
	// this is the DIV which *contains* the canvas element...


	// 2.1 - Callback for Toolbox button click
	var Tool_selected = undefined;
	var set_Tool = function(Tool){
	    Tool_selected = Tool;
	    $("#motifs-edit #Motif .interceptor").toggleClass("active", Tool !== undefined);
	    if(Tool === undefined){
		$("#motifs-edit .tools .button").removeClass("sel");
	    }
	};

	var tool_selection_message_strings = {
	    "obj-ellipse": "Ellipse Tool. Hold CTRL to draw circle",
	    "obj-rectangle": "Rectangle Tool. Hold CTRL to draw square",
	    "obj-triangle": "Triangle Tool. Hold CTRL to draw equilateral triangle",
	};
	$("#motifs-edit .tools .button").click(function(){
	    var was_on = $(this).hasClass("sel");
	    $("#motifs-edit .tools .button").removeClass("sel");
	    $(this).toggleClass("sel", !was_on);// now either 1 or 0 of the buttons is lit up
	    var tool_id = $("#motifs-edit .tools .button.sel").attr("id");
	    set_Tool( tool_id );
	    var tool_msg = tool_selection_message_strings[ tool_id ];
	    if(tool_msg){global.toast(tool_msg);}

	    // Deselect any selected objects... (both groups and indiv; all relevant events fired...)
	    canvas.deactivateAllWithDispatch();
	});


	// 2.2 - Callback for "mouse-down" event on the interceptor
	var mousedown_left = undefined;
	var mousedown_top = undefined;
	$("#motifs-edit #Motif .interceptor").mousedown(function(event){
	    mousedown_left = event.offsetX;
	    mousedown_top = event.offsetY;
	});


	var rect_params = function(start_x, start_y, now_x, now_y, bRegular, tool_id){
	    // Logic here to handle when the mouse moves above/left of the point clicked...
	    var w = Math.abs(now_x - start_x);
	    var h = Math.abs(now_y - start_y)
	    var AR = tool_id == "obj-triangle" ? 0.866 : 1;
	    var dim = (w+h/AR)/2
	    w = bRegular ? dim : w;
	    h = bRegular ? dim*AR : h;
	    
	    return {
		width: w,
		left: (start_x < now_x ? start_x : (start_x-w)),
		height: h,
		top: (start_y < now_y ? start_y : (start_y-h))
	    };
	};


	// 2.3 - Callback for "mouse-up" event on the interceptor
	// (such an event can only happen when Tool_selected is a valid shape type...)
	$("#motifs-edit #Motif .interceptor").mouseup(function(event){
	    $("#motifs-edit .interceptor > div")
		.css({
		    width: 0,
		    height: 0
		});

	    //this means draw a shape...
	    if(mousedown_left !== undefined){
		//these 3 lines are copy-pasted, unfortunately...
		var canv_page_coords = $("#motifs-edit .interceptor").offset();
		var canv_mou_x = event.pageX - canv_page_coords.left;
		var canv_mou_y = event.pageY - canv_page_coords.top;

		var MyShapeProps = rect_params(
		    mousedown_left,
		    mousedown_top,
		    canv_mou_x,
		    canv_mou_y,
		    global.keys.CTRL,
		    Tool_selected
		);

		//shape is larger that the minimum acceptable size threshold
		if((MyShapeProps.width >= 3) && (MyShapeProps.height >= 3)){

		    //Extend the shape properties object...
		    $.extend(MyShapeProps, {
			shape: Tool_selected,
			fill:   getUserColour("fill"),
			stroke: getUserColour("outl"),
			strokeWidth: MyStrokeThickness
		    });

		    if(MyShapeProps.shape == "obj-ellipse"){//circle

			$.extend(MyShapeProps, {
			    rx: (MyShapeProps.width/2),
			    ry: (MyShapeProps.height/2)		
			});

			delete MyShapeProps.width;
			delete MyShapeProps.height;
		    }

		    // 1. Add the shape to the data model
		    var new_uid = DM.Motif_newElement_data(MyShapeProps);

		    // 2. Add to the Fabric Canvas
		    motifs_props.Fabric_AddShape(new_uid, MyShapeProps);

		    // 3. Add it to the properties listing
		    motifs_props.AddMotifElem_itemHTML(new_uid, MyShapeProps, {autoScroll: true});

		    
		    if(!draw_many){
			set_Tool(undefined);// if a shape has been drawn...
		    }

		}else{
		    //this stops the drawing of shapes
		    set_Tool(undefined);
		}

	    }

	    // record that the mouse is now UP...
	    mousedown_left = undefined;
	    mousedown_top = undefined;
	});


	// 2.4 - Callback for "mouse-move" event on canvas *Container* 
	$("#motifs-edit #Motif").mousemove(function(event) {
	    
	    //this coordinates are relative to the Document (i.e. (I think) the window)
	    var canv_page_coords = $("#motifs-edit .interceptor").offset();
	    
	    var canv_mou_x = event.pageX - canv_page_coords.left;
	    var canv_mou_y = event.pageY - canv_page_coords.top;
	    
	    //only do when mouse is clicked...
	    if(mousedown_left != undefined){
		$("#motifs-edit .interceptor > div").css(
		    rect_params(mousedown_left,
				mousedown_top,
				canv_mou_x,
				canv_mou_y,
				global.keys.CTRL,
				Tool_selected
			       )
		);
	    }

	    //offsetX attribute of event is position relative to the DIV the mouse is over
	    $("#motifs-edit .mouse-coords .x").text( (canv_mou_x - 200) );
	    $("#motifs-edit .mouse-coords .y").text( (canv_mou_y - 200) );


	});

	// 2.5 - Callback for mouse Over the canvas
	$("#motifs-edit #Motif").mouseenter(function(){
	    $("#motifs-edit .mouse-coords").fadeIn({duration: 200, easing: "linear"});
	});

	// 2.6 - Callback for mouse Out on the canvas
	$("#motifs-edit #Motif").mouseleave(function(){
	    $("#motifs-edit .mouse-coords").fadeOut({duration: 200, easing: "linear"});
	});



	// 3.x Initialise buttons: buttons underneath Motif-Properties listing...

	$("#motifs-edit .props-buttons #contract").click(function(){
	    //this will find all tables of properties, and hide them without animation (there may be quite a few...)
	    //(important to exclude the template one)
	    $(".m-elem:not(#m-elem-template) .props-table-chunk").hide();
	    // change buttons appearance to match
	    $(".m-elem:not(#m-elem-template) .props-tables-vis-buttons button").removeClass("sel");
	});

	$("#motifs-edit .props-buttons #expand").click(function(){
	    //this will find all tables of properties, and hide them without animation (there may be quite a few...)
	    $(".m-elem:not(#m-elem-template) .props-table-chunk").show();
	    $(".m-elem:not(#m-elem-template) .props-tables-vis-buttons button").addClass("sel");
	});


	$("#motif-props-zone .contents").scroll(function() {
	    $(".m-elem td.bgrins-cell input").spectrum("hide");
	});



	// Line Thickness picker....
	var MyStrokeThickness = null;
	$.each([1,2,3,5,10], function(i, t){

	    var $new_row = $("<div/>").addClass("row");
	    var hh = 5 + (t%2)/2; // either 5.5 or 5..
	    
	    //add the svg
	    d3.select($new_row[0]).append("svg")
		.attr("width", 30)
		.attr("height", 15)
		.append("line")
		.attr("x1", 0)
		.attr("y1", hh)
		.attr("x2", 30)
		.attr("y2", hh)
	    	.attr("stroke", "black")
	    	.attr("stroke-width", t);

	    $new_row
		.append( $("<div/>").addClass("cmt").text(t+"px") )
		.click(function(){
		    MyStrokeThickness = t;
		});
	    
	    $("#motifs-edit .line-width .menu-content").append($new_row);

	});
	

	/// 3.x colour pickers...
	var $FillPicker = $("#motifs-edit .fill .mini-picker");
	var $OutlPicker = $("#motifs-edit .outl .mini-picker");
	var CPOT_override = [null, null]; // El 0 is outl, EL 1 is fill.
	
	var Init_picker = function(fill_outl, colourStr){
	    var isFill = fill_outl == "fill";
	    var $Picker = isFill ? $FillPicker : $OutlPicker;
	    var key = isFill ? "fill" : "stroke";

	    if($Picker.hasClass("colorpicker")){
		$Picker.colorpicker().destroy();//destroy existing
	    }

	    var X = tinycolor(colourStr).toRgb();// I think the mini-picker is extremely fussy on colour format...
	    $Picker.colorpicker({//create new picker...
		color: {r: (X.r/255), g: (X.g/255), b: (X.b/255), a: X.a}
	    });
	    CPOT_override[(isFill+0)] = null;// Reset Picker Colour => clear any colour pots
	    
	    //Add the 'onmove' callback function to the Picker
	    // -> Fabric Object colour may be changed with picker colour move
	    $Picker.on('newcolor', function (ev, colorpicker) {
		if(SelectedFabricObject){
		    chg = {};
		    chg[key] = colorpicker.toCssString();
		    // Update affects: 1. Fabric;  2. DM;  3. HTML
		    motifs_edit.updateMotifElement(SelectedFabricObject.PGTuid, chg);
		}
		// Move Picker Colour => clear any colour pots
		CPOT_override[(isFill+0)] = null;
	    });
	};

	//use this function to actually initiate the two pickers...
	Init_picker("fill", 'rgba(255, 82, 35, 0.74)');
	Init_picker("outl", 'rgb(86, 26, 216)');

	var stored_fill = null;
	var stored_outl = null;
	var MiniColourPickers_LoadfromObj = function(fObj){
	    
	    if(fObj){
		// (1.) Hide "Colour-Pot" and show instead 2x "Hold" links
		$("#motifs-edit #choose-cpot").fadeOut();
		$("#motifs-edit #selection-col-hold").fadeIn();
		$("#motifs-edit #selection-col-hold").fadeIn();
		$("#motifs-edit #selection-col-hold > .action-link").removeClass("ui-disabled");
		
		// (2.) store old colours
		stored_fill = $FillPicker.colorpicker().toCssString('rgba');
		stored_outl = $OutlPicker.colorpicker().toCssString('rgba');

		// (3.) Load Object Colours
		var obj_fill = fObj.fill;
		var obj_outl = fObj.stroke;
		
		// (4.) Load Object Colours
		// (set a new colour by destroying and recreating)
		if(obj_fill){
		    Init_picker("fill", obj_fill);
		}else{
		    $("#motifs-edit #selection-col-hold > .action-link.fill").addClass("ui-disabled");
		}
		if(obj_outl){
		    Init_picker("outl", obj_outl);
		}else{
		    $("#motifs-edit #selection-col-hold > .action-link.outl").addClass("ui-disabled");
		}

	    }else{
		// (1.) Show "Colour-Pot" and hide the 2x "Hold" links
		$("#motifs-edit #choose-cpot").fadeIn();
		$("#motifs-edit #selection-col-hold").fadeOut();

		// (2.) restore old colours
		if(stored_fill != $FillPicker.colorpicker().toCssString('rgba')){
		    Init_picker("fill", stored_fill);
		    stored_fill = null;
		}
		if(stored_outl != $OutlPicker.colorpicker().toCssString('rgba')){
		    Init_picker("outl", stored_outl);
		    stored_outl = null;
		}
	    }
	};

	$("#motifs-edit #selection-col-hold > .action-link").click(function(){
	    $(this).addClass("ui-disabled");
	    if($(this).hasClass("fill")){
		stored_fill = $FillPicker.colorpicker().toCssString('rgba');
	    }else{
		stored_outl = $OutlPicker.colorpicker().toCssString('rgba');
	    }
	});


	var getUserColour = function(fill_key){
	    var isFill = (fill_key == "fill") + 0;
	    var chk_key = isFill ? "fill" : "outl";

	    //use null Outline colour when stroke thickness is null...
	    if ( !isFill && (MyStrokeThickness==null) ){return null;}
	    
	    if (CPOT_override[isFill] === null){ // case 1: return the const. colour from picker.
		return $("#motifs-edit ."+chk_key+" .mini-picker").colorpicker().toCssString('rgba');

	    }else{ // case 2: draw from colour pot
		var POT = DM.ColourPotArray[ CPOT_override[isFill] ];
		return cpot_util.DrawFromColourPot( POT );
	    }

	};




	// 3.x Initialise CPOT dropdown
	// this could be either the "Fill" or "Outline" button...
	$("#motifs-edit #choose-cpot .dropdown-content button").click(function(){
	    $("#cpot-fill-vs-outl").slideUp();
	    var button_class = $(this).attr("class");
	    var isFill = button_class == "fill";
	    button_class = isFill ? "Fill" : "Outline";
	    $("#cpot-available")
		.html("")
		.append(
		    $("<div/>")
			.addClass("choose-fill-outl")
			.data({isFill: isFill})
			.text("Choose " + button_class),
		    DM.ColourPotArray.map(function(POT, i){
			return $("<a/>")
		    	    .attr("class","motif-static-cpot")
			    .attr("href","#")
		    	    .attr("id","cpot-#"+i)
			    .text(POT.description);
		    })
		)
		.slideDown();
	});

	$("#motifs-edit #choose-cpot").on("mouseleave", function(){
	    $("#cpot-fill-vs-outl").show();
	    $("#cpot-available").hide();
	});

	$("#motifs-edit #choose-cpot #cpot-available").click(function(ev){
	    var $target = $(ev.target);
	    if( $target.is('a') ){
		var isFill = $(this).find(".choose-fill-outl").data("isFill");
		var cpot_index = parseInt( $target.attr("id").replace("cpot-#", "") );
		var POT = DM.ColourPotArray[ cpot_index ];
		global.toast('Colour pot "'+POT.description+'" chosen as '+(isFill?"fill":"outline")+' colour');
		CPOT_override[(isFill+0)] = cpot_index;
	    }
	});

	
	
	


	// 4. Initialise ACTION LINKS

	// 4.1 - Toolbox: draw one vs. draw many (default is draw one)
	var draw_many = false;
	$("#motifs-edit .tools .act-mutex#draw-one-many").MutexActionLink([0,1], [
	    function(){draw_many = false;},
	    function(){draw_many = true;}
	]);
	

	// 4.2 - Above Motif: Choose background type
	// (todo alter other 'theme' aspects based upon dark/light background 
	var set_bg_layer_config = function(options){
	    $("#motifs-edit #Motif div.bg-layer.ly2")
		.css("background", options.ly2_col);
	    $("#motifs-edit #Motif div.bg-layer.ly3")
		.css("opacity", options.ly3_opac);

	    //adding class "dark" means that background is dark (items must be pale to show up)
	    $("#Motif").toggleClass("dark", (options.ly2_col == "black") );

	};

	$("#motifs-edit .act-mutex#background-w-1-2-b").MutexActionLink([0, 1, 1, 1], [
	    function(){  set_bg_layer_config({ly2_col: "white", ly3_opac: 0});  },
	    function(){  set_bg_layer_config({ly2_col: "white", ly3_opac: 1});  },
	    function(){  set_bg_layer_config({ly2_col: "none",  ly3_opac: 0});  },
	    function(){  set_bg_layer_config({ly2_col: "black", ly3_opac: 0});  }
	]);

	// 4.3 - Above Motif: turn axes ON / OFF
	var set_svgGrp_opac = function(selec, options){
	    $("#Motif svg#bg-axes-grid " + selec)
		.css("opacity", options.opac);
	};

	$("#motifs-edit .act-mutex#motif-axes").MutexActionLink([1,0], [
	    function(){set_svgGrp_opac(".axes", {opac:0});},
	    function(){set_svgGrp_opac(".axes", {opac:1});}
	]);


	
	// 4.4 Gridlines Options
	var GridlinesEnable = function(en){
	    $(".dropdown#grid-settings").toggleClass("disabled", !en);
	    set_svgGrp_opac(".gridlines", {opac: en?1:0 });
	};

	$("#motifs-edit .act-mutex#motif-grid").MutexActionLink([1,0], [
	    function(){ GridlinesEnable(false); },
	    function(){ GridlinesEnable(true); }
	]);

	var GridSnappingActive = false;
	$("#motifs-edit .act-mutex#motif-grid-snap").MutexActionLink([0,1], [
	    function(){ GridSnappingActive = false; },
	    function(){ GridSnappingActive = true; }
	]);

	
	// 4.4.1 - Controlling line faintness
	$("#motifs-edit #grid-settings .btn-set.weight > button").click(function(){
	    var btn_class = $(this).attr("class");
	    d3.select("#Motif svg g.gridlines").classed("faint", btn_class == "faint");
	    d3.select("#Motif svg g.gridlines").classed("strong", btn_class == "strong");
	});

	// 4.4.2 - Controlling grid size
	var CartesianGridSizes = [10, 25, 50];
	$("#motifs-edit #grid-settings .btn-set.size > button").click(function(){
	    var btn_class = $(this).attr("class");

	    // "selectAll" selects both the polar and cartesian
	    d3.selectAll("#Motif svg g.gridlines g.small").classed("hidden", btn_class != "small");
	    d3.selectAll("#Motif svg g.gridlines g.medium").classed("hidden", btn_class != "medium");
	    d3.selectAll("#Motif svg g.gridlines g.large").classed("hidden", btn_class != "large");

	    //change the variable used for snapping...
	    var size_index = (btn_class == "small") ? 0 : ((btn_class == "medium") ? 1 : 2);
	    GridSize = CartesianGridSizes[size_index];
	});

	//auto-click the medium button (necessary to hide the other two grids).
	$("#motifs-edit #grid-settings .btn-set.size > button.medium").click();

	// 4.4.3 - Controlling Cartesian vs. Polar
	$("#motifs-edit #grid-settings .btn-set.system > button").click(function(){
	    var btn_class = $(this).attr("class");
	    //4.4.3.1 - changing the actual gridlines
	    d3.select("#Motif svg g.gridlines g.cartesian").classed("hidden", btn_class != "cartesian");
	    d3.select("#Motif svg g.gridlines g.polar").classed("hidden", btn_class != "polar");
	    //4.4.3.2 - changing the Size buttons (this isn't toggling class; 'toggle' refers to div's own css visibility)
	    $("#motifs-edit .dropdown#grid-settings .btn-set.size .cartesian").toggle(btn_class == "cartesian");
	    $("#motifs-edit .dropdown#grid-settings .btn-set.size .polar").toggle(btn_class == "polar");
	    //4.4.3.3 - changing the increments for the custom buttons
	    $("#motifs-edit .dropdown#grid-settings #gridlines-custom-size .cartesian").toggleClass("my-inline-block", btn_class == "cartesian");
	    $("#motifs-edit .dropdown#grid-settings #gridlines-custom-size .polar").toggleClass("my-inline-block", btn_class == "polar");
	});

	// 4.4.4 - "Reset" grid command (Cartesian, medium size, Normal faintness
	// (note that "reset" is partially about undoing any irregular spacings that may have been manually entered)
	$("#motifs-edit #grid-settings button.reset").click(function(){
	    console.log("reset clicked");
	    // (1) to Cartesian
	    $("#motifs-edit #grid-settings .btn-set.system > button.cartesian").click();
	    // (2) normal faintness
	    $("#motifs-edit #grid-settings .btn-set.weight > button.normal").click();
	    // (3) medium size
	    $("#motifs-edit #grid-settings .btn-set.size > button.medium").click();
	});

	    
	// 4.5 Gridlines: instigating correct initial display state.
	// (auto-click the cartesian button (to hide the other grid)
	$("#motifs-edit #grid-settings .btn-set.system > button.cartesian").click();


	


	// 5. FABRIC...

	// create a wrapper around native canvas element (with id="c")
	var my_canv_El = $("#motifs-edit #Motif > canvas")[0];
	var canvas = new fabric.Canvas(my_canv_El);
	motifs_edit.Fabric_Canvas = canvas;

	// Disables the locked aspect ratio scaling when dragging corner-points, which is the default behaviour
	canvas.uniScaleTransform = true;
	//changes "selection key from Shift (default) to CTRL
	canvas.selectionKey = "ctrlKey";








	
	
	// 6.2. Add listeners for object selection events happening on the canvas
	var canvas = motifs_edit.Fabric_Canvas;

	// cb2, optional parameter, an alternative callback to apply if there are multiple objects
	// return value: Boolean - is it a group?
	var ApplyToSelectedFabricObjects = function(Selection, cb1, cb2){
	    var multiple = (Selection.PGTuid === undefined);

	    if(!multiple){//its a single object
		cb1(Selection);
	    }else{//multiple objects
		var my_cb = cb2 || cb1;
		$.each(Selection._objects, function(index, element) {
		    my_cb(element);
		});
	    }
	    return multiple;
	};

	var Fabric_Obj_Snapshot = function(fObj){// Take props Snapshot
	    fObj.props_preTransform = {
		left: fObj.left,
		top: fObj.top,
		width: fObj.width,
		height: fObj.height,
		angle: fObj.angle,
		rx: fObj.rx,
		ry: fObj.ry
	    };
	};

	var Save_Fabric_Obj_Transform = function(fObj){

	    // 1. set scaleX & scaleY params to 1, and rescale size properties directly
	    $.each({
		"ellipse":  {Qx: "rx", Qy: "ry" },
		"rect":     {Qx: "width", Qy: "height" },
		"triangle": {Qx: "width", Qy: "height" },
		"polygon":  {},
		"line":     {Qx: "width", Qy: "height" }
	    }, function( shape_type, props ) {//applied for each shape type
		if(fObj.type != shape_type){return;}
		if(fObj.type == "polygon"){
		    // polygon points cannot be dynamically changed.
		    // So, we deleted and redrawn on Canvas?
		    // this does raise the question, might scaleX and scaleY be of some use...
		    
		    return;
		}

		if(fObj.scaleX != 1){
		    // 0 d.p. here seems inconsistent
		    fObj[props.Qx] = Math.round(fObj[props.Qx] * fObj.scaleX);
		    fObj.scaleX = 1;
		}
		if(fObj.scaleY != 1){
		    fObj[props.Qy] = Math.round(fObj[props.Qy] * fObj.scaleY);
		    fObj.scaleY = 1;
		}
	    });

	    // 2. What changed? iterate through the properties that *may* be modified
	    var cng = {};
	    $.each(fObj.props_preTransform, function( key, value ) {
		if(value != fObj[key]){// property is changed.
		    cng[key] = Math.round(10 * fObj[key]) / 10;// 1dp precision fine for px and angles
		}
	    });

	    // 3. Enact change (acts upon 1. Fabric;  2. DM;  3. HTML  (n.b. (re)editing Fabric Obj is harmless))
	    motifs_edit.updateMotifElement(fObj.PGTuid, cng);
	    // 4. it *IS* necessary to re-snapshot after transform, because multiple transforms can follow a selection...
	    Fabric_Obj_Snapshot(fObj);
	};

	
	

	/*
	  This variable will be null unless a SINGLE fabric object is selected.
	  it is accessed when the colourMove event is triggered, changing colour on the selected object
	 */
	var SelectedFabricObject = null;

	// Fabric Object Event 1: Select	
	canvas.on('object:selected', function(options) {
	    if (!options.target) {return;}
	    // 1. Snapshot selected element
	    var multiple = ApplyToSelectedFabricObjects(
		options.target,
		function(fObj){
		    Fabric_Obj_Snapshot(fObj);
		}
	    );

	    // 2. Focus the selected element in the list
	    if(multiple){
		global.toast("Group selection...");
	    }else{
		var PGTuid = options.target.PGTuid;
		motifs_props.MotifElem_focusListing(PGTuid, {
		    autoScroll: true,
		    focusHighlight: true
		});

		//Load Object colours - we only execute in the case of single-object selection.
		MiniColourPickers_LoadfromObj(options.target);
		//hold object reference, to suppor colour change...
		global.toast("Use CTRL key to select additional objects.");
		SelectedFabricObject = options.target;
	    }
	});

	
	// Fabric Object Event 2: Clear Selection
	/*
	  before:selection:cleared — fired before selection is cleared (before active group is destroyed)
	  selection:cleared — fired after selection is cleared (after active group is destroyed)
	*/
	var selection_cleared_target = null;
	canvas.on('before:selection:cleared', function(options) {
	    if(!options.target) {return;}
	    selection_cleared_target = options.target;
	});

	
	canvas.on('selection:cleared', function(options) {
	    var fObj = selection_cleared_target;
	    selection_cleared_target = null;
	    if(!fObj || fObj.deleting===true) {return;}
	    // 1. Save changes
	    ApplyToSelectedFabricObjects(
		fObj,
		function(fObj){
		    // if the selection clear CB only called due to Obj delete, "save" is not required.
		    if(fObj.deleting===true) {return;}
		    Save_Fabric_Obj_Transform(fObj);
		}
	    );

	    //Restore Old colours
	    MiniColourPickers_LoadfromObj(false);
	    SelectedFabricObject = null;
	    
	    // 2. Defocus the selected element in the list	    
	    var multiple = (fObj.PGTuid === undefined);
	    if(!multiple){
		var PGTuid = fObj.PGTuid;
		motifs_props.MotifElem_focusListing(PGTuid, {
		    focusHighlight: true,
		    removeHighlight: true
		});
	    }
	});

	
	// Fabric Object Event 3: Modification (Object Transformation) completed
	// this event is triggerd one the modification activity is completed.
	canvas.on('object:modified', function(options) {	    
	    if (!options.target) {return;}
	    var multiple = (options.target.PGTuid === undefined);
	    if(!multiple){
		ApplyToSelectedFabricObjects(
		    options.target,
		    function(fObj){Save_Fabric_Obj_Transform(fObj);}
		);
	    }else{
		global.toast("Transformation of multiple objects will be saved only upon group de-selection");
	    }
	    bRescalingToastShownAlready = false;
	});

	
	// Fabric Object Event 4: Rescale in-progress
	// fired continuously during object scaling
	var bRescalingToastShownAlready = false;
	canvas.on('object:scaling', function(options) {	    
	    //show a toast, once.
	    if(options.target && (!bRescalingToastShownAlready)){
		global.toast("Hold CTRL to lock aspect-ratio during rescaling")
		bRescalingToastShownAlready = true;
	    }

	    // snapping the size...
	    // for now, let's only do this for Rectangle...
	    var fObj = options.target;
	    if((fObj.type == "rect") && GridSnappingActive){
		var expanded_rounded_w = Math.round((fObj.width * fObj.scaleX) / GridSize) * GridSize;
		var expanded_rounded_h = Math.round((fObj.height * fObj.scaleY) / GridSize) * GridSize; 
		fObj.set({
		    scaleX: (expanded_rounded_w / fObj.width),
		    scaleY: (expanded_rounded_h / fObj.height)
		});
	    }

	});


	// snapping position to grid
	canvas.on('object:moving', function(options) {
	    if(GridSnappingActive){
		options.target.set({
		    left: Math.round(options.target.left / GridSize) * GridSize,
		    top: Math.round(options.target.top / GridSize) * GridSize
		});
	    }
	});


	// INITIATE the SVG gridlines under the canvas... 
	var draw_4_lines = function(my_set, offset){
	    d3.select('#Motif svg '+my_set)
		.append('line')// pos vertical
		.attr("x1", 199.5 + offset)
		.attr("y1", 0)
		.attr("x2", 199.5 + offset)
		.attr("y2", 399);

	    d3.select('#Motif svg '+my_set)
		.append('line')// pos horizontal
		.attr("x1", 0)
		.attr("y1", 199.5 + offset)
		.attr("x2", 399)
		.attr("y2", 199.5 + offset);

	    if(offset != 0){
		d3.select('#Motif svg '+my_set)
		    .append('line')// neg vertical
		    .attr("x1", 199.5 - offset)
		    .attr("y1", 0)
		    .attr("x2", 199.5 - offset)
		    .attr("y2", 399);

		d3.select('#Motif svg '+my_set)
		    .append('line')// neg horizontal
		    .attr("x1", 0)
		    .attr("y1", 199.5 - offset)
		    .attr("x2", 399)
		    .attr("y2", 199.5 - offset);
	    }

	};

	var draw_grid = function(size, size_str){
	    for (var i = 0; i < 400 ; i += size){
		draw_4_lines("g.gridlines g.cartesian g."+size_str, i);
	    }
	};

	draw_grid(CartesianGridSizes[0], "small");
	draw_grid(CartesianGridSizes[1], "medium");
	draw_grid(CartesianGridSizes[2], "large");


	var draw_circles = function(size, size_str){
	    for (var i = size; i <= 200 ; i += size){
		d3.select("#Motif svg g.gridlines g.polar g." + size_str)
		    .append('circle')
		    .attr("cx", 199.5)
		    .attr("cy", 199.5)
		    .attr("r", i);
	    }
	};

	draw_circles(25, "small");
	draw_circles(50, "medium");
	draw_circles(100, "large");

	var draw_diagonal_lines = function(size, size_str){
	    for (var i = 0; i < 180 ; i += size){
		d3.select("#Motif svg g.gridlines g.polar g." + size_str)
		    .append('line')
		    .attr("x1", 199.5 - 300)
		    .attr("y1", 199.5)
		    .attr("x2", 199.5 + 300)
		    .attr("y2", 199.5)
		    .attr("transform", "rotate("+i+" 199.5 199.5)");
	    }
	};

	draw_diagonal_lines(15, "small");
	draw_diagonal_lines(45, "medium");
	draw_diagonal_lines(90, "large");


	// X. Other initialisation steps relating to the Motif

	// X.x Generate in-memory the property sets relevant to the different shapes (triange circle etc.)
	motifs_props.init_props_perShapeType();


    }

};
