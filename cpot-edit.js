var cpot_edit = {

    selected_row_i: undefined,
    InputsValues: {},
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

	//this initiates the SmartInput for the Title, only
	$("#colour-pots-edit input.cpot-title").SmartInput({
	    underlying_obj: POT,
	    underlying_key: "description",
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
		    $('<input/>')
			.addClass("blue-cell")//for css styling
			.SmartInput({
			underlying_obj: pot_elem,
			underlying_key: "prob",
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

		// THIS IS THE ALL IMPORTANT UPON SELECT ROW FUNCTION
		if(cpot_edit.selected_row_i != i){
		    //This code is all conditional upon a NEW row being selected.
		    
		    // 1. Direct updates to indicate new row selected
		    cpot_edit.selected_row_i = i;
		    $("#edit-cp-table tr.selected").removeClass("selected");
		    $(this).addClass("selected");

		    // 1.1 Always hide the colour-picker (if present) upon selection of a new row
		    $("#bgrins-container").hide({duration: 400});
		    

		    // 2. reduce the size of the preview container, if expanded...
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


		    // 3. Change which side panel is shown...
		    if(pot_elem.type == "solid"){
			$("#cp-edit-tabs").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-solid").fadeIn({duration:400, easing: "linear"});
			//indicate what the selected item is (i.e. type="Solid") using the dropdown button text
			$("#cp-edit-actions .dropdown.elem-type .dropbtn").text("Solid");

			//update the pane to indicate details of the SOLID colour selected...
			cpot_edit.update_solid_pane_colours( pot_elem.solid, {updateInputElems: true} );
			
		    }else{
			$("#cp-edit-solid").fadeOut({duration:400, easing: "linear"});
			$("#cp-edit-tabs").fadeIn({duration:400, easing: "linear"});
			//indicate what the selected item is (i.e. type="Range") using the dropdown button text
			$("#cp-edit-actions .dropdown.elem-type .dropbtn").text("Range");

			// Visual update function for Tab 1 - Range 'central' pane
			cpot_edit.update_range_pane_colours( pot_elem.range, {updateInputElems: true} );

			// Visual update function for Tab 1 - Range 'Boundaries' pane
			cpot_edit.update_range_boundaries_pane( pot_elem.range );

		    }

		}
	    })
	);
    },

    
    gen_row_preview_contents: function(pot_elem, i){
	var $contents = [];
	if(pot_elem.type=="range"){//HTML for 'range'

	    var X = cpot_util.range_unpack( pot_elem.range );
	    $contents = [
		$("<div\>").addClass("threeCells").append(
		    cpot_util.make_gradient_cell(25, X, {H:0, S:"y", L:"x"}),
		    cpot_util.make_gradient_cell(25, X, {H:"x", S:0, L:"y"}),
		    cpot_util.make_gradient_cell(25, X, {H:"x", S:"y", L:0})
		),
		$("<div\>").addClass("threeCells low").append(
		    cpot_util.make_gradient_cell(25, X, {H:1, S:"y", L:"x"}),
		    cpot_util.make_gradient_cell(25, X, {H:"x", S:1, L:"y"}),
		    cpot_util.make_gradient_cell(25, X, {H:"x", S:"y", L:1})
		),
		$("<div\>").addClass("oblong")//append order to make sure it's on top...
		    .css("background", X.tiny_av.toHexString()),
		$("<div\>").addClass("blank").append(
		    $("<div\>").addClass("chequer"),
		    $("<div\>").addClass("alpha A-c1")
			.css("background", X.tiny_av.setAlpha(X.a3).toRgbString()),
		    $("<div\>").addClass("alpha A-c2")
			.css("background", X.tiny_av.setAlpha(X.a1).toRgbString())
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



    update_solid_pane_colours: function(colour_str, options){

	//set the colour of the "solid" sidepanel
	var myColour = tinycolor(colour_str);
	$("#cp-edit-solid .colour-sun.l").css("background-color", myColour.toHexString());//non-transparent
	$("#k2 #strip").css("background-color", myColour.toRgbString());//with-transparency

	if(options.updateInputElems == true){
	    $( "#cp-edit-solid .sld input").each(function(){

		// 1. extract the relevent value from X and write it to "cpot_edit.InputsValues"
		var x1 = $(this).parent(); // classes of "sld hue", "sld sat" etc...
		var myKey = x1.attr("class");//use the container div *classes* as key in the {}...

		var my_hsla = myColour.toHsl();
		var my_attr = myKey.replace("sld ", "")[0]; //This should be a 1-letter string "h", "s" etc...

		cpot_edit.InputsValues[myKey] = my_hsla[my_attr] * (myKey.includes("hue") ? 1 : 100);
		
		// 2. visual update of the SmartInput		
		$(this).SmartInput("update",{
		    data_change: true
		});
	    });

	}

    },

    //Here, options can be two alternative colours passed...
    update_range_boundaries_pane: function(range, options){

	options = options || {};

	if((!options.colour_1)||(!options.colour_2)){
	    var X = cpot_util.range_unpack( range );
	}

	var colour_1 = tinycolor(options.colour_1 || {h: X.h1, s: X.s1, l: X.l1, a: X.a1});
	var colour_2 = tinycolor(options.colour_2 || {h: X.h3, s: X.s3, l: X.l3, a: X.a3});

	var W = "background-color";
	// Colour 1
	$("#tabs-e2 .c1 .colour-sun.m").css(W, colour_1.toHexString());
	$("#tabs-e2 .c1 .view .B").css(W, colour_1.toRgbString());
	// Colour 2
	$("#tabs-e2 .c2 .colour-sun.m").css(W, colour_2.toHexString());
	$("#tabs-e2 .c2 .view .B").css(W, colour_2.toRgbString());


	// Vertical Gradient bar
	var C1 = colour_1.toHsl();
	var C2 = colour_2.toHsl();

	var SLA_mix = function(r){// r is mix ratio
	    var m = function(a,b){return (b*r+ a*(1-r));};
	    return {s: m(C1.s, C2.s), l: m(C1.l, C2.l), a: m(C1.a, C2.a)};
	};

	var h_high = C2.h > C1.h ? C2.h : (C2.h + 360); // may be over 360, guarenteed to exceed C1.h
	var h_span = h_high - C1.h;
	var n_stop = 0;
	
	var grad_str = ", " + colour_1.toRgbString() + " 0%";

	while (true){
	    var h_stopper = 60 * ( Math.ceil(C1.h / 60) + n_stop);
	    if(h_stopper > h_high){break;}
	    n_stop++;

	    var ratio = (h_stopper - C1.h) / h_span;	
	    var mix = SLA_mix(ratio);
	    mix.h = h_stopper%360;

	    var colourStr = tinycolor(mix).toRgbString();
	    var pcnt = (ratio * 100).toFixed(1);
	    grad_str += ", " + colourStr + " " + pcnt + "%";
	}
	
	grad_str += ", " + colour_2.toRgbString() + " 100%";
/*	    
	var h_span = C2.h > C1.h ? (C2.h - C1.h) : (C2.h - C1.h + 360);
	var h_sweeper = C1.h;
	var h_stopper = C1.h;

	var grad_str = "";
	while (true){
	    var ratio = (h_stopper - C1.h) / h_span;
	    var mix = SLA_mix(ratio);
	    mix.h = h_stopper%360;
	    var colourStr = tinycolor(mix).toHslString();
	    var pcnt = (ratio * 100).toFixed(1);
	    grad_str += ", " + colourStr + " " + pcnt + "%";

	    h_stopper = 60 * Math.ceil(h_sweeper / 60);
	    h_sweeper += 60;
	    if((h_stopper%360 > C2.h)&&((h_stopper-60)%360 < C2.h)){
		grad_str += ", " + colour_2.toHslString() + " 100%";
		break;
	    }
	    
	}
*/

	$("#tabs-e2 .gradient").css("background-image",
				    "linear-gradient(to bottom"+grad_str+")"
				   );
	
	/*
	
	$("#tabs-e2 .gradient").css("background-image",
				    "linear-gradient(to bottom, "+colour_1.toRgbString()+", "+colour_2.toRgbString()+")"
				   );


	linear-gradient(to bottom, #f0f9ff 0%,#cbebff 72%,#a1dbff 100%);
*/
	
    },
    

    //Note that "options" does only one thing. It may or not contain a flag for whether to also update inputs
    update_range_pane_colours: function(range, options){

	var X = cpot_util.range_unpack( range );
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
	if(options.updateInputElems == true){
	    $( "#colour-pots-edit #tabs-e1 input").each(function(){

		// 1. extract the relevent value from X and write it to "cpot_edit.InputsValues"
		var x2 = $(this).parent(); // var vs mid
		var x1 = $(this).parent().parent(); // hue, sat, lum, alp
		
		var myKey = x1.attr("class").replace("Ln ","") + " > " + x2.attr("class");
		var sect = myKey[0];
		// note that the "shortKey" we use here (in extracting components) has X.h2, X.dh
		var shortKey = myKey.includes("mid") ? sect+"2" : "d"+sect;

		//scale up by 100 and by 2 for user display
		var fac = myKey.includes("hue") ? 1 : 100;
		fac *= myKey.includes("var") ? 2 : 1;


		cpot_edit.InputsValues[myKey] = X[shortKey] * fac;

		// 2. visual update of the SmartInput
		$(this).SmartInput("update",{
		    data_change: true
		});
	    });
	}
	
    }

};
