var cpot_edit = {

    selected_row_i: undefined,
    CentralInputs_data: {},
    not_yet_initialised: true,
    
    show: function(index){

	if(this.not_yet_initialised){
	    cpot_edit_init.init();
	    this.not_yet_initialised = false;
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
	$("#colour-pots-edit .TL-2").text((cpot_view.selected_cp_index+1) + ". ");

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
	    cpot_edit.table_row(element, i);
	});

	// update the preview - conditional on its current state being valid...
	if(DM.sumProbs_editing_ColourPot() == 100){
	    cpot_view.fill_preview("#colour-pots-edit .preview-container", POT);
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
		cpot_view.fill_preview("#colour-pots-edit .preview-container", DM.editing_ColourPot);
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
			cb_change: function(){cpot_edit.check_valid_probs();},//all the graphical change...
			cb_focusout: function(){cpot_edit.check_valid_probs();}//may disable "done" btn
		    })
		),
		$('<td/>').addClass("col-3").append(
		    this.gen_row_preview_contents(pot_elem, i)
		)
	    ).click(function(){
		// in this context, we have "pot_elem", "i" which are accessed below...

		//
		// THIS IS THE ALL IMPORTANT UPON SELECT ROW FUNCTION
		if(cpot_edit.selected_row_i != i){

		    // 1. update global (view) state.
		    cpot_edit.selected_row_i = i;

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
			cpot_view.fill_preview("#colour-pots-edit .preview-container", DM.editing_ColourPot);
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
			cpot_edit.cp_range_set_colour_blocks( pot_elem.range );

		    }

		}
	    })
	);
    },

    
    gen_row_preview_contents: function(pot_elem, i){
	var $contents = [];
	if(pot_elem.type=="range"){//HTML for 'range'

	    var pot_Rdata = this.make_Rdata( pot_elem.range );
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


	//Update the input boxes according to the latest data...
	if(!(set_colour_options.no_input_update)){
	    $( "#colour-pots-edit #tabs-e1 input").each(function(){
		var x2 = $(this).parent(); // var vs mid
		var x1 = $(this).parent().parent(); // hue, sat, lum, alp
		
		var myKey = x1.attr("class").replace("Ln ","") + " > " + x2.attr("class");
		var sect = myKey[0];
		// note that the "shortKey" we use here (in extracting components) has X.h2, X.dh
		var shortKey = myKey.includes("mid") ? sect+"2" : "d"+sect;

		//scale up by 100 and by 2 for user display
		var fac = myKey.includes("hue") ? 1 : 100;
		fac *= myKey.includes("var") ? 2 : 1;
		cpot_edit.CentralInputs_data[myKey] = X[shortKey] * fac;

		
		$(this).SmartInput("update",{
		    data_change: true
		});
	    });
	}
	
    }

};
