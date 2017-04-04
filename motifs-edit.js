var motifs_edit = {

    Fabric_Canvas: undefined,
    init: function(){

	// 1. Add handlers for the "main" (Done / Cancel) buttons...

	// 1.1 - Done
	$("#motifs-edit .main-buttons #done").click(function(){
	    motifs_edit.hide();
	});

	// 1.2 - Cancel
	$("#motifs-edit .main-buttons #cancel").click(function(){
	    motifs_edit.hide();
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

		var USR = rect_params(mousedown_left, mousedown_top, canv_mou_x, canv_mou_y);

		//Function to Add a shape (Element) via Fabric canvas and via Datamodel...
		motifs_props.AddShape(Tool_selected, USR);
		if(!draw_many){
		    set_Tool(undefined);// if a shape has been drawn...
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

	// 4.1 - Toolbox: draw one vs. draw many
	var draw_many = true;
	widgets.actionLink_init("#motifs-edit .tools .shapes .act-mutex#draw-one-many",[
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
	widgets.actionLink_init("#motifs-edit .act-mutex#background-w-1-2-b",[
	    function(){  set_bg_layer_config({ly2_col: "white", ly3_opac: 0});  },
	    function(){  set_bg_layer_config({ly2_col: "white", ly3_opac: 1});  },
	    function(){  set_bg_layer_config({ly2_col: "none",  ly3_opac: 0});  },
	    function(){  set_bg_layer_config({ly2_col: "black", ly3_opac: 0});  }
	]);

	// 4.3 - Above Motif: turn axes ON / OFF
	var set_axes_style = function(options){
	    $("#Motif svg#axes")
		.css("opacity", options.opac);
	};

	widgets.actionLink_init("#motifs-edit .act-mutex#motif-axes",[
	    function(){set_axes_style({opac:0});},
	    function(){set_axes_style({opac:1});}
	]);






	// 5. FABRIC...

	// create a wrapper around native canvas element (with id="c")
	var my_canv_El = $("#motifs-edit #Motif > canvas")[0];
	var canvas = new fabric.Canvas(my_canv_El);
	this.Fabric_Canvas = canvas;

	// Disables the locked aspect ratio scaling when dragging corner-points, which is the default behaviour
	canvas.uniScaleTransform = true;



	// 6. Other initialisation steps relating to the Motif

	// 6.1. Generate in-memory the property sets relevant to the different shapes (triange circle etc.)
	motifs_props.init_props_lists_per_shape();

	// 6.2. Add listeners for object selection events happening on the canvas
	motifs_props.init_canvas_selection_events();



    },





    active: false,
    show: function(){
	$(".cpanel#main").removeClass("cpanel-main-size1").addClass("cpanel-main-size3");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", true); // Disable main tab set
	$("#motifs-view").hide();
	$("#motifs-edit").show();
	this.active = true;
    },


    hide: function(){
	$(".cpanel#main").removeClass("cpanel-main-size3").addClass("cpanel-main-size1");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", false); // Enable main tab set
	$("#motifs-view").show();
	$("#motifs-edit").hide();
	this.active = false;
    },

    keyStrokeHandler: function(myKeycode, keyPressed){
	
	var canvas = this.Fabric_Canvas;
	//Delete key pressed...
	if(myKeycode == 46){
	    var activeObject = canvas.getActiveObject(),
	    activeGroup = canvas.getActiveGroup();
	    if (activeObject) {
		canvas.remove(activeObject);
	    }
	    else if (activeGroup) {
		var objectsInGroup = activeGroup.getObjects();
		canvas.discardActiveGroup();
		objectsInGroup.forEach(function(object) {
		    canvas.remove(object);
		});
	    }
	}

	//an ARROW key pressed...
	else if((myKeycode >= 37)&&(myKeycode <= 40)){
	    //This code is copy-pasted from the code to delete an object. is generalisation possible / worthwhile??

	    var activeObject = canvas.getActiveObject(),
	    activeGroup = canvas.getActiveGroup();
	    if (activeObject) {
		motifs_edit.moveFabricObj(myKeycode, activeObject);
	    }
	    else if (activeGroup) {
		var objectsInGroup = activeGroup.getObjects();
		objectsInGroup.forEach(function(object) {
		    motifs_edit.moveFabricObj(myKeycode, object);
		});
	    }

	    
	}

    },


	/*
	  left arrow 37
	  up arrow 38
	  right arrow 39
	  down arrow 40 
	*/
    moveFabricObj: function(keyCode, object){

	var cng = undefined;
	if(keyCode == 37){
	    cng = {'left': (object.left - 1)};
	}else if(keyCode == 38){
	    cng = {'top': (object.top - 1)};
	}else if(keyCode == 39){
	    cng = {'left': (object.left + 1)};
	}else if(keyCode == 40){
	    cng = {'top': (object.top + 1)};
	}

	// execute the 1px MOVE
	object.set(cng);
	object.setCoords(); // this recalculates the Fabric's click detection for the object.
	var canvas = this.Fabric_Canvas;
	canvas.renderAll(); // n.b. setCoords() doesn't negate the need for this!

    },


    regenerateMotifPropsList: function(){

	//this will need to do something like calling " motifs_props.AddMotifElem_itemHTML() " for each motif element

    }


};
