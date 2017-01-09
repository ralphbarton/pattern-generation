var grids = {

    init: function(){

	this.table_update();

	// Handler for -DUPLICATE-
	$("#grids-buttons #duplicate").click(function(){
	    //mutate the data structure
	    if(grids.selected_row_i != undefined){
		DM.duplicate_grid(grids.selected_row_i);
		//select the row just created...
		grids.selected_row_i += 1;
		//refresh view
		grids.table_update();
	    }
	});

	// Handler for -DELETE-
	$("#grids-buttons #delete").click(function(){
	    if(grids.selected_row_i != undefined){
		//mutate the data structure
		DM.deleteRow_grid(grids.selected_row_i);
		//select the row just created...
		grids.selected_row_i = Math.min(grids.selected_row_i, DM.GridsArray.length-1);
		//refresh view
		grids.table_update();
	    }
	});


    },

    selected_row_i: undefined,
    table_update: function(){

	//wipe the entire table of rows...
	$("#grids-table tbody").html("");

	DM.GridsArray.forEach(function(grid_obj, i){

    	    $("#grids-table tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>')
				.val(grid_obj.description)
				.attr('type', 'text')
				.addClass("blue-cell")
				.attr('readonly', true)
				.on("focusout", function(){
				    //update underlying data here...
				    DM.GridsArray[i].description = $(this).val();
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

			// 1. manage row selection witin the table itself
			$("#grids-table tr.selected").removeClass("selected");
			$(this).addClass("selected");
			grids.selected_row_i = $(this).data("index");

			// 2. populate the right section of screen using data from that specific grid

			//q1=angle, q2=spacing
			var Gx = DM.GridsArray[i];
			$("#line-set-1 .q1 input").val(Gx.angle1);
			$("#line-set-1 .q2 input").val(Gx.spacing1.v);
			$("#line-set-2 .q1 input").val(Gx.angle2);
			$("#line-set-2 .q2 input").val(Gx.spacing2.v);

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
