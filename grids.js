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

	// add logic to the action links
	widgets.actionLink_init("#preset-grid.act-mutex",[
	    function(){
		//callback 1
		console.log("Isometric commanded");
	    },
	    function(){
		//callback 2
		console.log("Square commanded");
	    },
	    function(){
		//callback 3
		console.log("Diamond commanded");
	    }]
			       );
	//put them all "set" (in fact, this command will be needed every time a manual mutation is done)
	widgets.actionLink_unset("#preset-grid.act-mutex", null);


	//add logic for input boxes:

	//function to modify grid array
	var GA_mod = function(obj, ls, key){
	    // 'obj' - input elem
	    // 'ls' - line set (0,1)
	    // 'key' - angle / spacing / shift
	    var my_i = grids.selected_row_i;
	    if(my_i != undefined){
		//parse int logic probably needed here
		var my_val = $(obj).val();
		DM.GridsArray[my_i].line_sets[ls][key] = my_val;

		if(key=="angle"){

		    var dy = ls ? 8 : 62;
		    var svg_id = "#svg-angle-" + (ls+1);
		    var my_val = ls ? my_val : -my_val;

		    d3.select(svg_id + " #my_arrow")
			.transition()
			.duration(500)
			.attr("transform", "translate(8 "+dy+") rotate("+my_val+")");
		}

	    }
	};

	// change grid array units...
	var GAu_mod = function(ls, u){
	    var my_i = grids.selected_row_i;
	    if(my_i != undefined){
		DM.GridsArray[my_i].line_sets[ls]["spacing_unit"] = u;
		// also take action here to convert the spacing value,
		// such that it is equivalent with new units...
	    }
	};

	//callbacks for all input boxes.....
	$("#line-set-1 .k-ang  input").on("focusout", function(){GA_mod(this, 0, "angle")});
	$("#line-set-1 .k-inte input").on("focusout", function(){GA_mod(this, 0, "spacing")});
	$("#line-set-1 .k-shif input").on("focusout", function(){GA_mod(this, 0, "shift")});
	$("#line-set-2 .k-ang  input").on("focusout", function(){GA_mod(this, 1, "angle")});
	$("#line-set-2 .k-inte input").on("focusout", function(){GA_mod(this, 1, "spacing")});
	$("#line-set-2 .k-shif input").on("focusout", function(){GA_mod(this, 1, "shift")});


	// add logic to the action links
	widgets.actionLink_init("#line-set-1 .px-pc-qty.act-mutex",[
	    function(){GAu_mod(0,'px');},
	    function(){GAu_mod(0,'pc');},
	    function(){GAu_mod(0,'qty');},
	]
			       );

	//performs a 'move' within the DOM
	$("#svg-angle-1").appendTo("#line-set-1 .k-pix");
	$("#svg-angle-2").appendTo("#line-set-2 .k-pix");


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

			//k-ang=angle, k-inte=spacing
			var Gx = DM.GridsArray[i].line_sets;
			$("#line-set-1 .k-ang input").val(Gx[0]["angle"]);
			$("#line-set-1 .k-inte input").val(Gx[0]["spacing"]);
			$("#line-set-1 .k-shif input").val(Gx[0]["shift"]);
			$("#line-set-2 .k-ang input").val(Gx[1]["angle"]);
			$("#line-set-2 .k-inte input").val(Gx[1]["spacing"]);
			$("#line-set-2 .k-shif input").val(Gx[1]["shift"]);

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
