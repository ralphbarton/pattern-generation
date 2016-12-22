var cpanel = {

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
		cpanel.add_colour_pot_row({
		    number: "xx",
		    description: "dummy row descr."
		});
	    }
	    

	}, false);

	//initiate tabs...
	$("#cpanel-main-tabs").tabs();
	
	//add initial data for colour pot rows...
	this.refresh_colour_pot_table();

	//initial scroll table - needs data in rows to work...
	this.scrolling_table_init();

	//add many cells into main preview
	$("#colour-pots-sample-container").append(
	    this.$div_array(169, "preview-cell-big")
	);
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
    },

    refresh_colour_pot_table: function(){
	$("#cpanel-table-colour-pots-list tbody").empty();//clear content
	var List = DM.ColourPotArray;
	for (var i=0; i < List.length; i++){
	    this.add_colour_pot_row(List[i]);  
	}
    },

    add_colour_pot_row: function(ColourPot){
	$("#cpanel-table-colour-pots-list tbody").append(
	    $('<tr/>').data({index: ColourPot.index})
		.append(
		$('<td/>').text(ColourPot.index+1),//I prefer 1-index values for the user...
		$('<td/>').text(ColourPot.description).click(function(){// clicked on DESCRIPTION cell
		    console.log("description clicked");
		    //replace cell contents with an INPUT element
		}),

		//Create the Pr cell...
		$('<td/>').addClass("preview-column").append(
		    $('<div/>').addClass("preview-container").append(this.$div_array(16, "preview-cell", ColourPot))
		),

		//Create the EDIT-DELETE-DUPLICATE cell...
		$('<td/>').addClass("action-column").append(
		    $('<span/>').addClass("action edit").text("Edit").show().click(function(){edit_cp.show();}),
		    $('<span/>').addClass("action dupl").text("Duplic.").hide().click(function(){
			var index = $(this).parent().parent().data("index");
			DM.duplicate_ColourPot(index);
			cpanel.refresh_colour_pot_table();
		    }),
		    $('<span/>').addClass("action dele").text("Delete").hide().click(function(){
			console.log("Delete button click");
		    }),
		    $('<img/>').attr("src","/icons/sort.svg")
			.attr("class","img-recycle")
			.data({cycler:1})
			.click(function(){//code to implement the swap-contents functionality...
			    var x = $(this).data("cycler");//read
			    x++;
			    if (x>3){x=1;}
			    var $edit = $(this).parent().find(".edit");
			    var $dupl = $(this).parent().find(".dupl");
			    var $dele = $(this).parent().find(".dele");
			    if(x==1){$edit.show(); $dupl.hide(); $dele.hide();}
			    if(x==2){$edit.hide(); $dupl.show(); $dele.hide();}
			    if(x==3){$edit.hide(); $dupl.hide(); $dele.show();}
			    $(this).data({cycler:x});
			})
		)

	    ).click(function(){ // this is the callback for clicking on the whole ROW
		$("#cpanel-table-colour-pots-list tr").removeClass("selected");
		$(this).addClass("selected");
		var pot_index = $(this).data("index");
		var ColourPot = DM.ColourPotArray[pot_index];
		$("#colour-pots-sample-container").children().each(function(){
		    $(this).css("background",logic.DrawFromColourPot(ColourPot))
		});
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


