var edit_cp = {

    not_yet_initialised: true,
    selected_row_i: undefined,
    CP_ES: undefined, // Colour-Pot edit state
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
		console.log(J);
		console.log("H", J.h, Q(J.h+Dh), Q(J.h-Dh));
		var J1 = tinycolor({ h: Q(J.h+Dh), s: R(J.s+Ds), l: R(J.l+Dl), a: R(J.a+Da) }).toRgbString();
		var J2 = tinycolor({ h: Q(J.h-Dh), s: R(J.s-Ds), l: R(J.l-Dl), a: R(J.a-Da) }).toRgbString();
		
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





	// K. functions to control the BGRINS colour-picker, common to both editing a SOLID and a RANGE

	// K.1 - Function to destroy and re-create the picker
	// Regeneration like this ensures the correct "starting colour" will be depicted by the picker
	var regenerate_picker = function(starting_colour, onColourMove){
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
	};


	// K.2 - unhide the picker
	// (will set the picker's "original" / "starting" colour to the colour provided)
	var BGrinsShow = function(starting_colour, onColourMove) {

	    $("#bgrins-container").show({duration: 400});
	    regenerate_picker(starting_colour, onColourMove);

	    //to prevent the change event triggered from immediately re-closing
	    just_opened = true;
	    setTimeout(function(){just_opened = false;}, 200);
	};

	

	// 2. Controls for editing a C-Pot element in SOLID mode

	
	// 2.1 - DEFN for live-update of two DOM elements upon colour adjust
	var bgrins_on_colMove_cb_SOLID = function(tinycolor) {
	    //note that converting colour to hex strips away the Alpha, which is what I want here.
	    var hexC = tinycolor.toHexString();
	    var withAlpha = tinycolor.toRgbString();
	    $("#cp-edit-solid .colour-sun.l").css("background", hexC);
	    $("#k2 #strip").css("background", withAlpha);
	};


	// 2.2 - "Cancel" Button of the colour picker
	$("#bgrins-buttons #cancel").click(function() {
	    $("#bgrins-container").hide({duration: 400});

	    //also, resore original colour (please don't copy paste code from above!)
	    var old_col = $("#bgrins-colour-picker").spectrum("option","color");
	    var non_transparent = tinycolor(old_col).toHexString();
	    $("#cp-edit-solid .colour-sun.l").css("background", non_transparent);
	    $("#k2 #strip").css("background", old_col);
	});


	// 2.3 - "Choose Colour" Button of the colour picker
	var just_opened = false;
	$("#bgrins-buttons #choose").click(function() {
	    if(!just_opened){
		var col_chosen = $("#bgrins-colour-picker").spectrum("get").toRgbString();
		//mutate the data
		var pot_row = DM.editing_ColourPot.contents[edit_cp.selected_row_i].solid = col_chosen;

		$("#bgrins-container").hide({duration: 400});

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



	

	// 2.7 - Click the "Colour Sun"
	$("#cp-edit-solid .colour-sun.l").click(function (){
	    // take from the 'strip' which includes Alpha channel.
	    var mySolid_colour = $("#cp-edit-solid #k2 #strip").css("background-color");
	    BGrinsShow(mySolid_colour, bgrins_on_colMove_cb_SOLID);
	    
	});









	// 3. Controls for editing a C-Pot element in RANGE->Central Mode

	// 3.1 - Clone HTML to make the colour shades preview-blocks for Hue, Sat, Lum, Alpha
	var $my_Div = $( "#colour-pots-edit #tabs-e1 div.Ln.hue" ).clone()
	    .removeClass("hue");

	// create sections for SLA from H
	$( "#colour-pots-edit #tabs-e1").append(
	    $my_Div.clone().addClass("sat"),
	    $my_Div.clone().addClass("lum"),
	    $my_Div.addClass("alp")
	);

	$( "#colour-pots-edit #tabs-e1 .hue .name").text("Hue:");
	$( "#colour-pots-edit #tabs-e1 .sat .name").text("Saturation:");
	$( "#colour-pots-edit #tabs-e1 .lum .name").text("Luminosity:");
	$( "#colour-pots-edit #tabs-e1 .alp .name").text("Alpha:");

	
	// 3.2 - little strips of colour SELECTED upon click...
	$("#tabs-e1 .Ln .B").click(function(){
	    $("#tabs-e1 .Ln .B").removeClass("sel");
	    $(this).addClass("sel");
	});


	// 3.3 - change the "Central" colour via the conventional bgrins picker...
	$("#tabs-e1 .colour-sun.s").click(function (){

	    $("#bgrins-container").show({duration: 400});
	    //this will set picker's original colour to the starting colour.
	    // take from the 'strip' which includes Alpha channel.


	    var active_colour = $("#cp-edit-solid #k2 #strip").css("background-color");
	    regenerate_picker(active_colour);
	    //to prevent the change event triggered from immediately re-closing
	    just_opened = true;
	    setTimeout(function(){just_opened = false;}, 200);
	});






	
	// 4. Controls for editing a C-Pot element in RANGE->Edges Mode




	
	// 5. Controls for editing a C-Pot element; RANGE->Subspace

	// 5.1 - Choose between  1D and 4D
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
			// Do a bunch of stuff to indicate on the UI

			// determine various averages etc...
			var tc1 = tinycolor(pot_elem.range[0]);
			var tc2 = tinycolor(pot_elem.range[1]);
			var tcM = logic.tiny_HSLA_average(tc1, tc2);//tinycolor.mix(tc1, tc2, amount = 50);
			var av_colour = tcM.toRgbString();

			var A = tc1.toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
			var B = tc2.toHsl();
			var M = tcM.toHsl();

			//no alpha
			$("#cp-edit-tabs .colour-sun.s").css("background-color", tcM.toHexString());
			
			//H
			$("#cp-edit-tabs .Ln.hue .B.left"  ).css("background-color", tinycolor({h: A.h, s: M.s, l: M.l, a: M.a}).toRgbString());
			$("#cp-edit-tabs .Ln.hue .B.center").css("background-color", av_colour);
			$("#cp-edit-tabs .Ln.hue .B.right" ).css("background-color", tinycolor({h: B.h, s: M.s, l: M.l, a: M.a}).toRgbString());

			//S
			$("#cp-edit-tabs .Ln.sat .B.left"  ).css("background-color", tinycolor({h: M.h, s: A.s, l: M.l, a: M.a}).toRgbString());
			$("#cp-edit-tabs .Ln.sat .B.center").css("background-color", av_colour);
			$("#cp-edit-tabs .Ln.sat .B.right" ).css("background-color", tinycolor({h: M.h, s: B.s, l: M.l, a: M.a}).toRgbString());

			//L
			$("#cp-edit-tabs .Ln.lum .B.left"  ).css("background-color", tinycolor({h: M.h, s: M.s, l: A.l, a: M.a}).toRgbString());
			$("#cp-edit-tabs .Ln.lum .B.center").css("background-color", av_colour);
			$("#cp-edit-tabs .Ln.lum .B.right" ).css("background-color", tinycolor({h: M.h, s: M.s, l: B.l, a: M.a}).toRgbString());

			//A
			$("#cp-edit-tabs .Ln.alp .B.left"  ).css("background-color", tinycolor({h: M.h, s: M.s, l: M.l, a: A.a}).toRgbString());
			$("#cp-edit-tabs .Ln.alp .B.center").css("background-color", tinycolor({h: M.h, s: M.s, l: M.l, a: M.a}).toRgbString());
			$("#cp-edit-tabs .Ln.alp .B.right" ).css("background-color", tinycolor({h: M.h, s: M.s, l: M.l, a: B.a}).toRgbString());


		    }

		}

	    })
	);
    },

    gen_row_preview_contents: function(pot_elem, i){
	var $contents = [];
	if(pot_elem.type=="range"){//HTML for 'range'

	    // determine various averages etc...
	    var tc1 = tinycolor(pot_elem.range[0]);
	    var tc2 = tinycolor(pot_elem.range[1]);
	    var hex1 = tc1.toHexString();
	    var hex2 = tc2.toHexString();
//	    var tiny_average_col = tinycolor.mix(tc1, tc2, amount = 50);
	    var tiny_average_col = logic.tiny_HSLA_average(tc1, tc2);
	    var average_col = tiny_average_col.toRgbString();
	    var average_col_NA = tiny_average_col.toHexString();
	    var average_col_A1 = tiny_average_col.setAlpha(tc1.getAlpha());
	    var average_col_A2 = tiny_average_col.setAlpha(tc2.getAlpha());

	    $contents = [
		$("<div\>").addClass("threeCells").append(
		    gradient_cell.make(25, hex1, hex2, {H:0, S:"y", L:"x"}),
		    gradient_cell.make(25, hex1, hex2, {H:"x", S:0, L:"y"}),
		    gradient_cell.make(25, hex1, hex2, {H:"x", S:"y", L:0})
		),
		$("<div\>").addClass("threeCells low").append(
		    gradient_cell.make(25, hex1, hex2, {H:1, S:"y", L:"x"}),
		    gradient_cell.make(25, hex1, hex2, {H:"x", S:1, L:"y"}),
		    gradient_cell.make(25, hex1, hex2, {H:"x", S:"y", L:1})
		),
		$("<div\>").addClass("oblong")//append order to make sure it's on top...
		    .css("background", average_col_NA),
		$("<div\>").addClass("blank").append(
		    $("<div\>").addClass("chequer"),
		    $("<div\>").addClass("alpha A-c1")
			.css("background", average_col_A1),
		    $("<div\>").addClass("alpha A-c2")
			.css("background", average_col_A2)
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
    }

};
