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
	    var Tool_selected = $("#motifs-edit .tools .button.sel").attr("id");
	    $("#motifs-edit #Motif .interceptor").toggleClass("active", Tool_selected !== undefined);

	});

	// 2.2 - Callback for "mouse-down" event on the interceptor
	var BL_left = undefined;
	var BL_top = undefined;
	$("#motifs-edit #Motif .interceptor").mousedown(function(event){

	    BL_left = event.offsetX;
	    BL_top = event.offsetY;
	    $("#motifs-edit .interceptor > div")
		.show()
		.css({
		    left: event.offsetX,
		    top: event.offsetY
		});
	});


	// 2.3 - Callback for "mouse-up" event on the interceptor
	$("#motifs-edit #Motif .interceptor").mouseup(function(){
	    $("#motifs-edit .interceptor > div").hide();
	});


	// 2.4 - Callback for "mouse-move" event on canvas *Container* 
	$("#motifs-edit #Motif").mousemove(function( event ) {
	    
	    //offsetX attribute of event is position relative to the DIV the mouse is over
	    $("#motifs-edit .mouse-coords .x").text( (event.offsetX - 200) );
	    $("#motifs-edit .mouse-coords .y").text( (event.offsetY - 200) );
//	    console.log(event);

	    $("#motifs-edit .interceptor > div")
		.css({
		    width: (event.offsetX - BL_left),
		    height: (event.offsetY - BL_top)
		});


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

	// create a rectangle object
	var rect = new fabric.Rect({
	    left: 100,
	    top: 100,
	    fill: 'red',
	    width: 80,
	    height: 120
	});

	// "add" rectangle onto canvas
	canvas.add(rect);

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
