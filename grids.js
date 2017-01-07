var grids = {

    init: function(){

	this.table_update();

	// Handler for -DUPLICATE-
	$("#grids-buttons #duplicate").click(function(){
	    //mutate the data structure
	    DM.duplicate_grid(this.selected_row_i);
	    //select the row just created...
	    this.selected_row_i += 1;
	    //refresh view
	    grids.table_update();
	});

	// Handler for -DELETE-
	$("#grids-buttons #delete").click(function(){
	    //mutate the data structure
	    DM.deleteRow_grid(this.selected_row_i);
	    //select the row just created...
	    this.selected_row_i = Math.min(this.selected_row_i, DM.GridsArray.length-1);
	    //refresh view
	    grids.table_update();
	});


    },

    selected_row_i: undefined,
    table_update: function(){

	//wipe the entire table of rows...
	$("#grids-table tbody").html("");

	DM.GridsArray.forEach(function(grid_obj, i){

	    console.log("adding row", i);
    	    $("#grids-table tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>')
				.val(grid_obj.description)
				.attr('type', 'text')
				.addClass("table-input-cell")
				.attr('readonly', true)
				.on("focusout", function(){
				    //update underlying data here...
				    widgets.table_cell_edit(this,false);
				})
				.click(function(){ //click on the input element
				    var jquery_tr_index = $(this).parent().parent().data("index");
				    if(grids.selected_row_i == jquery_tr_index){
					widgets.table_cell_edit(this,true);
				    }
				})
			)
		    ).on("click",function(){ //click on the row
			$("#grids-table tr.selected").removeClass("selected");
			$(this).addClass("selected");
			grids.selected_row_i = $(this).data("index");
		    })
	    );





	    //edit_cp.table_row(element, i);
	});

	// use click handler to achieve re-selection
/*
	if(this.selected_row_i != undefined){
	    var tr_selected = $("#c-pot-edit-table tbody tr")[this.selected_row_i];
	    this.selected_row_i = undefined;//reset selection - necessary for effect of next line
	    tr_selected.click();
	}
*/
	
    },

};
