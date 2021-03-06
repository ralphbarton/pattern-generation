var cpot_view = {

    selected_cp_index: undefined,
    regenerate_table: function(select_index){

	var TR_with_innerElements = function(ColourPot,i){
	    return $('<tr/>').append(
		$('<td/>').addClass("col-1").text(i+1),
		$('<td/>').addClass("col-2").append(
		    $('<input/>')
		    	.addClass("blue-cell")//for css styling
			.SmartInput({
			underlying_obj: DM.cpotArray[i],
			underlying_key: "description",
			data_class: "text",
			text_length: 18,//max name length 18 char
			click_filter: function(){return cpot_view.selected_cp_index == i;}
		    })
		),
		$('<td/>').addClass("col-3").append(
		    $('<div/>').addClass("preview-container tiny chequer")
			.append(global.$div_array(16, "preview-cell small", ColourPot))
		)
	    );
	};

	//wipe the entire table of rows...
	$("#view-cp-table tbody").html("");

	this.selected_cp_index = undefined;// re-initialise. Code below may set it.

	DM.cpotArray.forEach(function(ColourPot_obj, i){
    	    $("#view-cp-table tbody").append(// add a row into table here...
		TR_with_innerElements(ColourPot_obj, i)
		    .on("click", function(){
			if(cpot_view.selected_cp_index != i){//a previously unselected row clicked
			    $("#view-cp-table tr.selected").removeClass("selected");
			    $(this).addClass("selected");
			    cpot_view.selected_cp_index = i;
			    cpot_view.fill_preview(".preview-container#main-cp-view");
			}
		    })
		    .on("my_onLoad", function(){
			// this ineligant code may "click" one of the table rows, upon generation...
			if((select_index !== undefined) &&((i == select_index))){
			    $(this).click();
			}
		    }).trigger("my_onLoad")
	    );
	});
    },

    //move to more generic location...
    fill_preview: function(container_id, POT){
	var ColourPot = POT;
	if (POT == undefined){
	    ColourPot = DM.cpotArray[this.selected_cp_index];
	}
	$(container_id).children().each(function(){
	    $(this).css("background", cpot_util.DrawFromColourPot(ColourPot))
	});
    },

    init: function(){
		
	//add many cells into main preview
	$(".preview-container#main-cp-view").append(
	    global.$div_array(169, "preview-cell big")
	);

	//add initial data for colour pot rows...
	this.regenerate_table();

	//The Edit, Duplicate and Delete buttons underneath the table - click handling...
	$("#cp-view-table-buttons #edit").click(function(){
	    //this needs to do more work, in terms of editing the specific colour pot... TODO.
	    var index = cpot_view.selected_cp_index;
	    if(index !== undefined){
		cpot_edit.show(index);
	    }
	});

	$("#cp-view-table-buttons #duplicate").click(function(){
	    var index = cpot_view.selected_cp_index;
	    if(index !== undefined){
		DM.cpot_Duplicate(index);
		cpot_view.regenerate_table( index+1 );//select the item duplicated
	    }
	});


	$("#cp-view-table-buttons #delete").click(function(){
	    var index = cpot_view.selected_cp_index;
	    if(index !== undefined){
		var lowest_row = DM.cpot_Delete(index);
		cpot_view.regenerate_table(index - (lowest_row?1:0));//we now select the next one down...
	    }
	});

	$("#c-pot-view-rerandomise").click(function(){
	    cpot_view.fill_preview(".preview-container#main-cp-view");
	});
    }

};
