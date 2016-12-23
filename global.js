var global = {

    init: function(){
	// 1. main the main DIV draggable...
	$("#cpanel-main").draggable({cancel: "div#cpanel-main-body"});

	// 2. add functionality to the "hide" badge"s.c
	$("#cpanel-title-hide").click(function(){
	    
	    //animate Object then hide
	    $("#cpanel-main").animate({
		opacity:0
	    },{
		duration: 1000,
		easing: "linear",
		complete: function(){
		    $("#cpanel-main").hide();
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
		$("#cpanel-main").show().animate({
		    opacity:1
		},{
		    duration: 500,
		    easing: "linear"
		});
	    }
	    if (keyPressed == 'A'){
		view_cp.add_colour_pot_row({
		    number: "xx",
		    description: "dummy row descr."
		});
	    }
	    

	}, false);

	//initiate tabs...
	$("#cpanel-main-tabs").tabs()
	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:0, S:"y", L:"x"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:1, S:"y", L:"x"}));

	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:"x", S:0, L:"y"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:"x", S:1, L:"y"}));

	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:"y", S:"x", L:0}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:"y", S:"x", L:1}));

	$("body").append("<br>");
	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:0.5, S:"y", L:"x"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:"x", S:0.5, L:"y"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#8B149A", {H:"y", S:"x", L:0.5}));






	$("body").append("<br>");
	$("body").append("<br>");
	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:0, S:"y", L:"x"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:1, S:"y", L:"x"}));

	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:"x", S:0, L:"y"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:"x", S:1, L:"y"}));

	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:"y", S:"x", L:0}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:"y", S:"x", L:1}));

	$("body").append("<br>");
	$("body").append("<br>");
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:0.5, S:"y", L:"x"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:"x", S:0.5, L:"y"}));
	$("body").append(gradient_cell.make(40, "#A9A8B8", "#CC6800", {H:"y", S:"x", L:0.5}));

    },

    //adds call-back logic to adjust table columns...
    scrolling_table_init: function(){
	// Change the selector if needed
	var $table = $('table.cpanel-table'),
	$bodyCells = $table.find('tbody tr:first').children(),
	colWidth;

	// Adjust the width of thead cells when window resizes
	$(window).resize(function() {
	    // Get the tbody columns width array
	    colWidth = $bodyCells.map(function() {
		return $(this).width();
	    }).get();
	    
	    // Set the width of thead columns
	    $table.find('thead tr').children().each(function(i, v) {
		$(v).width(colWidth[i]);
	    });    
	}).resize(); // Trigger resize handler
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
});
