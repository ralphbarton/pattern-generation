var global = {

    init: function(){
	// 1. main the main DIV draggable...
	$(".cpanel#main").draggable({cancel: "div#cpanel-main-body"});

	// 2. add functionality to the "hide" badge"s.c
	$("#cpanel-title-hide").click(function(){
	    
	    //animate Object then hide
	    $(".cpanel#main").animate({
		opacity:0
	    },{
		duration: 1000,
		easing: "linear",
		complete: function(){
		    $(".cpanel#main").hide();
		}
	    });
	});

	//add keystroke handling
	document.addEventListener("keydown",function(e){
	    var myKeycode = e.keyCode;
	    var keyPressed = String.fromCharCode(myKeycode);//note that this is non-case sensitive.

	    /* my key assignments
	       A - add row
	       B
	       C
	       D
	       E
	       F
	       G
	       H - restore box
	       I
	       J
	       K
	       L
	       M
	       N
	       O
	       P
	    */

	    if (keyPressed == 'H'){
		//animate Object then hide
		$(".cpanel#main").show().animate({
		    opacity:1
		},{
		    duration: 500,
		    easing: "linear"
		});
	    }
	    if (keyPressed == 'A'){
		//Action for 'A' pressed


	    }
	    

	}, false);

	//initiate tabs...
	$("#cpanel-main-tabs").tabs()

    },

    $div_array:function(qty, my_class, ColourPot){//function to generate many mini DIVs
	var tinies = [];
	for(var i=0; i<qty; i++){
	    var cell_colour = ColourPot ? logic.DrawFromColourPot(ColourPot) : "white";
	    tinies.push(
		$('<div/>').addClass(my_class).css("background",cell_colour)
	    );
	}
	return tinies;
    }

};


// executive code...
$(document).ready(function() {
    global.init();

    view_cp.init();
    grids.init();

    plots.init();

    export_pat.init();

    gallery.init();

    motifs_view.init();
    motifs_edit.init();

    //code to auto enter CP edit and speed up testing...

/*
    //go straight to CP edit
    $("#view-cp-table tbody tr").first().click();
    $("#cp-view-table-buttons #edit").click();


    //go straight to Grids ( = 3rd tab...)
    $("#cpanel-main-tabs > ul > li:nth-of-type(3) a").click();


    //go straight to Grids ( = 4rd tab...)
    $("#cpanel-main-tabs > ul > li:nth-of-type(8) a").click();
*/

    //go straight to Motifs ( = 6th tab...)
    $("#cpanel-main-tabs > ul > li:nth-of-type(6) a").click();
    // --> and into Motif EDIT
    $("#motifs-view .table-buttons #edit").click();

});

