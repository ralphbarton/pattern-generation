var edit_cp = {

    not_yet_initialised: true,

    init: function(){

	//initiate tabs...
	$("#cp-edit-tabs").tabs();

 	//add action for main TAB buttons
	$("#cp-edit-buttons #cancel").click(function(){edit_cp.hide();});
	$("#cp-edit-buttons #done").click(function(){

	    if(!$(this).hasClass("ui-disabled")){
		//first save data...
		var save_i = DM.save_editing_ColourPot();//return value is the index of the colour-pot just saved
		edit_cp.hide();

		//this redraws the list with the latest data...
		view_cp.table_update_d3(save_i);
	    }

	});

	// inital setting of the preview-zone
	$(".preview-container#main-cp-edit").append(
	    global.$div_array(152, "preview-cell small")
	);

	// add logic to the action links
	widgets.actionLink_init("#solid-v-range .act-mutex",[
	    function(){
		console.log("link 1");
	    },
	    function(){
		console.log("link 2");
	    }
	]);

	// add logic to the table buttons
	$("#cp-edit-actions #sum100").click(function(){
	    // may fail if all probabilities are zero...
	    DM.sum100_editing_ColourPot();

	    // view update required now...
	    $("#cp-edit-buttons #done").removeClass("ui-disabled")

	    // update the view to match the underlying data
    	    $("#c-pot-edit-table tbody tr").each(function(i){
		var $input_elem = $(this).find("input");
		$input_elem.val(DM.editing_ColourPot.contents[i].prob);
		widgets.table_cell_edit($input_elem[0], false);//pass native element accessed via [0]
	    });


	});


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

	POT.contents.forEach(function(element, i){
	    edit_cp.table_row(element, i);
	});

	// this is going to need work so that it updates when necessary
	view_cp.fill_preview(".preview-container#main-cp-edit");

    },

    selected_row_i: undefined,

    table_row: function(pot_elem, i){
    	$("#c-pot-edit-table tbody").append(
	    $('<tr/>').append(
		$('<td/>').text(i+1),
		$('<td/>').addClass("prob-col").append(
		    $('<input/>')
			.val(pot_elem.prob+"%")
			.attr('type', 'text')
			.data({unit: "%"})
			.addClass("table-input-cell")
			.attr('readonly', true)
			.on("focusout", function(){
			    // add logic to write underlying data
			    //				var d3_index = $(this).parent().parent()[0].__data__.index;
			    //				DM.ColourPotArray[d3_index].description = $(this).val();
			    widgets.table_cell_edit(this,false);

			    // probability change may have triggered change to validity of set (does it sum to 100?)

			    // Access and mutate the data structure
			    DM.editing_ColourPot.contents[i].prob = parseInt($(this).val());

			    // valid sum of probabilities?
			    if(DM.validProbs_editing_ColourPot()){
				$("#cp-edit-buttons #done").removeClass("ui-disabled")
				// update preview now????
				// TODO.

			    }else{
				$("#cp-edit-buttons #done").addClass("ui-disabled")
			    }

			})
			.click(function(){
			    // like on 'edit' we could require row to be slected first before clicking makes text editable
			    // but probably more annoying than useful
			    //	if(view_cp.selected_cp_index == ColourPot.index){
			    widgets.table_cell_edit(this,true);
			})
		),
		$('<td/>').append(
		    this.gen_row_preview_contents(pot_elem)
		)
	    ).click(function(d,ii){//"d" is the entire event object and "ii" is undefined.

		// these values are useful.
		//console.log(pot_elem, i);

		// UPON selection of a row....
		// an awful lot needs to happen upon selection of a row.

		//row selected has changed?
		if(edit_cp.selected_row_i != i){

		    // update global state.
		    edit_cp.selected_row_i = i;

		    // update view
		    $("#c-pot-edit-table tr.selected").removeClass("selected");
		    $(this).addClass("selected");

		    if(pot_elem.type == "solid"){
			$("#cp-edit-tabs").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-solid").fadeIn({duration:400, easing: "linear"});
		    }else{
			$("#cp-edit-solid").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-tabs").fadeIn({duration:400, easing: "linear"});
		    }

		}

	    })
	);
    },

    gen_row_preview_contents: function(pot_elem){
	var $contents = [];
	if(pot_elem.type=="range"){//HTML for 'range'

	    // object contains two levels of lookup key:
	    // [C1, C2, C_av, Cdiff].[H, S, L]
	    var bits = logic.colour_pair_to_hsl(pot_elem.range[0], pot_elem.range[1]);
	    var av_colour = hslToHex(bits.C_av.H, bits.C_av.S, bits.C_av.L);

	    $contents = [
		$("<div\>").addClass("threeCells").append(
		    gradient_cell.make(25, pot_elem.range[0], pot_elem.range[1], {H:0, S:"y", L:"x"}),
		    gradient_cell.make(25, pot_elem.range[0], pot_elem.range[1], {H:"x", S:0, L:"y"}),
		    gradient_cell.make(25, pot_elem.range[0], pot_elem.range[1], {H:"x", S:"y", L:0})
		),
		$("<div\>").addClass("threeCells low").append(
		    gradient_cell.make(25, pot_elem.range[0], pot_elem.range[1], {H:1, S:"y", L:"x"}),
		    gradient_cell.make(25, pot_elem.range[0], pot_elem.range[1], {H:"x", S:1, L:"y"}),
		    gradient_cell.make(25, pot_elem.range[0], pot_elem.range[1], {H:"x", S:"y", L:1})
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
		    .css("background",pot_elem.solid),
		$("<div\>").addClass("blank").append(
		    $("<div\>").addClass("chequer"),
		    $("<div\>").addClass("alpha A-c3")
			.css("background", pot_elem.solid)
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

