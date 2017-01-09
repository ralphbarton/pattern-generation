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
		edit_cp.visual_update();
	    },
	    function(){
		// change the selected row from type 'solid' to type 'range'
		var POT = DM.editing_ColourPot;
		var pot_elem = POT.contents[edit_cp.selected_row_i];

		// mutate data
		pot_elem.type = "range";

		// is range data null? Make up something...
		// yes. scrap any old range data hidden.
		pot_elem.range = undefined;
		if(pot_elem.range == undefined){
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
		edit_cp.visual_update();
	    }
	]);
	//both null initally
	widgets.actionLink_set("#solid-v-range.act-mutex", null);

	// 3. Add logic to the table buttons
	$("#cp-edit-actions #sum100").click(function(){
	    // may fail if all probabilities are zero...
	    DM.sum100_editing_ColourPot();

	    // view update required now...
	    edit_cp.check_valid_probs();//this has the side effect of recolouring 'done' button.
	    //unconditional - and probably duplicate - preview redraw...
	    view_cp.fill_preview(".preview-container#main-cp-edit", DM.editing_ColourPot);

	    // update the view to match the underlying data
    	    $("#edit-cp-table tbody tr").each(function(i){
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

	// 4. Callbacks for table action-links

	// 4.1 - New
	$("#cp-edit-table-buttons #new").click(function(){
	    var rows = DM.newRow_editing_ColourPot();
	    edit_cp.selected_row_i = rows-1;//select final row...
	    edit_cp.visual_update(); //refresh view
	    // Disable "done" button if necessary
	    edit_cp.check_valid_probs();
	});
	
	// 4.3 - Delete
	$("#cp-edit-table-buttons #delete").click(function(){
	    if(edit_cp.selected_row_i != undefined){
		DM.deleteRow_editing_ColourPot(edit_cp.selected_row_i);
		edit_cp.selected_row_i = undefined;
		edit_cp.visual_update(); //refresh view
		// Disable "done" button if necessary
		edit_cp.check_valid_probs();
	    }
	});


	//Add Code for the CP-edit solid tab
	

	// add event listeners...
	$("#bgrins-colour-picker").on('move.spectrum', function(e, tinycolor) {
	    //note that converting colour to hex strips away the Alpha, which is what I want here.
	    var hexC = tinycolor.toHexString();
	    var withAlpha = tinycolor.toRgbString();
	    $("#colour-sun").css("background", hexC);
	    $("#k2 #strip").css("background", withAlpha);
	});

	$("#bgrins-buttons #cancel").click(function() {
	    $("#bgrins-container").hide({duration: 400});

	    //also, resore original colour (please don't copy paste code from above!)
	    var old_col = $("#bgrins-colour-picker").spectrum("option","color");
	    $("#colour-sun").css("background", old_col);
	    $("#k2 #strip").css("background", old_col);
	});

	var just_opened = false;
	$("#bgrins-buttons #choose").click(function() {
	    if(!just_opened){
		var col_chosen = $("#bgrins-colour-picker").spectrum("get").toHexString();
		//mutate the data
		var pot_row = DM.editing_ColourPot.contents[edit_cp.selected_row_i].solid = col_chosen;

		$("#bgrins-container").hide({duration: 400});

		//refresh view
		//note that this function triggers a click event (recursion?)
		// this shows the ugliness of using dummy click events as a means of UI visual update
		edit_cp.visual_update();
	    }
	});
	
	$("#colour-sun").click(function (){
	    var current_colour = $("#colour-sun").css("background-color");
	    $("#bgrins-container").show({duration: 400});

	    //Initiate the element here
	    $("#bgrins-colour-picker").spectrum("destroy");
	    $("#bgrins-colour-picker").spectrum({
		flat: true, // always show full-size, inline block...
		color: current_colour, //default colour
		showInput: true, // allow text entry to specify colour
		showAlpha: true, // allow transparency selection
		//palette based options...
		localStorageKey: "spectrum.ralph-patterns-program", // Any Spectrum with the same string will share selection
		showPalette: true, // "palette" is a fixed provision of colours for the picker to offer
		palette: [ ],
		showSelectionPalette: true, // "selectionPalette" retains some history of user's colour choices.
		selectionPalette: [ ],
		maxSelectionSize: 22,
		showInitial: true, // show the original (starting) colour alongside the new one
		showButtons: false, //do not require OK and Cancel buttons
		preferredFormat: "hex", // for the input box...
		clickoutFiresChange: true, // cause a change event upon clickout
	    });


	    //to prevent the change event triggered from immediately re-closing
	    just_opened = true;
	    setTimeout(function(){just_opened = false;}, 200);
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
	$(".cpanel#main").removeClass("cpanel-main-size1").addClass("cpanel-main-size2");
	$("#colour-pots-view").hide();
	$("#colour-pots-edit").show();
	$("#cpanel-main-tabs").tabs("option", "disabled", true);

	//create backup in data model - to be done before accessing the copy created...
	DM.edit_ColourPot(index);
	var POT = DM.editing_ColourPot;

	//set up the window visuals...
	$("#colour-pots-edit .TL-2").text(POT.index+1+". ");
	$("#colour-pots-edit .plain-cell").val(POT.description).on( "focusout", function(){
	    POT.description = $(this).val();
	});

	//then fill the table etc.
	this.visual_update();
    },

    visual_update: function(){

	var POT = DM.editing_ColourPot;

	//wipe the entire table of rows...
	$("#edit-cp-table tbody").html("");

	POT.contents.forEach(function(element, i){
	    edit_cp.table_row(element, i);
	});

	// update the preview - conditional on its current state being valid...
	if(DM.validProbs_editing_ColourPot()){
	    view_cp.fill_preview(".preview-container#main-cp-edit", POT);
	}

	// use click handler to achieve re-selection
	if(this.selected_row_i != undefined){
	    var tr_selected = $("#edit-cp-table tbody tr")[this.selected_row_i];
	    this.selected_row_i = undefined;//reset selection - necessary for effect of next line
	    tr_selected.click();
	}
	
    },

    check_valid_probs: function(){
	var $done_Btn = $("#cp-edit-buttons #done");
	if(DM.validProbs_editing_ColourPot()){
	    // if it has become re-enabled after disable, refresh the pot-preview
	    if($done_Btn.hasClass("ui-disabled")){
		view_cp.fill_preview(".preview-container#main-cp-edit", DM.editing_ColourPot);
		$done_Btn.removeClass("ui-disabled")
	    }
	}else{
	    $done_Btn.addClass("ui-disabled")

	}
    },

    selected_row_i: undefined,
    table_row: function(pot_elem, i){
    	$("#edit-cp-table tbody").append(
	    $('<tr/>').append(
		$('<td/>').addClass("col-1").text(i+1),
		$('<td/>').addClass("col-2").append(
		    $('<input/>')
			.val(pot_elem.prob+"%")
			.attr('type', 'text')
			.data({unit: "%"})
			.addClass("blue-cell")
			.attr('readonly', true)
			.on("focusout", function(){

			    widgets.table_cell_edit(this,false);

			    // Access and mutate the data structure
			    DM.editing_ColourPot.contents[i].prob = parseInt($(this).val());
			    
			    // probability change may have triggered change in validity of set (does it sum to 100?)
			    // Disable "done" button if necessary
			    edit_cp.check_valid_probs();
			})
			.click(function(){
			    // like on 'edit' we could require row to be slected first before clicking makes text editable
			    // but probably more annoying than useful
			    //	if(view_cp.selected_cp_index == ColourPot.index){
			    widgets.table_cell_edit(this,true);
			})
		),
		$('<td/>').addClass("col-3").append(
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
		    $("#edit-cp-table tr.selected").removeClass("selected");
		    $(this).addClass("selected");

		    // 3. Change which side panel is shown...
		    if(pot_elem.type == "solid"){
			$("#cp-edit-tabs").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-solid").fadeIn({duration:400, easing: "linear"});
			widgets.actionLink_set("#solid-v-range.act-mutex", 1);// make "Range" active (as change option)

			//hide the colour-picker if it is present
			$("#bgrins-container").hide({duration: 400});

			//set the colour of the "solid" sidepanel
			$("#colour-sun").css("background-color", pot_elem.solid);
			//todo - handle transparency
			// in fact, use tiny-colour objects in this project.
			// refer to...
			// https://github.com/bgrins/TinyColor
			$("#k2 #strip").css("background-color", pot_elem.solid);

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
	$("#edit-cp-table tbody").html("");//wipe table contents...
	$(".cpanel#main").removeClass("cpanel-main-size2").addClass("cpanel-main-size1");
	$("#cp-edit-solid").hide();
	$("#cp-edit-tabs").hide();

	$("#colour-pots-view").show();
	$("#colour-pots-edit").hide();
	$("#cpanel-main-tabs").tabs("option", "disabled", false);
    }

};

