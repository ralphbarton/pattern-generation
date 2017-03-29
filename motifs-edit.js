var motifs_edit = {

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
	$("#motifs-edit .tools .button").click(function(){
	    var was_on = $(this).hasClass("sel");
	    $("#motifs-edit .tools .button").removeClass("sel");
	    $(this).toggleClass("sel", !was_on);

	    // at this point, either 1 or 0 of the buttons is lit up, depending upon user's wishes...
	    Tool_selected = $("#motifs-edit .tools .button.sel").attr("id");
	    $("#motifs-edit #Motif .interceptor").toggleClass("active", Tool_selected !== undefined);

	});

	// 2.2 - Callback for "mouse-down" event on the interceptor
	var mousedown_left = undefined;
	var mousedown_top = undefined;
	$("#motifs-edit #Motif .interceptor").mousedown(function(event){
	    mousedown_left = event.offsetX;
	    mousedown_top = event.offsetY;
	});


	// 2.3 - Callback for "mouse-up" event on the interceptor
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

		// create a rectangle object
		var new_shape = undefined;
		console.log(Tool_selected);
		if(Tool_selected == "shap1"){//circle
		    new_shape = new fabric.Ellipse({
			left: USR.left,
			top: USR.top,
			fill: 'red',
			rx: (USR.width/2),
			ry: (USR.height/2)
		    });

		}else if(Tool_selected == "shap2"){//rectangle
		    new_shape = new fabric.Rect();

		}else if(Tool_selected == "shap3"){//triangle
		    new_shape = new fabric.Triangle();

		}else if(Tool_selected == "shap4"){//hexagon
		    new_shape = new fabric.Rect();

		}else if(Tool_selected == "shap5"){//line
		    new_shape = new fabric.Line();
		    new_shape.set({
			strokeWidth: 1,
			stroke: 'black'
		    });

		}

		if((Tool_selected == "shap2")||(Tool_selected == "shap3")||(Tool_selected == "shap5")){
		    new_shape.set({
			left: USR.left,
			top: USR.top,
			fill: 'blue',
			width: USR.width,
			height: USR.height
		    });
		}

		// "add" rectangle onto canvas
		canvas.add(new_shape);

	    }

	    // record that the mouse is now UP...
	    mousedown_left = undefined;
	    mousedown_top = undefined;
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



	// FABRIC...

	// create a wrapper around native canvas element (with id="c")
	var my_canv_El = $("#motifs-edit #Motif > canvas")[0];
	var canvas = new fabric.Canvas(my_canv_El);

    },


    show: function(){
	$(".cpanel#main").removeClass("cpanel-main-size1").addClass("cpanel-main-size3");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", true); // Disable main tab set
	$("#motifs-view").hide();
	$("#motifs-edit").show();
    },


    hide: function(){
	$(".cpanel#main").removeClass("cpanel-main-size3").addClass("cpanel-main-size1");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", false); // Enable main tab set
	$("#motifs-view").show();
	$("#motifs-edit").hide();
    }


};
