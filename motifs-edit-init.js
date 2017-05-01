var motifs_edit_init = {

    init: function(){

	// 1. Add handlers for the "main" (Done / Cancel) buttons...

	// 1.1 - Cancel
	$("#motifs-edit .main-buttons #cancel").click(function(){
	    motifs_edit.hide();
	});
	
	// 1.2 - Done
	$("#motifs-edit .main-buttons #done").click(function(){
	    DM.save_editing_Motif(motifs_view.selected_row_i);
	    motifs_edit.hide();
	    motifs_view.regenerate_table(); // Visual update
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

	$("#motifs-edit .tools .button").click(function(){
	    var was_on = $(this).hasClass("sel");
	    $("#motifs-edit .tools .button").removeClass("sel");
	    $(this).toggleClass("sel", !was_on);// now either 1 or 0 of the buttons is lit up
	    set_Tool( $("#motifs-edit .tools .button.sel").attr("id") );
	});


	// 2.2 - Callback for "mouse-down" event on the interceptor
	var mousedown_left = undefined;
	var mousedown_top = undefined;
	$("#motifs-edit #Motif .interceptor").mousedown(function(event){
	    mousedown_left = event.offsetX;
	    mousedown_top = event.offsetY;
	});


	var rect_params = function(start_x, start_y, now_x, now_y){
	    // Logic here to handle when the mouse moves above/left of the point clicked...
	    return {
		width: Math.abs(now_x - start_x),
		left: (start_x < now_x ? start_x : now_x),
		height: Math.abs(now_y - start_y),
		top: (start_y < now_y ? start_y : now_y)
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

		var MyShapeProps = rect_params(mousedown_left, mousedown_top, canv_mou_x, canv_mou_y);

		//shape is larger that the minimum acceptable size threshold
		if((MyShapeProps.width >= 3) && (MyShapeProps.height >= 3)){

		    //Extend the shape properties object...
		    $.extend(MyShapeProps, {
			shape: Tool_selected,
			fill:   $("#motifs-edit .fill .mini-picker").colorpicker().toCssString('rgba'),
			stroke: $("#motifs-edit .outl .mini-picker").colorpicker().toCssString('rgba'),
			strokeWidth: 4
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
		    motifs_props.AddMotifElem_itemHTML(new_uid, MyShapeProps);

		    
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
		    rect_params(mousedown_left, mousedown_top, canv_mou_x, canv_mou_y)
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
	





	/// 3.x colour pickers...
	$("#motifs-edit .fill .mini-picker").colorpicker({
	    color: 'rgba(255, 179, 0, 0.5)',
	});

	$("#motifs-edit .outl .mini-picker").colorpicker({
	    color: 'rgb(86, 26, 216)',
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

	
	
	// 4.4.1 - Controlling line faintness
	$("#motifs-edit #grid-settings .btn-set.weight > button").click(function(){
	    var btn_class = $(this).attr("class");
	    d3.select("#Motif svg g.gridlines").classed("faint", btn_class == "faint");
	    d3.select("#Motif svg g.gridlines").classed("strong", btn_class == "strong");
	});

	// 4.4.2 - Controlling grid size
	$("#motifs-edit #grid-settings .btn-set.size > button").click(function(){
	    var btn_class = $(this).attr("class");

	    // "selectAll" selects both the polar and cartesian
	    d3.selectAll("#Motif svg g.gridlines g.small").classed("hidden", btn_class != "small");
	    d3.selectAll("#Motif svg g.gridlines g.medium").classed("hidden", btn_class != "medium");
	    d3.selectAll("#Motif svg g.gridlines g.large").classed("hidden", btn_class != "large");
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



	// 6. Other initialisation steps relating to the Motif

	// 6.1. Generate in-memory the property sets relevant to the different shapes (triange circle etc.)
	motifs_props.init_props_lists_per_shape();










	
	
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
		    // this "real element" extraction does not seem to add anything or solve the problem.
		    // Remove it please, and understand the real cause.
		    var Filter = function(El){return El.PGTuid == element.PGTuid;}
		    var real_element = $.grep(canvas._objects, Filter)[0];
		    my_cb(real_element);
		});
	    }
	    return multiple;
	};

	
	// Fabric Object Event 1: Select
	canvas.on('object:selected', function(options) {
	    if (!options.target) {return;}
	    // 1. Snapshot selected element
	    var multiple = ApplyToSelectedFabricObjects(
		options.target,
		function(fObj){// Take props Snapshot
		    console.log("snapshotting:", fObj.PGTuid);
		    fObj.props_preTransform = {
			left: fObj.left,
			top: fObj.top,
			width: fObj.width,
			height: fObj.height,
			angle: fObj.angle,
			rx: fObj.rx,
			ry: fObj.ry
		    };
		}
	    );
	    // 2. Focus the selected element in the list
	    if(multiple){
		global.toast("Group selection made");
	    }else{
		var PGTuid = options.target.PGTuid;
		motifs_props.MotifElem_focusListing(PGTuid, {
		    autoScroll: true,
		    focusHighlight: true
		});
	    }	    
	});

	
	// Fabric Object Event 2: Clear Selection
	canvas.on('before:selection:cleared', function(options) {
	    if(!options.target) {return;}
	    var multiple = (Selection.PGTuid === undefined);
	    // 2. Defocus the selected element in the list	    
	    if(multiple){
		var PGTuid = options.target.PGTuid;
		motifs_props.MotifElem_focusListing(PGTuid, {
		    focusHighlight: true,
		    removeHighlight: true
		});
	    }
	});

	
	// Fabric Object Event 3: Modify
	// this event is triggerd one the modification activity is completed.
	canvas.on('object:modified', function(options) {	    
	    if (!options.target) {return;}
	    ApplyToSelectedFabricObjects(
		options.target,
		function(fObj){
		    // 1. set scaleX & scaleY params to 1, and rescale size properties directly
		    $.each({
			"ellipse":  {Qx: "rx", Qy: "ry" },
			"rect":     {Qx: "width", Qy: "height" },
			"triangle": {Qx: "width", Qy: "height" },
			"polygon":  {},
			"line":     {Qx: "width", Qy: "height" }
		    }, function( shape_type, props ) {//applied for each shape type
			if(fObj.type != shape_type){return;}
			if(fObj.scaleX != 1){
			    fObj[props.Qx] = Math.round(fObj[props.Qx] * fObj.scaleX, 0);
			    fObj.scaleX = 1;
			}
			if(fObj.scaleY != 1){
			    fObj[props.Qy] = Math.round(fObj[props.Qy] * fObj.scaleY, 0);
			    fObj.scaleY = 1;
			}
		    });

		    // 2. What changed? iterate through the properties that *may* be modified
		    var cng = {};
		    console.log("fobj:", fObj.PGTuid, " - fObj.props_preTransform:", fObj.props_preTransform);
		    $.each(fObj.props_preTransform, function( key, value ) {
			if(value != fObj[key]){// property is changed.
			    cng[key] = Math.round(10 * fObj[key]) / 10;// 1dp precision fine for px and angles
			}
		    });
		    console.log("transforming:", fObj.PGTuid, "; change:", cng);
		    
		    // 3. Enact change (acts upon 1. Fabric;  2. DM;  3. HTML  (n.b. (re)editing Fabric Obj is harmless))
		    motifs_edit.updateMotifElement(fObj.PGTuid, cng);
		}
	    );
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

	draw_grid(10, "small");
	draw_grid(25, "medium");
	draw_grid(50, "large");


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


    }

};
