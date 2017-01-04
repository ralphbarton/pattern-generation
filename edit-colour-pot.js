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

		//this redraws preview with update pot...
		view_cp.fill_preview(".preview-container#main-cp-view");
	    }

	});

	// inital setting of the preview-zone
	$(".preview-container#main-cp-edit").append(
	    global.$div_array(152, "preview-cell small")
	);

	// add logic to the action links
	widgets.actionLink_init("#solid-v-range.act-mutex",[
	    function(){
		// change the selected row from type 'range' to type 'solid'
		var POT = DM.editing_ColourPot;
		var pot_elem = POT.contents[edit_cp.selected_row_i];

		// get average colour from range
		var bits = logic.colour_pair_to_hsl(pot_elem.range[0], pot_elem.range[1]);
		var av_colour = hslToHex(bits.C_av.H, bits.C_av.S, bits.C_av.L);

		// mutate data
		pot_elem.type = "solid";
		pot_elem.solid = av_colour;

		//refresh view
		edit_cp.visual_update(POT, edit_cp.selected_row_i);
	    },
	    function(){
		// change the selected row from type 'solid' to type 'range'
		var POT = DM.editing_ColourPot;
		var pot_elem = POT.contents[edit_cp.selected_row_i];

		// mutate data
		pot_elem.type = "range";

		// is range data null? Make up something...
		if(pot_elem.range == undefined){
		    console.log(pot_elem.solid);
		    var bits = logic.colour_pair_to_hsl(pot_elem.solid, pot_elem.solid);
		    var Hm = bits.C1.H;
		    var Sm = bits.C1.S;
		    var Lm = bits.C1.L;
		    var cp = function (x){return Math.max(Math.min(x,1),0);}
		    var colour_1 = hslToHex(cp(Hm+0.04), cp(Sm+0.3), cp(Lm+0.10));
		    var colour_2 = hslToHex(cp(Hm-0.04), cp(Sm-0.3), cp(Lm-0.10));
		    
		    pot_elem.range = [colour_1, colour_2];
		}
		

		//refresh view
		edit_cp.visual_update(POT, edit_cp.selected_row_i);
	    }
	]);
	//both null initally
	widgets.actionLink_set("#solid-v-range.act-mutex", null);

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

	// add logic to the table buttons
	$("#cp-edit-actions #all-eq").click(function(){
	    //underlying data change
	    DM.allEqualProbs_editing_ColourPot();

	    //just click the other button, and have it do all the work, including view update.
	    $("#cp-edit-actions #sum100").click();
	});

	//add more logic within.....
	// add logic to the action links
	widgets.actionLink_init("#space-1d-4d.act-mutex",[
	    function(){
		console.log("link X");
	    },
	    function(){
		console.log("link Y");
	    }
	]);


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

	//then fill the table etc.
	this.visual_update(POT);
    },

    visual_update: function(POT, i_select){

	//wipe the entire table of rows...
	$("#c-pot-edit-table tbody").html("");

	//reset selection
	this.selected_row_i = undefined;

	POT.contents.forEach(function(element, i){
	    edit_cp.table_row(element, i);
	});

	// update the preview
	view_cp.fill_preview(".preview-container#main-cp-edit", POT);

	// use click handler to achieve re-selection
	if(i_select != undefined){
	    var tr_selected = $("#c-pot-edit-table tbody tr")[i_select];
	    tr_selected.click();
	}
	
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
		// in this same context, we also have "pot_elem", "i"

		//
		//
		// THIS IS THE ALL IMPORTANT UPON SELECT ROW FUNCTION
		if(edit_cp.selected_row_i != i){

		    // 1. update global (view) state.
		    edit_cp.selected_row_i = i;

		    // 2. Class update to show row in blue
		    $("#c-pot-edit-table tr.selected").removeClass("selected");
		    $(this).addClass("selected");

		    // 3. Change which side panel is shown...
		    if(pot_elem.type == "solid"){
			$("#cp-edit-tabs").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-solid").fadeIn({duration:400, easing: "linear"});
			widgets.actionLink_set("#solid-v-range.act-mutex", 1);// make "Range" active (as change option)
		    }else{
			$("#cp-edit-solid").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-tabs").fadeIn({duration:400, easing: "linear"});
			widgets.actionLink_set("#solid-v-range.act-mutex", 0);// make "solid" active (as change option)
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
	$("#cp-edit-solid").hide();
	$("#cp-edit-tabs").hide();

	$("#colour-pots-view").show();
	$("#colour-pots-edit").hide();
	$("#cpanel-main-tabs").tabs("option", "disabled", false);
    }

};

