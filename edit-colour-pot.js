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

	$(".preview-container#main-cp-edit").append(
	    global.$div_array(152, "preview-cell small")
	);

	//doesn't work
	$("#cp-edit-slider").slider();

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

	
	var TR_edit_click_listener = function(d,i){
	    $("#c-pot-edit-table tr.selected").removeClass("selected");
	    $(this).addClass("selected");
	    /* test if this represents a selection change...
	    if(view_cp.selected_cp_index != d.index){
		view_cp.selected_cp_index = d.index;
		view_cp.fill_preview();
	    }*/
	};


	POT.contents.forEach(function(element, i){
	    edit_cp.table_row(element, i, TR_edit_click_listener);
	});

	// this is going to need work so that it updates when necessary
	view_cp.fill_preview(".preview-container#main-cp-edit");

    },

    table_row: function(pot_elem, i, fn_click){
    	$("#c-pot-edit-table tbody").append(
	    $('<tr/>').append(
		$('<td/>').text(i+1),
		$('<td/>').addClass("prob-col").append(
		    $('<input/>')
			.val(pot_elem.prob+"%")
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
		    this.gen_row_preview_contents(pot_elem)
		)
	    ).click(fn_click)
	);
    },

    gen_row_preview_contents: function(pot_elem){
	var $contents = [];
	if(pot_elem.type=="range"){//HTML for 'range'

	    // object contains two levels of lookup key:
	    // [C1, C2, C_av, Cdiff].[H, S, L]
	    var bits = logic.colour_pair_to_hsl(pot_elem.value[0], pot_elem.value[1]);
	    var av_colour = hslToHex(bits.C_av.H, bits.C_av.S, bits.C_av.L);

	    $contents = [
		$("<div\>").addClass("threeCells").append(
		    gradient_cell.make(25, pot_elem.value[0], pot_elem.value[1], {H:0, S:"y", L:"x"}),
		    gradient_cell.make(25, pot_elem.value[0], pot_elem.value[1], {H:"x", S:0, L:"y"}),
		    gradient_cell.make(25, pot_elem.value[0], pot_elem.value[1], {H:"x", S:"y", L:0})
		),
		$("<div\>").addClass("threeCells low").append(
		    gradient_cell.make(25, pot_elem.value[0], pot_elem.value[1], {H:1, S:"y", L:"x"}),
		    gradient_cell.make(25, pot_elem.value[0], pot_elem.value[1], {H:"x", S:1, L:"y"}),
		    gradient_cell.make(25, pot_elem.value[0], pot_elem.value[1], {H:"x", S:"y", L:1})
		),
		$("<div\>").addClass("oblong")//append order to make sure it's on top...
		    .css("background", av_colour),
		$("<div\>").addClass("blank").append(
		    $("<div\>").addClass("chequer"),
		    $("<div\>").addClass("alpha A-c1")
			.css("background", av_colour),
		    $("<div\>").addClass("alpha A-c2")
			.css("background", av_colour)
		)
	    ];

	}else{//HTML for 'solid'
	    $contents = [
		$("<div\>").addClass("oblong")
		    .css("background",pot_elem.value),
		$("<div\>").addClass("blank").append(
		    $("<div\>").addClass("chequer"),
		    $("<div\>").addClass("alpha A-c3")
			.css("background", pot_elem.value)
		)
	    ];
	}

	return $("<div\>").append(
	    $("<div\>").addClass("mini-title").text(pot_elem.type),
	    $("<div\>").addClass("cp-item-container").addClass(pot_elem.type).append($contents)
	);

    },

    hide: function(){
	//Response to closing Edit
	$("#c-pot-edit-table tbody").html("");//wipe table contents...
	$("#cpanel-main").removeClass("cpanel-main-size2").addClass("cpanel-main-size1");
	$("#colour-pots-view").show();
	$("#colour-pots-edit").hide();
	$("#cpanel-main-tabs").tabs("option", "disabled", false);
    }

};

