var view_cp = {

    selected_cp_index: undefined,
    table_update_d3: function(select_index){

	var TR_with_innerElements = function(ColourPot,i){
	    return $('<tr/>').append(
		$('<td/>').text(ColourPot.index+1),
		$('<td/>').addClass("description-column").append(
		    $('<input/>')
			.val(ColourPot.description)
			.attr('type', 'text')
			.addClass("table-input-cell")
			.attr('readonly', true)
			.on("focusout", function(){
			    var d3_index = $(this).parent().parent()[0].__data__.index;
			    DM.ColourPotArray[d3_index].description = $(this).val();
			    widgets.table_cell_edit(this,false);
			})
			.click(function(){
			    if(view_cp.selected_cp_index == ColourPot.index){
				widgets.table_cell_edit(this,true);
			    }
			})
		),
		$('<td/>').addClass("preview-column").append(
		    $('<div/>').addClass("preview-container tiny")
			.append(global.$div_array(16, "preview-cell small", ColourPot))
		)
	    )[0];
	}; 

	var TR_click_listener = function(d,i){
	    $("#c-pots-view-table tr.selected").removeClass("selected");
	    $(this).addClass("selected");
	    if(view_cp.selected_cp_index != d.index){
		view_cp.selected_cp_index = d.index;
		view_cp.fill_preview(".preview-container#main-cp-view");
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
	$("#c-pots-view-table tr.selected").removeClass("selected");//keep view sync'ed with data!!!
	if(select_index !== undefined){
	    //This now selects an item in the new list generated

	    d3.select("#c-pots-view-table tbody").selectAll("tr").datum(function(d){
		if(d.index == select_index){
		    $(this).click();
		}
		//line below v.important to prevent detachment of data
		return d;
	    });

/*	    $("#c-pots-view-table tbody tr").each(function() {
		if($(this).data("index") == select_index){

		}
	    });
*/
	}
    },

    //move to more generic location...
    fill_preview: function(container_id, POT){
	var ColourPot = POT;
	if (POT == undefined){
	    ColourPot = DM.ColourPotArray[this.selected_cp_index];
	}
	$(container_id).children().each(function(){
	    $(this).css("background",logic.DrawFromColourPot(ColourPot))
	});
    },

    init: function(){
		
	//add many cells into main preview
	$(".preview-container#main-cp-view").append(
	    global.$div_array(169, "preview-cell big")
	);

	//add initial data for colour pot rows...
	this.table_update_d3();

	//The Edit, Duplicate and Delete buttons underneath the table - click handling...
	$("#cp-view-table-buttons #edit").click(function(){
	    //this needs to do more work, in terms of editing the specific colour pot... TODO.
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		edit_cp.show(index);
	    }
	});

	$("#cp-view-table-buttons #duplicate").click(function(){
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		DM.duplicate_ColourPot(index);
		view_cp.table_update_d3( index+1 );//select the item duplicated
	    }
	});


	$("#cp-view-table-buttons #delete").click(function(){
	    var index = view_cp.selected_cp_index;
	    if(index !== undefined){
		var lowest_row = DM.delete_ColourPot(index);
		view_cp.table_update_d3(index - (lowest_row?1:0));//we now select the next one down...
	    }
	});

	$("#c-pot-view-rerandomise").click(function(){
	    view_cp.fill_preview(".preview-container#main-cp-view");
	});
    }

};
