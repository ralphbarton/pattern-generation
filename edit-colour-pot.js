var edit_cp = {

    not_yet_initialised: true,
    selected_row_i: undefined,
    init: function(){


	// 1. Main controls of the C-Pot edit window (these are permanently shown)
	
	// 1.1 - functionality of the "Cancel" and "Done" buttons
	// (note that "Done" may get blocked if probs don't sum to 100% etc...
	$("#cp-edit-buttons #cancel").click(function(){edit_cp.hide();});
	$("#cp-edit-buttons #done").click(function(){

	    if(!$(this).hasClass("ui-disabled")){
		//first save data...
		DM.save_editing_ColourPot(view_cp.selected_cp_index);//return value is the index of the colour-pot just saved
		edit_cp.hide();

		//redraws the table and the preview on the View tab, with the latest data...
		view_cp.regenerate_table(view_cp.selected_cp_index);
		view_cp.fill_preview(".preview-container#main-cp-view");
	    }
	});

	
	// 1.2 - jQueryUI initialisation command for the "range" tabs (i.e. Central / Edges / Subspace)
	$("#cp-edit-tabs").tabs();

	
	// 1.3 - Functions underneath list of C-Pot elements

	// 1.3.1 - switching a C-Pot element Solid v. Range (action link)
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

		pot_elem.type = "range";
		var J = tinycolor(pot_elem.solid).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
		var R = function (x){return Math.max(Math.min(x,1),0);}
		var Q = function (x){return x>0 ? (x%360) : ((x+360)%360);}
		var Dh = 15;
		var Ds = 0.30;
		var Dl = 0.10;
		var Da = 0.20;
		var J1 = tinycolor({ h: Q(J.h-Dh), s: R(J.s-Ds), l: R(J.l-Dl), a: R(J.a-Da) }).toRgbString();
		var J2 = tinycolor({ h: Q(J.h+Dh), s: R(J.s+Ds), l: R(J.l+Dl), a: R(J.a+Da) }).toRgbString();
		
		pot_elem.range = [J1, J2];

		//refresh view
		edit_cp.visual_update();
	    }
	]);
	widgets.actionLink_unset("#solid-v-range.act-mutex", "all");//have both null initally


	// 1.3.2 - rescale probs to SUM to 100 (action link)
	$("#cp-edit-actions #sum100").click(function(){

	    // may fail if all probabilities are zero...
	    DM.sum100_editing_ColourPot();

	    // view update required now...
	    edit_cp.check_valid_probs();//this has the side effect of recolouring 'done' button.
	    //unconditional - and probably duplicate - preview redraw...
	    view_cp.fill_preview("#colour-pots-edit .preview-container", DM.editing_ColourPot);

	    // update the view to match the underlying data
	    // note how ref is already known by SmartInput("update", {...})
    	    $("#edit-cp-table tbody tr").each(function(i){
		$(this).find("input").SmartInput("update", {UI_enable: false, data_change: true});
	    });
	});


	// 1.3.3 - set all probabilities equal (action link)
	$("#cp-edit-actions #all-eq").click(function(){
	    //underlying data change
	    DM.allEqualProbs_editing_ColourPot();

	    //just click the other button, and have it do all the work, including view update.
	    $("#cp-edit-actions #sum100").click();
	});


	// 1.3.4 - Add delta-from-100% to seection - another way to achieve sum=100 (action link)
	// (must also respect probs all > 0%)
	$("#cp-edit-actions #delta-to-selection").click(function(){

	    //underlying data change
	    var delta = DM.sumProbs_editing_ColourPot() - 100;
	    var ED_pot_row_i = DM.editing_ColourPot.contents[edit_cp.selected_row_i];
	    ED_pot_row_i.prob = Math.max(ED_pot_row_i.prob-delta, 0);

	    edit_cp.check_valid_probs();//this has the side effect of recolouring 'done' button.
	    edit_cp.visual_update(); //refresh view
	});



	// 1.4 - Buttons underneath list of C-Pot elements

	// 1.4.1 - Add new C-Pot element
	var ADD_subOp = null;
	$("#cp-edit-table-buttons #add").click(function(){

	    if(ADD_subOp != "B"){

		var R_col = $("#cp-edit-table-buttons #add #A").css("background-color");

		var rows = DM.newRow_editing_ColourPot(ADD_subOp == "A" ? R_col : undefined );
		edit_cp.selected_row_i = rows-1;//select final row...
		edit_cp.visual_update(); //refresh view
		// Disable "done" button if necessary
		edit_cp.check_valid_probs();
	    }
	});

	
	// 1.4.2 - fancy suboption of ADD - [A] adds row, using a random colour previewed
	$("#cp-edit-table-buttons #add #A").click(function(){
	    ADD_subOp = "A";//detect the specific suboption clicked (for purpose of other callbacks triggered)
	    setTimeout(function(){ADD_subOp = null;}, 50);
	});

	// 1.4.3 - fancy suboption of ADD - [B] cycles the random colour used for tiny-bg
	$("#cp-edit-table-buttons #add #B").click(function(){
	    var rand_color = tinycolor.fromRatio({ h: Math.random(), s: 1, l: 0.25+Math.random()*0.5 });
	    $("#cp-edit-table-buttons #add #A").show()
		.css("background-color", "#"+rand_color.toHex());

	    ADD_subOp = "B";//detect the specific suboption clicked (for purpose of other callbacks triggered)
	    setTimeout(function(){ADD_subOp = null;}, 50);
	});


	// 1.4.4 - Delete the selected C-pot element
	$("#cp-edit-table-buttons #delete").click(function(){
	    if(edit_cp.selected_row_i != undefined){
		DM.deleteRow_editing_ColourPot(edit_cp.selected_row_i);

		//now, leave selected either replacing row in same position, or final row
		edit_cp.selected_row_i = Math.min(edit_cp.selected_row_i, DM.editing_ColourPot.contents.length-1);

		edit_cp.visual_update(); //refresh view
		// Disable "done" button if necessary
		edit_cp.check_valid_probs();
	    }
	});



	// 1.5 - The C-Pot preview area for this "Window"

	// 1.5.1 - initalise the preview (to an expanded state)
	$("#colour-pots-edit .preview-container").append(
	    global.$div_array(152, "preview-cell small")
	);

	// 1.5.2 - re-randomise the preview area
	$("#colour-pots-edit #preview-area #re-randomise").click(function(){
	    view_cp.fill_preview("#colour-pots-edit .preview-container", DM.editing_ColourPot);
	});

	// 1.5.3 - Expand the preview area
	$("#colour-pots-edit #preview-area #expand").click(function(){

	    var $p_container = $("#colour-pots-edit .preview-container");

	    if(!$p_container.hasClass("expanded")){
		$p_container.addClass("expanded");

		//add another 30 elements
		$p_container.append(
		    global.$div_array(19, "preview-cell")
		);

		//hide the old pane now that now row is selected
		if(edit_cp.selected_row_i != undefined){
		    edit_cp.selected_row_i = undefined;
		    //no fading out here, because the preview area expands instantly...
		    $("#cp-edit-tabs").hide();
		    $("#cp-edit-solid").hide();
		}

		edit_cp.visual_update(); //refresh view
	    }
	});

	// 1.6 - jQueryUI initialisation command for Multi-purpose slider at bottom of window
	$("#cp-edit-slider").slider();





	// 2. functions to control the BGRINS colour-picker, common to both editing a SOLID and a RANGE

	// 2.1 - Function to destroy and re-create the picker
	// Regeneration like this ensures the "starting" colour to the colour provided will be used as "original" colour
	var BGrinsShow = function(starting_colour, onColourMove) {

	    $("#bgrins-container").show({duration: 400});

	    //Initiate the element here
	    var was_large = $("#bgrins-container").hasClass("large");
	    var original_colour = $("#bgrins-colour-picker").spectrum("option", "color"); 
	    var original_format = $("#bgrins-colour-picker").spectrum("option", "preferredFormat");
	    $("#bgrins-colour-picker").spectrum("destroy");
	    $("#bgrins-colour-picker").spectrum({
		flat: true, // always show full-size, inline block...
		color: starting_colour || original_colour, // default colour for the picker...
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
		preferredFormat: original_format, // for the input box...
		clickoutFiresChange: true, // cause a change event upon clickout
		move: onColourMove
	    });
	    if(was_large){
		$("#bgrins-container").addClass("large");
	    }

	    //to prevent the change event triggered from immediately re-closing
	    just_opened = true;
	    setTimeout(function(){just_opened = false;}, 200);
	};
	
	
	// 2.2 - "Cancel" Button of the colour picker
	$("#bgrins-buttons #cancel").click(function() {
	    $("#bgrins-container").hide({duration: 400});

	    //also, resore original colour (please don't copy paste code from above!)
	    var old_col = $("#bgrins-colour-picker").spectrum("option","color");
	    var non_transparent = tinycolor(old_col).toHexString();

	    var cp_type = DM.editing_ColourPot.contents[edit_cp.selected_row_i].type;// either 'solid' or 'range'
	    
	    if(cp_type == "solid"){
		$("#cp-edit-solid .colour-sun.l").css("background", non_transparent);
		$("#k2 #strip").css("background", old_col);
	    }else if(cp_type == "range"){

		//restore to original (saved) values
		var old_pair = DM.editing_ColourPot.contents[edit_cp.selected_row_i].range;
		edit_cp.cp_range_set_colour_blocks( {colour_pair: old_pair} );
	    }
	});


	// 2.3 - "Choose Colour" Button of the colour picker
	var just_opened = false;
	$("#bgrins-buttons #choose").click(function() {
	    if(!just_opened){
		$("#bgrins-container").hide({duration: 400});
		var col_chosen = $("#bgrins-colour-picker").spectrum("get").toRgbString();

		//mutate the data
		var cp_type = DM.editing_ColourPot.contents[edit_cp.selected_row_i].type;// either 'solid' or 'range'
		if(cp_type == "solid"){
		    DM.editing_ColourPot.contents[edit_cp.selected_row_i].solid = col_chosen;

		}else if(cp_type == "range"){

		    var X = edit_cp.get_Rdata_components();

		    DM.editing_ColourPot.contents[edit_cp.selected_row_i].range = [X.colour1, X.colour2];

		}

		//refresh view
		//note that this function triggers a click event (recursion?)
		// this shows the ugliness of using dummy click events as a means of UI visual update
		edit_cp.visual_update();
	    }
	});


	
	// 2.4 - Change SIZE of the colour picker
	widgets.actionLink_init("#bgrins-actions #normal-large.act-mutex",[
	    function(){
		$("#bgrins-container").removeClass("large");
		//to allow the expansion animation to finish...
		setTimeout(function(){$("#bgrins-colour-picker").spectrum("reflow");},410);
	    },
	    function(){
		$("#bgrins-container").addClass("large");
		setTimeout(function(){$("#bgrins-colour-picker").spectrum("reflow");},410);
	    }
	]);
	widgets.actionLink_unset("#normal-large.act-mutex", 0);//show normal


	
	// 2.5 - Change format (HEX v. RGB v. HSL) of the colour string provided in the colour picker
	var poke = function(){
	    var w = $("#bgrins-colour-picker").spectrum("get");
	    $("#bgrins-colour-picker").spectrum("set", w);
	};

	widgets.actionLink_init("#bgrins-actions #hex-rgb-hsl.act-mutex",[
	    function(){$("#bgrins-colour-picker").spectrum("option", "preferredFormat", "hex3"); poke();},
	    function(){$("#bgrins-colour-picker").spectrum("option", "preferredFormat", "rgb"); poke();},
	    function(){$("#bgrins-colour-picker").spectrum("option", "preferredFormat", "hsl"); poke();},
	]);
	widgets.actionLink_unset("#bgrins-actions #hex-rgb-hsl.act-mutex", null);//show all as available







	

	// 3. Editing a C-Pot element in SOLID mode
	

	// 3.1 - DEFN for live-update of two DOM elements upon colour adjust
	var bgrins_on_colMove_cb_SOLID = function(tinycolor) {
	    //note that converting colour to hex strips away the Alpha, which is what I want here.
	    var hexC = tinycolor.toHexString();
	    var withAlpha = tinycolor.toRgbString();
	    $("#cp-edit-solid .colour-sun.l").css("background", hexC);
	    $("#k2 #strip").css("background", withAlpha);
	};


	// 3.2 - Click the "Colour Sun"
	$("#cp-edit-solid .colour-sun.l").click(function (){
	    // take from the 'strip' which includes Alpha channel.
	    var mySolid_colour = $("#cp-edit-solid #k2 #strip").css("background-color");
	    BGrinsShow(mySolid_colour, bgrins_on_colMove_cb_SOLID);
	    
	});








	// 4. Editing C-Pot element in RANGE->Central Mode

	// 4.1 - Clone HTML to make the colour shades preview-blocks for Hue, Sat, Lum, Alpha
	var $my_Div = $( "#colour-pots-edit #tabs-e1 div.Ln.hue" ).clone()
	    .removeClass("hue");

	// create sections for SLA from H
	$( "#colour-pots-edit #tabs-e1").append(
	    $my_Div.clone().addClass("sat"),
	    $my_Div.clone().addClass("lum"),
	    $my_Div.addClass("alp")
	);

	$( "#colour-pots-edit #tabs-e1 .hue .name").text("Hue:");
	$( "#colour-pots-edit #tabs-e1 .sat .name").text("Sat:");
	$( "#colour-pots-edit #tabs-e1 .lum .name").text("Lum:");
	$( "#colour-pots-edit #tabs-e1 .alp .name").text("Alpha:");

	// 4.2 - little strips of colour SELECTED upon click...
	$("#tabs-e1 .Ln .B").click(function(){
	    $("#tabs-e1 .Ln .B").removeClass("sel");
	    $(this).addClass("sel");
	});



	// 4.3 - initialise all the Input elements...
	$( "#colour-pots-edit #tabs-e1 input").each(function(){
	    var x2 = $(this).parent(); // var vs mid
	    var x1 = $(this).parent().parent(); // hue, sat, lum, alp

	    //hue in degrees and other properties in %
	    var dc = x1.hasClass("hue") ? "degrees" : "percent";
	    
	    $(this).SmartInput({
		data_class: dc
	    });
	    
	});

	


	// 4.x - DEFN for live-update range boundary colour pieces.
	var bgrins_on_colMove_cb_RANGE = function(tinycolor) {
	    var options = tinycolor.toHsl();

	    // (1) - Update the little blocks of colour
	    //we need to pass the current "Rdata" too, so that deltas are not lost...
	    options.Rdata = edit_cp.Rdata;
	    edit_cp.cp_range_set_colour_blocks( options );

	    // (2) - Update the values of the <input> elements

	    
	};


	// 4.x - Click the "Colour Sun"
	$("#tabs-e1 .colour-sun.s").click(function (){
	    var av_colour = edit_cp.get_Rdata_components().tiny_av.toRgbString();
	    BGrinsShow(av_colour, bgrins_on_colMove_cb_RANGE);	    
	});

	

	


	



	
	// 5. Controls for editing a C-Pot element in RANGE->Edges Mode




	
	// 6. Controls for editing a C-Pot element; RANGE->Subspace

	// 6.1 - Choose between  1D and 4D
	widgets.actionLink_init("#space-1d-4d.act-mutex",[
	    function(){
		console.log("link X");
	    },
	    function(){
		console.log("link Y");
	    }
	]);



	
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
	$("#colour-pots-edit .TL-2").text((view_cp.selected_cp_index+1) + ". ");

	//this initiates the SmartInput for the Title, only
	$("#colour-pots-edit #title-bar input").SmartInput({
	    underlying_obj: POT,
	    underlying_key: "description",
	    style_class: "plain-cell",
	    data_class: "text",
	});

	//put the preview area into its expanded state...
	$("#colour-pots-edit #preview-area #expand").click();

	//then fill the table etc.
	this.visual_update();
    },

    hide: function(){
	//Response to closing Edit
	$("#edit-cp-table tbody").html("");//wipe table contents...
	$(".cpanel#main").removeClass("cpanel-main-size2").addClass("cpanel-main-size1");
	$("#cp-edit-solid").hide();
	$("#cp-edit-tabs").hide();

	$("#cp-edit-table-buttons #add #A").hide();//the tiny random chooser...

	$("#colour-pots-view").show();
	$("#colour-pots-edit").hide();
	$("#cpanel-main-tabs").tabs("option", "disabled", false);
	
	this.selected_row_i = undefined;
    },

    visual_update: function(){

	var POT = DM.editing_ColourPot;

	//wipe the entire table of rows...
	$("#edit-cp-table tbody").html("");

	POT.contents.forEach(function(element, i){
	    edit_cp.table_row(element, i);
	});

	// update the preview - conditional on its current state being valid...
	if(DM.sumProbs_editing_ColourPot() == 100){
	    view_cp.fill_preview("#colour-pots-edit .preview-container", POT);
	}

	// use click handler to achieve re-selection
	if((DM.editing_ColourPot.contents.length > 0)&&(this.selected_row_i != undefined)){
	    var tr_selected = $("#edit-cp-table tbody tr")[this.selected_row_i];
	    this.selected_row_i = undefined;//reset selection - necessary for effect of next line
	    tr_selected.click();
	}

	//call during init to ensure correct initial display state
	this.check_valid_probs();
	
    },

    check_valid_probs: function(){
	var $done_Btn = $("#cp-edit-buttons #done");
	var $msg_text = $("#cp-edit-actions #probs-sum");
	var sum_probs = DM.sumProbs_editing_ColourPot();

	$("#cp-edit-actions #sum").text(sum_probs.toFixed(1)+"%");
	var delta = sum_probs-100;
	$("#cp-edit-actions #delta").text((delta > 0? "+" : "")+delta.toFixed(1)+"%").
	    css("color", delta > 0 ? "#DE641D" : "#7946B3");
	if(delta == 0){$("#cp-edit-actions #delta").removeAttr('style');}

	if( sum_probs == 100){
	    // if it has become re-enabled after disable, refresh the pot-preview
	    if($done_Btn.hasClass("ui-disabled")){
		view_cp.fill_preview("#colour-pots-edit .preview-container", DM.editing_ColourPot);
		$done_Btn.removeClass("ui-disabled")
	    }
	    $msg_text.addClass("B");//B means show in grey
	}else{
	    $done_Btn.addClass("ui-disabled")
	    $msg_text.removeClass("B")
	}
    },

    table_row: function(pot_elem, i){
    	$("#edit-cp-table tbody").append(
	    $('<tr/>').append(
		$('<td/>').addClass("col-1").text(i+1),
		$('<td/>').addClass("col-2").append(
		    $('<input/>').SmartInput({
			underlying_obj: pot_elem,
			underlying_key: "prob",
			style_class: "blue-cell",
			data_class: "percent",
			underlying_from_DOM_onChange: true,
			cb_change: function(){edit_cp.check_valid_probs();},//all the graphical change...
			cb_focusout: function(){edit_cp.check_valid_probs();}//may disable "done" btn
		    })
		),
		$('<td/>').addClass("col-3").append(
		    this.gen_row_preview_contents(pot_elem, i)
		)
	    ).click(function(){
		// in this context, we have "pot_elem", "i" which are accessed below...

		//
		// THIS IS THE ALL IMPORTANT UPON SELECT ROW FUNCTION
		if(edit_cp.selected_row_i != i){

		    // 1. update global (view) state.
		    edit_cp.selected_row_i = i;

		    // 2. Class update to show row in blue
		    $("#edit-cp-table tr.selected").removeClass("selected");
		    $(this).addClass("selected");


		    // 3. reduce the size of the preview container, if expanded...
		    var $p_container = $("#colour-pots-edit .preview-container");

		    if($p_container.hasClass("expanded")){
			$p_container.removeClass("expanded");

			//remove all elements then add 152 (qty small) elements
			$p_container.html("").append(
			    global.$div_array(152, "preview-cell small")
			);

			// fill all those (slighly wastefully regenerated) new elements with colour...
			view_cp.fill_preview("#colour-pots-edit .preview-container", DM.editing_ColourPot);
		    }


		    // 4. Change which side panel is shown...
		    if(pot_elem.type == "solid"){
			$("#cp-edit-tabs").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-solid").fadeIn({duration:400, easing: "linear"});
			widgets.actionLink_unset("#solid-v-range.act-mutex", 0);// make "Solid" inactive (its the current state)

			//hide the colour-picker if it is present
			$("#bgrins-container").hide({duration: 400});

			//set the colour of the "solid" sidepanel
			var non_transparent = tinycolor(pot_elem.solid).toHexString();
			$("#cp-edit-solid .colour-sun.l").css("background-color", non_transparent);
			//todo - handle transparency
			// in fact, use tiny-colour objects in this project.
			// refer to...
			// https://github.com/bgrins/TinyColor
			$("#k2 #strip").css("background-color", pot_elem.solid);

		    }else{
			$("#cp-edit-solid").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-tabs").fadeIn({duration:400, easing: "linear"});
			widgets.actionLink_unset("#solid-v-range.act-mutex", 1);// make "Range" inactive (its the current state)

			// Activity upon selection of a RANGE row...
			edit_cp.cp_range_set_colour_blocks( {colour_pair: pot_elem.range} );

		    }

		}
	    })
	);
    },

    
    gen_row_preview_contents: function(pot_elem, i){
	var $contents = [];
	if(pot_elem.type=="range"){//HTML for 'range'

	    var pot_Rdata = this.make_Rdata({colour_pair: pot_elem.range});
	    // "components" of the colour pot...

	    var Pcomps = this.get_Rdata_components(pot_Rdata);
	    
	    $contents = [
		$("<div\>").addClass("threeCells").append(
		    this.make_gradient_cell(25, Pcomps, {H:0, S:"y", L:"x"}),
		    this.make_gradient_cell(25, Pcomps, {H:"x", S:0, L:"y"}),
		    this.make_gradient_cell(25, Pcomps, {H:"x", S:"y", L:0})
		),
		$("<div\>").addClass("threeCells low").append(
		    this.make_gradient_cell(25, Pcomps, {H:1, S:"y", L:"x"}),
		    this.make_gradient_cell(25, Pcomps, {H:"x", S:1, L:"y"}),
		    this.make_gradient_cell(25, Pcomps, {H:"x", S:"y", L:1})
		),
		$("<div\>").addClass("oblong")//append order to make sure it's on top...
		    .css("background", Pcomps.tiny_av.toHexString()),
		$("<div\>").addClass("blank").append(
		    $("<div\>").addClass("chequer"),
		    $("<div\>").addClass("alpha A-c1")
			.css("background", Pcomps.tiny_av.setAlpha(Pcomps.a3).toRgbString()),
		    $("<div\>").addClass("alpha A-c2")
			.css("background", Pcomps.tiny_av.setAlpha(Pcomps.a1).toRgbString())
		)
	    ];

	}else{//HTML for 'solid'
	    var non_transparent = tinycolor(pot_elem.solid).toHexString();
	    $contents = [
		$("<div\>").addClass("oblong")
		    .css("background", non_transparent)
		    .click(function(){
			console.log("oblong-shape clicked (for solid). i=", i);
		    }),
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


    //this includes the "colour sun" - it'd be perverse not to. Then the 12 other little blocks, too.

    //note that the "options" may be a single colour (provided as {hsla} ) a pair of colours
    cp_range_set_colour_blocks: function(set_colour_options){


	this.Rdata = this.make_Rdata(set_colour_options);
	
	var X = this.get_Rdata_components();
	var av_colour = X.tiny_av.toRgbString();
	var W = "background-color";

	//no alpha
	$("#cp-edit-tabs .colour-sun.s").css(W, X.tiny_av.toHexString());
	
	//H
	$("#cp-edit-tabs .Ln.hue .B.left"  ).css(W, tinycolor({h: X.h1, s: X.s2, l: X.l2, a: X.a2}).toRgbString());
	$("#cp-edit-tabs .Ln.hue .B.center").css(W, av_colour);
	$("#cp-edit-tabs .Ln.hue .B.right" ).css(W, tinycolor({h: X.h3, s: X.s2, l: X.l2, a: X.a2}).toRgbString());

	//S
	$("#cp-edit-tabs .Ln.sat .B.left"  ).css(W, tinycolor({h: X.h2, s: X.s1, l: X.l2, a: X.a2}).toRgbString());
	$("#cp-edit-tabs .Ln.sat .B.center").css(W, av_colour);
	$("#cp-edit-tabs .Ln.sat .B.right" ).css(W, tinycolor({h: X.h2, s: X.s3, l: X.l2, a: X.a2}).toRgbString());

	//L
	$("#cp-edit-tabs .Ln.lum .B.left"  ).css(W, tinycolor({h: X.h2, s: X.s2, l: X.l1, a: X.a2}).toRgbString());
	$("#cp-edit-tabs .Ln.lum .B.center").css(W, av_colour);
	$("#cp-edit-tabs .Ln.lum .B.right" ).css(W, tinycolor({h: X.h2, s: X.s2, l: X.l3, a: X.a2}).toRgbString());

	//A
	$("#cp-edit-tabs .Ln.alp .B.left"  ).css(W, tinycolor({h: X.h2, s: X.s2, l: X.l2, a: X.a1}).toRgbString());
	$("#cp-edit-tabs .Ln.alp .B.center").css(W, av_colour);
	$("#cp-edit-tabs .Ln.alp .B.right" ).css(W, tinycolor({h: X.h2, s: X.s2, l: X.l2, a: X.a3}).toRgbString());

    },



    Rdata: {
	h: 0, // 0 to 360
	s: 0, // 0 to 1
	l: 0, // 0 to 1
	a: 0, // 0 to 1
	dh: 0, // 0 to 360
	ds: 0, // 0 to 1
	dl: 0, // 0 to 1
	da: 0 // 0 to 1
    }, // range data...

    
    make_Rdata: function(variant){

	var my_Rdata = variant.Rdata || {};
	
	// case 1: a pair of colours is supplied
	if(variant.colour_pair){
	    var A = tinycolor(variant.colour_pair[0]).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
	    var B = tinycolor(variant.colour_pair[1]).toHsl();
	    
	    // Hue angle utilised is going clockwise from A to B
	    // wrap around is handled in the structure of these calculations...
	    my_Rdata.h = ((A.h+B.h)/2 + (B.h < A.h ? 180 : 0)) % 360;
	    my_Rdata.dh = (B.h-A.h)/2 + (B.h < A.h ? 180 : 0);
	    
	    // These ones are much simpler...
	    //saturation
	    my_Rdata.s = (A.s+B.s)/2
	    my_Rdata.ds = Math.abs(A.s - B.s)/2;

	    //luminosity
	    my_Rdata.l = (A.l+B.l)/2
	    my_Rdata.dl = Math.abs(A.l - B.l)/2;
	    //alpha
	    my_Rdata.a = (A.a+B.a)/2
	    my_Rdata.da = Math.abs(A.a - B.a)/2;

	    my_Rdata.s = (A.s+B.s)/2
	    my_Rdata.ds = Math.abs(A.s - B.s)/2;

	    // case 2: specific properties are supplied
	}else{
	    
	    $.each( variant, function( key, value ) {

		if(key == "Rdata"){//dont use this key!
		    return;

		}else if(key == "h"){
		    my_Rdata.h = value;
		    
		}else if(key == "dh"){
		    my_Rdata.dh = value;

		}else if(key[0] == "d"){
		    // change to "ds", "dl", "da" (the key)
		    var keyA = key[1]; // key of the complementary property
		    my_Rdata[key] = value;
		    my_Rdata[keyA] = Math.min(my_Rdata[keyA], 1-value);
		    my_Rdata[keyA] = Math.max(my_Rdata[keyA], value);
		    
		}else{
		    // (assume) change to "s", "l", "a" (the key)
		    var keyA = "d" + key; // key of the complementary property
		    my_Rdata[key] = value;
		    my_Rdata[keyA] = Math.min(value, 1-value, my_Rdata[keyA]);
		}
	    });
	    
	}
	
	return my_Rdata;
    },

    get_Rdata_components: function(altRdata){

	var myRdata = altRdata || this.Rdata;
	
    	var Q = function (x){return x>0 ? (x%360) : ((x+360)%360);}

	var h1 = Q( myRdata.h - myRdata.dh ); // lower Hue
	var h2 = myRdata.h;                      // mid Hue
	var h3 = Q( myRdata.h + myRdata.dh ); // upper Hue

	// ( for s, l, a below, sums of x and dx are ASSUMED to be within bounds of 0 and 1)
	var s1 = myRdata.s - myRdata.ds;
	var s2 = myRdata.s;
	var s3 = myRdata.s + myRdata.ds;
	    
	var l1 = myRdata.l - myRdata.dl;
	var l2 = myRdata.l;
	var l3 = myRdata.l + myRdata.dl;

	var a1 = myRdata.a - myRdata.da;
	var a2 = myRdata.a;
	var a3 = myRdata.a + myRdata.da;

	
	return {
	    h1: h1,
	    h2: h2,
	    h3: h3,
	    dh: myRdata.dh,
	    
	    s1: s1,
	    s2: s2,
	    s3: s3,
	    ds: myRdata.ds,
	    
	    l1: l1,
	    l2: l2,
	    l3: l3,
	    dl: myRdata.dl,
	    
	    a1: a1,
	    a2: a2,
	    a3: a3,
	    da: myRdata.da,
	    
	    tiny_av: tinycolor({h: h2, s: s2, l: l2, a: a2}),
	    colour1: tinycolor({h: h1, s: s1, l: l1, a: a1}).toRgbString(),
	    colour2: tinycolor({h: h3, s: s3, l: l3, a: a3}).toRgbString()
	};

    },
    
    make_gradient_cell: function(size, RC, conf){
	
	var $grad = $('<canvas/>')
	    .attr("width", size)
	    .attr("height", size)
	    .addClass("gradient-cell");
	var ctx = $grad[0].getContext('2d');

	if (ctx) {
	    for (var x = 0; x < size; x++){
		for (var y = 0; y < size; y++){
		    //determine colour at x,y
		    var x_frac = x/(size-1);//what fraction of the x-distance along is this pixel?
		    var y_frac = y/(size-1);

		    // for this pixel, to what extent should it be the hue of colour 2?
		    var H_frac = conf.H=="x" ? x_frac : (conf.H=="y" ? y_frac : conf.H);
		    var S_frac = conf.S=="x" ? x_frac : (conf.S=="y" ? y_frac : conf.S);
		    var L_frac = conf.L=="x" ? x_frac : (conf.L=="y" ? y_frac : conf.L);

		    var Hx = RC.h1 + H_frac * RC.dh * 2;
		    var Sx = RC.s1 + S_frac * RC.ds * 2;
		    var Lx = RC.l1 + L_frac * RC.dl * 2;
		    
		    //draw that pixel
		    ctx.fillStyle = tinycolor( {h: Hx, s: Sx, l: Lx} ).toHexString();
		    ctx.fillRect (x, y, 1, 1);//x,y,w,h
		}
	    }
	}

	return $grad;

    }

};
