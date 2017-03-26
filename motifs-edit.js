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
	$("#motifs-edit #Motif").mousemove(function( event ) {
	    
	    //offsetX attribute of event is position relative to the DIV the mouse is over
	    $("#motifs-edit .mouse-coords .x").text( (event.offsetX - 200) );
	    $("#motifs-edit .mouse-coords .y").text( (event.offsetY - 200) );

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
