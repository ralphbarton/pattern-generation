var cpot_edit_init = {
    
    init: function(){


	// 1. Main controls of the C-Pot edit window (these are permanently shown)
	
	// 1.1 - functionality of the "Cancel" and "Done" buttons
	// (note that "Done" may get blocked if probs don't sum to 100% etc...
	$("#cp-edit-buttons #cancel").click(function(){cpot_edit.hide();});
	$("#cp-edit-buttons #done").click(function(){

	    if(!$(this).hasClass("ui-disabled")){
		//first save data...
		DM.EDcpot_Save(cpot_view.selected_cp_index);//return value is the index of the colour-pot just saved
		cpot_edit.hide();

		//redraws the table and the preview on the View tab, with the latest data...
		cpot_view.regenerate_table(cpot_view.selected_cp_index);
		cpot_view.fill_preview(".preview-container#main-cp-view");
	    }
	});


	// 1.1.1 Initiate SmartInput for the Title (no specific pot set)
	$("#colour-pots-edit input.cpot-title").SmartInput({
	    underlying_key: "description",
	    data_class: "text",
	});


	
	// 1.2 - jQueryUI initialisation command for the "range" tabs (i.e. Central / Boundaries / Subspace)
	$("#cp-edit-tabs").tabs();

	
	// 1.3 - Functions underneath list of C-Pot elements

	// 1.3.1 - change the selected row from type 'range' to type 'solid' (dropdown item)
	$("#cp-edit-actions #conv-to-solid").click(function(){
	    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];

	    // mutate data
	    pot_elem.type = "solid";
	    pot_elem.solid = cpot_util.range_unpack(pot_elem.range).tiny_av.toRgbString();

	    //refresh view
	    cpot_edit.visual_update();
	});

	// 1.3.2 - change the selected row from type 'solid' to type 'range' (dropdown item)
	$("#cp-edit-actions #conv-to-range").click(function(){

	    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
	    var adjustment = tinycolor(pot_elem.solid).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
	    
	    pot_elem.type = "range";
	    var zero_spread_range = cpot_util.range_set(adjustment);//first inject the central colour
	    pot_elem.range = cpot_util.range_set({
		dh: 15,
		ds: 0.30,
		dl: 0.10,
		da: 0.20
	    }, zero_spread_range);

	    //refresh view
	    cpot_edit.visual_update();
	});

	
	// 1.3.3 - rescale probs to SUM to 100 (dropdown item)
	$("#cp-edit-actions #sum100").click(function(){

	    // may fail if all probabilities are zero...
	    DM.EDcpot_sum100();

	    // view update required now...
	    cpot_edit.check_valid_probs();//this has the side effect of recolouring 'done' button.
	    //unconditional - and probably duplicate - preview redraw...
	    cpot_view.fill_preview("#colour-pots-edit .preview-container", DM.EDITINGcpot);

	    // update the view to match the underlying data
	    // note how ref is already known by SmartInput("update", {...})
    	    $("#edit-cp-table tbody tr").each(function(i){
		$(this).find("input").SmartInput("update", {UI_enable: false, data_change: true});
	    });
	});


	// 1.3.4 - set all probabilities equal (dropdown item)
	$("#cp-edit-actions #all-eq").click(function(){
	    //underlying data change
	    DM.EDcpot_AllEqualProbs();

	    //just click the other button, and have it do all the work, including view update.
	    $("#cp-edit-actions #sum100").click();
	});


	// 1.3.5 - Add delta-from-100% to seection - another way to achieve sum=100 (dropdown item)
	// (must also respect probs all > 0%)
	$("#cp-edit-actions #delta-to-selection").click(function(){

	    //underlying data change
	    var delta = DM.EDcpot_SumProbs() - 100;
	    var ED_pot_row_i = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
	    ED_pot_row_i.prob = Math.max(ED_pot_row_i.prob-delta, 0);

	    cpot_edit.check_valid_probs();//this has the side effect of recolouring 'done' button.
	    cpot_edit.visual_update(); //refresh view
	});



	// 1.4 - Buttons underneath list of C-Pot elements

	// 1.4.1 - Add new C-Pot element
	var ADD_subOp = null;
	$("#cp-edit-table-buttons #add").click(function(){

	    if(ADD_subOp != "B"){

		var R_col = $("#cp-edit-table-buttons #add #A").css("background-color");

		var rows = DM.EDcpot_NewRow(ADD_subOp == "A" ? R_col : undefined );
		cpot_edit.selected_row_i = rows-1;//select final row...
		cpot_edit.visual_update(); //refresh view
		// Disable "done" button if necessary
		cpot_edit.check_valid_probs();
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
	    if(cpot_edit.selected_row_i != undefined){
		DM.EDcpot_DeleteRow(cpot_edit.selected_row_i);

		//now, leave selected either replacing row in same position, or final row
		cpot_edit.selected_row_i = Math.min(cpot_edit.selected_row_i, DM.EDITINGcpot.contents.length-1);

		cpot_edit.visual_update(); //refresh view
		// Disable "done" button if necessary
		cpot_edit.check_valid_probs();
	    }
	});



	// 1.5 - The C-Pot preview area for this "Window"

	// 1.5.1 - initalise the preview (to an expanded state)
	$("#colour-pots-edit .preview-container").append(
	    global.$div_array(152, "preview-cell small")
	);

	// 1.5.2 - re-randomise the preview area
	$("#colour-pots-edit #preview-area #re-randomise").click(function(){
	    cpot_view.fill_preview("#colour-pots-edit .preview-container", DM.EDITINGcpot);
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
		if(cpot_edit.selected_row_i != undefined){
		    cpot_edit.selected_row_i = undefined;
		    //no fading out here, because the preview area expands instantly...
		    $("#cp-edit-tabs").hide();
		    $("#cp-edit-solid").hide();
		}

		cpot_edit.visual_update(); //refresh view
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

		// this is irrelivant because the picker is 'flat'
		//		clickoutFiresChange: true, // cause a change event upon clickout
		
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

	    //Restore original colour
	    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];

	    if(pot_elem.type == "solid"){
		var old_colour = $("#bgrins-colour-picker").spectrum("option","color");
		cpot_edit.update_solid_pane_colours( old_colour, {updateInputElems: true} );

	    }else if(pot_elem.type == "range"){

		// just restore to the existing values
		// Pane 1 - Central
		cpot_edit.update_range_pane_colours(pot_elem.range, {updateInputElems: true} );
		// Pane 2 - Boundaries
		cpot_edit.update_range_boundaries_pane( pot_elem.range );
		
	    }
	});


	// 2.3 - "Choose Colour" Button of the colour picker
	var just_opened = false;
	$("#bgrins-buttons #choose").click(function() {
	    if(!just_opened){
		$("#bgrins-container").hide({duration: 400});
		var col_chosen = $("#bgrins-colour-picker").spectrum("get").toRgbString();

		//mutate the data
		var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
		
		if(pot_elem.type == "solid"){// either 'solid' or 'range'
		    // Mutate the solid colour
		    pot_elem.solid = col_chosen;

		}else if(pot_elem.type == "range"){

		    //it is a boolean encoded as a string!
		    var is_boundary = $("#cp-edit-tabs ul > li:nth-of-type(2)").attr("aria-selected") == "true";
		    
		    if(is_boundary){
			//extract colours from out of the HTML
			var col_1 = $("#tabs-e2 .c1 .view .B").css("background-color");
			var col_2 = $("#tabs-e2 .c2 .view .B").css("background-color");
			var C1 = tinycolor(col_1).toHsl();
			var C2 = tinycolor(col_2).toHsl();
			
			// save
			pot_elem.range = cpot_util.range_from_colour_pair([col_1, col_2]);
			// the bit unset refers to using the smaller of the SLA values in COLOUR 1
			pot_elem.range.sla_perm = (C2.s < C1.s)*4 + (C2.l < C1.l)*2 + (C2.a < C1.a);
		    }else{
			// Mutate the range (keep spread but change central value)
			pot_elem.range = cpot_util.range_set(col_chosen, pot_elem.range);
		    }
		    
		}

		//refresh view
		//note that this function triggers a click event (recursion?)
		// this shows the ugliness of using dummy click events as a means of UI visual update
		cpot_edit.visual_update();
	    }
	});


	
	// 2.4 - Change SIZE of the colour picker
	var large_BGrins = function(make_large){
	    $("#bgrins-container").toggleClass("large", make_large);
	    setTimeout(function(){$("#bgrins-colour-picker").spectrum("reflow");},410);
	}

	$("#bgrins-actions #normal-large.act-mutex").MutexActionLink([0,1], [
	    function(){large_BGrins(false);},
	    function(){large_BGrins(true);},
	]);


	
	// 2.5 - Change format (HEX v. RGB v. HSL) of the colour string provided in the colour picker
	var setStringFormat_BGrins = function(format){
	    $("#bgrins-colour-picker").spectrum("option", "preferredFormat", format);
	    var w = $("#bgrins-colour-picker").spectrum("get");
	    $("#bgrins-colour-picker").spectrum("set", w);
	};

	$("#bgrins-actions #hex-rgb-hsl.act-mutex").MutexActionLink([1,1,1], [//show all as available
	    function(){ setStringFormat_BGrins("hex3")},
	    function(){ setStringFormat_BGrins("rgb")},
	    function(){ setStringFormat_BGrins("hsl")}
	]);




	
	// 3. Editing a C-Pot element in SOLID mode

	// 3.1 - initialise all the Input elements...
	$( "#cp-edit-solid .sld input").each(function(){
	    var x1 = $(this).parent(); // classes of "sld hue", "sld sat" etc...

	    //hue in degrees and other properties in %
	    var dc = x1.hasClass("hue") ? "degrees" : "percent";
	    var dco = x1.hasClass("hue") ? {max:360, steps:[1,5,30]} : undefined;
	    var myKey = x1.attr("class");//use the container div *classes* as key in the {}...
	    
	    $(this).SmartInput({
		data_class: dc,
		data_class_override: dco,
		underlying_obj: cpot_edit.InputsValues,
		underlying_key: myKey,
		cb_change: function(){
		    // Logic here is to create a new colour by applying the numeric change (HSLA) of the input element
		    // to the original solid colour
		    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
		    var my_hsla = tinycolor(pot_elem.solid).toHsl();

		    var my_attr = myKey.replace("sld ", "")[0]; //This should be a 1-letter string "h", "s" etc...
		    my_hsla[my_attr] = cpot_edit.InputsValues[myKey] * (myKey.includes("hue") ? 1 : 0.01);
		    var new_solid = tinycolor(my_hsla).toRgbString();

		    //mutate underlying data - 'saves' the change instigated by the interaction with the Input
		    pot_elem.solid = new_solid;
		    
		    //this is the one pane-update case where we don't update the input elems
		    cpot_edit.update_solid_pane_colours( new_solid, {updateInputElems: false} );
		},
		cb_focusout: function(){
		    cpot_edit.visual_update();
		}
		
	    });
	    
	});
	
	
	// 3.2 - Click the "Colour Sun"
	$("#cp-edit-solid .colour-sun.l").click(function (){

	    // take from 'strip' (this includes Alpha)
	    var mySolid_colour = $("#cp-edit-solid #k2 #strip").css("background-color");

	    BGrinsShow(mySolid_colour, function(tinycolor) {
		cpot_edit.update_solid_pane_colours( tinycolor.toRgbString(), {updateInputElems: true} );
	    });
	    
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
	    var dco = x1.hasClass("hue") ? {max:360, steps:[1,5,30]} : undefined;
	    var myKey = x1.attr("class").replace("Ln ","") + " > " + x2.attr("class");
	    
	    $(this).SmartInput({
		data_class: dc,
		data_class_override: dco,
		underlying_obj: cpot_edit.InputsValues,
		underlying_key: myKey,
		cb_change: function(){
		    // "shortKey" takes X.* values * such as X.h, X.dh
		    var shortKey = myKey.includes("mid") ? myKey[0]: "d"+myKey[0];
		    var fac = myKey.includes("hue") ? 1 : 0.01;
		    fac *= myKey.includes("var") ? 0.5 : 1;

		    var adjustment = {};
		    adjustment[shortKey] = cpot_edit.InputsValues[myKey] * fac;

		    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
		    var new_range = cpot_util.range_set(adjustment, pot_elem.range);

		    //mutate underlying data - 'saves' the change instigated by the interaction with the Input
		    pot_elem.range = new_range;
		    
		    cpot_edit.update_range_pane_colours(new_range, {updateInputElems: false} );
		},
		cb_focusout: function(){
		    cpot_edit.visual_update();
		}
		
	    });
	    
	});

	

	// 4.4 - Click the "Colour Sun"
	$("#tabs-e1 .colour-sun.s").click(function (){
	    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
	    var mySolid_colour = cpot_util.range_unpack(pot_elem.range).tiny_av.toRgbString();
	    BGrinsShow(mySolid_colour, function(tinycolor) {
		//this is the callback for RANGE changes (live-update range boundary colour pieces)
		var new_range = cpot_util.range_set(tinycolor.toHsl(), pot_elem.range);
		cpot_edit.update_range_pane_colours(new_range, {updateInputElems: true} );
	    });	    
	});

	

	


	



	
	// 5. Controls for editing a C-Pot element in RANGE->Boundaries Mode
	
	// 5.1 - Click the "Colour Sun" - Colour 1
	$("#tabs-e2 .c1 .colour-sun.m").click(function (){
	    var col_1 = $("#tabs-e2 .c1 .view .B").css("background-color");
	    var col_2 = $("#tabs-e2 .c2 .view .B").css("background-color");

	    BGrinsShow(col_1, function(tinycolor) {
		cpot_edit.update_range_boundaries_pane(null, {
		    colour_1: tinycolor.toRgbString(),
		    colour_2: col_2
		});
	    });
	});


	// 5.2 - Click the "Colour Sun" - Colour 2
	$("#tabs-e2 .c2 .colour-sun.m").click(function (){
	    var col_1 = $("#tabs-e2 .c1 .view .B").css("background-color");
	    var col_2 = $("#tabs-e2 .c2 .view .B").css("background-color");

	    BGrinsShow(col_2, function(tinycolor) {
		cpot_edit.update_range_boundaries_pane(null, {
		    colour_1: col_1,
		    colour_2: tinycolor.toRgbString()
		});
	    });
	});

	// 5.3 - click the "reverse hue" link
	$("#reverse-hue .action-link").click(function (){
	    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
	    pot_elem.range.h = (pot_elem.range.h + 180) % 360;
	    pot_elem.range.dh = 180 - pot_elem.range.dh;
	    cpot_edit.visual_update();
	});

	// 5.4 - click the "permute sla" link
	var permutation_N = 0;
	$("#permute-sla .action-link").click(function (){
	    var pot_elem = DM.EDITINGcpot.contents[cpot_edit.selected_row_i];
	    var X = cpot_util.range_unpack( pot_elem.range );
	    pot_elem.range.sla_perm = (pot_elem.range.sla_perm + (X.a3==X.a1?2:1)) % 8;//increment by 2 if alphas same
	    cpot_edit.update_range_boundaries_pane(pot_elem.range);
	});

	
	
	// 6. Controls for editing a C-Pot element; RANGE->Subspace

	// 6.1 - Choose between  1D and 4D
	$("#space-1d-4d.act-mutex").MutexActionLink([1,1], [
	    function(){
		console.log("link X");
	    },
	    function(){
		console.log("link Y");
	    }
	]);


    }

};
