var edit_cp = {

    not_yet_initialised: true,

    init: function(){

	//initiate tabs...
	$("#cp-edit-tabs").tabs();

	//add action for cancel button
	$("#cp-edit-buttons #cancel").click(function(){edit_cp.hide();});
	$("#cp-edit-buttons #done").click(function(){
	    //first save data...
	    var save_i = DM.save_editing_ColourPot();//return value is the index of the colour-pot just saved
	    edit_cp.hide();

	    //this redraws the list with the latest data...
	    view_cp.table_update_d3(save_i);

	});

	//$("#cp-edit-slider").slider();

	this.not_yet_initialised = false;
    },

    show: function(index){

	if(this.not_yet_initialised){
	    this.init();
	}

	//Response to clicking Edit
	$("#cpanel-main").removeClass("cpanel-main-size1").addClass("cpanel-main-size2");
	$("#colour-pots-view").hide();
	$("#colour-pots-edit").show();
	$("#cpanel-main-tabs").tabs("option", "disabled", true);

	//create backup in data model - to be done before accessing the copy created...
	DM.edit_ColourPot(index);
	var POT = DM.editing_ColourPot;

	//set up the window visuals...
	$("#colour-pots-edit .TL-2").text(POT.index+1+". ");
	$("#colour-pots-edit .TL-3").val(POT.description).on( "focusout", function(){
	    POT.description = $(this).val();
	});

	POT.contents.forEach(function(element,i){
	    edit_cp.table_row(element,i);
	})

    },

    table_row: function(row_data, i){
    	$("#c-pot-edit-table tbody").append(
	    $('<tr/>').data({index: i})
		.append(
		    $('<td/>').text(i+1),
		    $('<td/>').addClass("prob-col").append(
			$('<input/>')
			    .val("5%")
			    .attr('type', 'text')
			    .addClass("table-input-cell")
			    .attr('readonly', true)
			    .on("focusout", function(){
				// add logic to write underlying data
				//				var d3_index = $(this).parent().parent()[0].__data__.index;
				//				DM.ColourPotArray[d3_index].description = $(this).val();
				table_cell_edit(this,false);
			    })
			    .click(function(){
				//				if(view_cp.selected_cp_index == ColourPot.index){ // add logic to calculate row selection
				table_cell_edit(this,true);
				//				}
			    })
		    ),
		    $('<td/>').append(
			this.gen_row_preview_contents()
		    )
		)
	);
    },

    gen_row_preview_contents: function(){
	return $("<div\>").append(
	    $("<div\>").addClass("sj").append(
		$("<div\>").addClass("sk").append(
		    gradient_cell.make(25, "#A9A8B8", "#8B149A", {H:0, S:"y", L:"x"}),
		    gradient_cell.make(25, "#A9A8B8", "#8B149A", {H:0, S:"y", L:"x"}),
		    gradient_cell.make(25, "#A9A8B8", "#8B149A", {H:0, S:"y", L:"x"})
		),
		$("<div\>").addClass("sk sk2").append(
		    gradient_cell.make(25, "#A9A8B8", "#8B149A", {H:0, S:"y", L:"x"}),
		    gradient_cell.make(25, "#A9A8B8", "#8B149A", {H:0, S:"y", L:"x"}),
		    gradient_cell.make(25, "#A9A8B8", "#8B149A", {H:0, S:"y", L:"x"})
		),
		$("<div\>").text("a").addClass("ss")//final so it is on top...
	    )
	);
    },

    hide: function(){
	//Response to closing Edit
	$("#cpanel-main").removeClass("cpanel-main-size2").addClass("cpanel-main-size1");
	$("#colour-pots-view").show();
	$("#colour-pots-edit").hide();
	$("#cpanel-main-tabs").tabs("option", "disabled", false);
    }

};
