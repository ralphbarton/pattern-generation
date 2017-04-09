var edit_cp = {

    not_yet_initialised: true,
    selected_row_i: undefined,
    init: function(){

	//initiate tabs...
	$("#cp-edit-tabs").tabs();

 	//add action for main TAB buttons
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

	// add logic to the action links of Solid v. Range
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
	widgets.actionLink_unset("#solid-v-range.act-mutex", "all");

	// Action Link callback 1:
	// make sum 100%
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

	// Action Link callback 2:
	// Set all probabilities equal
	$("#cp-edit-actions #all-eq").click(function(){
	    //underlying data change
	    DM.allEqualProbs_editing_ColourPot();

	    //just click the other button, and have it do all the work, including view update.
	    $("#cp-edit-actions #sum100").click();
	});

	// Action Link callback 3:
	// Add delta-from-100% to seection (another way to achieve sum=100
	// must also respect probs all > 0%
	$("#cp-edit-actions #delta-to-selection").click(function(){

	    //underlying data change
	    var delta = DM.sumProbs_editing_ColourPot() - 100;
	    var ED_pot_row_i = DM.editing_ColourPot.contents[edit_cp.selected_row_i];
	    ED_pot_row_i.prob = Math.max(ED_pot_row_i.prob-delta, 0);

	    edit_cp.check_valid_probs();//this has the side effect of recolouring 'done' button.
	    edit_cp.visual_update(); //refresh view
	});


	// 4. Callbacks for table action-links

	// 4.1 - Add
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

	// 4.1.1 - fancy suboption of ADD - [A] adds row, using a random colour previewed
	$("#cp-edit-table-buttons #add #A").click(function(){
	    ADD_subOp = "A";//detect the specific suboption clicked (for purpose of other callbacks triggered)
	    setTimeout(function(){ADD_subOp = null;}, 50);
	});

	// 4.1.2 - fancy suboption of ADD - [B] cycles the random colour used for tiny-bg
	$("#cp-edit-table-buttons #add #B").click(function(){
	    var rand_color = tinycolor.fromRatio({ h: Math.random(), s: 1, l: 0.25+Math.random()*0.5 });
	    $("#cp-edit-table-buttons #add #A").show()
		.css("background-color", "#"+rand_color.toHex());

	    ADD_subOp = "B";//detect the specific suboption clicked (for purpose of other callbacks triggered)
	    setTimeout(function(){ADD_subOp = null;}, 50);
	});


	// 4.2 - Delete
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

	// 5. CP-edit Preview zone...

	// initalise - TO AN EXPANDED STATE...
	$("#colour-pots-edit .preview-container").append(
	    global.$div_array(152, "preview-cell small")
	);

	// re-randomise callback
	$("#colour-pots-edit #preview-area #re-randomise").click(function(){
	    view_cp.fill_preview("#colour-pots-edit .preview-container", DM.editing_ColourPot);
	});

	// expand callback
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








	//Add Code for the CP-edit solid tab	

	// add event listeners...
	var brgins_on_colMove_cb = function(tinycolor) {
	    //note that converting colour to hex strips away the Alpha, which is what I want here.
	    var hexC = tinycolor.toHexString();
	    var withAlpha = tinycolor.toRgbString();
	    $("#cp-edit-solid .colour-sun.l").css("background", hexC);
	    $("#k2 #strip").css("background", withAlpha);
	}

	$("#bgrins-buttons #cancel").click(function() {
	    $("#bgrins-container").hide({duration: 400});

	    //also, resore original colour (please don't copy paste code from above!)
	    var old_col = $("#bgrins-colour-picker").spectrum("option","color");
	    $("#cp-edit-solid .colour-sun.l").css("background", old_col);
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

	//other action links of my own adding, within the popup...


	// Picker Size change...
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

	var poke = function(){
	    var w = $("#bgrins-colour-picker").spectrum("get");
	    $("#bgrins-colour-picker").spectrum("set", w);
	};

	// Colour string format change...
	widgets.actionLink_init("#bgrins-actions #hex-rgb-hsl.act-mutex",[
	    function(){$("#bgrins-colour-picker").spectrum("option", "preferredFormat", "hex3"); poke();},
	    function(){$("#bgrins-colour-picker").spectrum("option", "preferredFormat", "rgb"); poke();},
	    function(){$("#bgrins-colour-picker").spectrum("option", "preferredFormat", "hsl"); poke();},
	]);
	widgets.actionLink_unset("#bgrins-actions #hex-rgb-hsl.act-mutex", null);//show all as available

	//function only used once, on colour-sun click below...
	var regenerate_picker = function(base_col){
	    //Initiate the element here
	    var was_large = $("#bgrins-container").hasClass("large");
	    var original_colour = $("#bgrins-colour-picker").spectrum("option", "color"); 
	    var original_format = $("#bgrins-colour-picker").spectrum("option", "preferredFormat");
	    $("#bgrins-colour-picker").spectrum("destroy");
	    $("#bgrins-colour-picker").spectrum({
		flat: true, // always show full-size, inline block...
		color: base_col || original_colour, // default colour for the picker...
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
		move: brgins_on_colMove_cb
	    });
	    if(was_large){
		$("#bgrins-container").addClass("large");
	    }
	};

	$("#cp-edit-solid .colour-sun.l").click(function (){
	    $("#bgrins-container").show({duration: 400});
	    //this will set picker's original colour to the starting colour.
	    var active_colour = $("#cp-edit-solid .colour-sun.l").css("background-color");
	    regenerate_picker(active_colour);
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


	// x.0 - Initialisation of the Range Tab...
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

	$("#tabs-e1 .Ln .B").click(function(){
	    $("#tabs-e1 .Ln .B").removeClass("sel");
	    $(this).addClass("sel");
	});
	



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
			$("#cp-edit-solid .colour-sun.l").css("background-color", pot_elem.solid);
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
			$("#cp-edit-tabs .colour-sun.s").css("background-color", pot_elem.range[0]);

		    }

		}

	    })
	);
    },

    gen_row_preview_contents: function(pot_elem, i){
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
		    .css("background",pot_elem.solid)
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

