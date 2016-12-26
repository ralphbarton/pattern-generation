var view_cp = {

    init: function(){
		
	//add initial data for colour pot rows...
	this.refresh_colour_pot_table();

	//add many cells into main preview
	$("#colour-pots-sample-container").append(
	    global.$div_array(169, "preview-cell-big")
	);

	//The Edit, Duplicate and Delete buttons underneath the table - click handling...
	$("#color-pot-array-options #edit").click(function(){
	    //this needs to do more work, in terms of editing the specific colour pot... TODO.
	    var index = view_cp.selected_cp_index;
	    edit_cp.show(index);
	});

	$("#color-pot-array-options #duplicate").click(function(){
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		DM.duplicate_ColourPot(index);
		view_cp.refresh_colour_pot_table( index+1 );//select the item duplicated
	    }
	});


	$("#color-pot-array-options #delete").click(function(){
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		DM.delete_ColourPot(index);
		view_cp.refresh_colour_pot_table();
		view_cp.selected_cp_index = undefined;
	    }
	});


    },

    selected_cp_index: undefined,
    refresh_colour_pot_table: function(select_index){
	$("#c-pots-view-table tbody").empty();//clear content
	var List = DM.ColourPotArray;
	for (var i=0; i < List.length; i++){
	    this.add_colour_pot_row(List[i]);  
	}

	this.selected_cp_index = undefined;// re-initialise. Code below may set it.
	if(select_index !== undefined){
	    //This now selects an item in the new list generated
	    $("#c-pots-view-table tbody tr").each(function() {
		if($(this).data("index") == select_index){
		    $(this).click();
		}
	    });
	}

    },

    add_colour_pot_row: function(ColourPot){
	$("#c-pots-view-table tbody").append(
	    $('<tr/>').data({index: ColourPot.index})
		.append(
		$('<td/>').text(ColourPot.index+1),//I prefer 1-index values for the user...
		$('<td/>').text(ColourPot.description).click(function(){// clicked on DESCRIPTION cell
		    console.log("description clicked");
		    //replace cell contents with an INPUT element
		}),

		//Create the Preview cell...
		$('<td/>').addClass("preview-column").append(
		    $('<div/>').addClass("preview-container").append(global.$div_array(16, "preview-cell", ColourPot))
		)
	    ).click(function(){ // this is the callback for clicking on the whole ROW
		$("#c-pots-view-table tr").removeClass("selected");
		$(this).addClass("selected");
		var pot_index = $(this).data("index");
		var ColourPot = DM.ColourPotArray[pot_index];
		$("#colour-pots-sample-container").children().each(function(){
		    $(this).css("background",logic.DrawFromColourPot(ColourPot))
		});
		view_cp.selected_cp_index = pot_index;
	    })
	)
    }

};
