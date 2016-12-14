cpanel = {

    init_cpanel: function(){
	
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
		cpanel.add_colour_pot_row();
	    }
	    

	}, false);

	//initiate tabs...
	$("#cpanel-main-tabs").tabs();

	//initial scroll table
	this.scrolling_table_init();
	
    },

    add_colour_pot_row: function(){
	$("#cpanel-table-colour-pots-list").append(
	    $('<tr/>').append(
		$('<td/>').text("A"),
		$('<td/>').text("B"),
		$('<td/>').text("C"),
		$('<td/>').text("D")
	    ).click(function(){
		$(this).addClass("selected");
		//also need to de-select all previous...
	    })
	)
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
    }

}



// executive code...
$(document).ready(function() {
    cpanel.init_cpanel();
});


