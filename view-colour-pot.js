var view_cp = {

    selected_cp_index: undefined,
    table_update_d3: function(select_index){

	var description_focusOut = function(){
	    // fortunately, "focusout" is triggered by change of tab, visibility etc.
	    var d3_index = $(this).parent().parent()[0].__data__.index;
	    DM.ColourPotArray[d3_index].description = $(this).val();
	};

	var TR_with_innerElements = function(ColourPot,i){
	    return $('<tr/>').append(
		$('<td/>').text(ColourPot.index+1),
		$('<td/>').append(
		    $('<input/>')
			.attr('type', 'text')
			.addClass("input-view-cp")
			.val(ColourPot.description)
			.on( "focusout", description_focusOut )
		),
		$('<td/>').addClass("preview-column").append(
		    $('<div/>').addClass("preview-container")
			.append(global.$div_array(16, "preview-cell", ColourPot))
		)
	    )[0];
	}; 

	var TR_click_listener = function(d,i){
	    $("#c-pots-view-table tr.selected").removeClass("selected");
	    $(this).addClass("selected");
	    //here, we use "i" rather than "d.index".
	    // there is some kind of probem with the "d" supplied via the update selection (fine for enter selection)
	    if(view_cp.selected_cp_index != i){
		view_cp.selected_cp_index = i;
		view_cp.fill_preview();
	    }
	};

	var selection = d3.select("#c-pots-view-table tbody").selectAll("tr")
	    .data(DM.ColourPotArray);

	// 1. update function for a <tr> element...
	selection
	    .on("click", TR_click_listener)//add to each selected element (hence location in chain)
	    .append(function(d,i){
		//use $(this) for side effects...
		$(this)
		    .html("")
		    .append(
			$(TR_with_innerElements(d)).children()
		    );

		return $("<p/>")[0];// return a useless element
	    }).remove();// and remove the useless element we just added


	// 2. 'create-new' function for a <tr> element...
	selection.enter()
	    .append(TR_with_innerElements)
	    .on("click", TR_click_listener);//add it to the appended TR element (hence location in chain)



	// 3. delete function for a <tr> element...
	selection.exit().remove();

	// 4. this ineligant code will "click" one of the rows of the table for you
	this.selected_cp_index = undefined;// re-initialise. Code below may set it.
	if(select_index !== undefined){
	    //This now selects an item in the new list generated

	    d3.select("#c-pots-view-table tbody").selectAll("tr").datum(function(d){
		if(d.index == select_index){
		    $(this).click();
		}
	    });

/*	    $("#c-pots-view-table tbody tr").each(function() {
		if($(this).data("index") == select_index){

		}
	    });
*/
	}
    },

    fill_preview: function(){
	var ColourPot = DM.ColourPotArray[this.selected_cp_index];
	$("#colour-pots-sample-container").children().each(function(){
	    $(this).css("background",logic.DrawFromColourPot(ColourPot))
	});
    },

    init: function(){
		
	//add many cells into main preview
	$("#colour-pots-sample-container").append(
	    global.$div_array(169, "preview-cell-big")
	);

	//add initial data for colour pot rows...
	this.table_update_d3();

	//The Edit, Duplicate and Delete buttons underneath the table - click handling...
	$("#color-pot-array-options #edit").click(function(){
	    //this needs to do more work, in terms of editing the specific colour pot... TODO.
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		edit_cp.show(index);
	    }
	});

	$("#color-pot-array-options #duplicate").click(function(){
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		DM.duplicate_ColourPot(index);
		view_cp.table_update_d3( index+1 );//select the item duplicated
	    }
	});


	$("#color-pot-array-options #delete").click(function(){
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		DM.delete_ColourPot(index);
		view_cp.table_update_d3(index);//we now select the next one down...
	    }
	});

	$("#c-pot-view-rerandomise").click(function(){
	    view_cp.fill_preview();
	});
    }

};
