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

    export_pat.init();

    //code to auto enter CP edit and speed up testing...
    $("#c-pots-view-table tbody tr").first().click();
    $("#cp-view-table-buttons #edit").click();

});

