var gallery_zoom = {

    init: function(){

	var magnif_showing = 0;
	/* value table for "magnif_showing"
	   -1  fade-out in progress
	   0   fully transparent
	   1   showing, with short timeout set
	   2   showing, with longer timeout set
	   3   requested close in progress
	 */
	var magnif_timeout_id = undefined;
	var magnif_timeout_id2 = undefined;

	var t_fade = 400;
	var t_move = 200;
	var t_brief = 1000;
	var t_long = 3000;

	var set_magnif_show_time = function(option){

	    var t_showfor = undefined;
	    if(option == "immediate"){
		t_showfor = 1;
		magnif_showing = 3;//requested close in progress
	    }else if(option == "brief"){
		t_showfor = t_brief;
		magnif_showing = 1;//brief show
	    }else if(option == "long"){
		t_showfor = t_long;
		magnif_showing = 2;//long show
	    }

	    //clear any pre-existing scheduled effects
	    clearTimeout(magnif_timeout_id);
	    clearTimeout(magnif_timeout_id2);

	    //start the Fadeout
	    magnif_timeout_id = setTimeout(function(){
		$("#magnify-popup").animate({opacity: 0}, t_fade);
		magnif_showing = -1;//fade-out in progress
	    }, t_showfor);

	    //soon after, reset the flag (when Fadeout complete)
	    magnif_timeout_id2 = setTimeout(function(){
		magnif_showing = 0;
		$("#magnify-popup").hide();//prevents clicks landing on transparent object
	    }, t_showfor + t_fade);
	};


	// respond to clicking within the image space...
	$("#Tab-exmp #img-section").on("click", function(e){

	    // 1. if fading out, stop this;
	    if(magnif_showing == -1){
		$("#magnify-popup").stop();
	    }

	    // 2. Changing location of the magnifier box (don't relocate if requested-close is in progress)...
	    // also, dont' relocate if click lands inside box.
	    // note how e.target is already a DOM element
	    var click_child_magnif = $.contains($("#magnify-popup")[0], e.target);
	    var click_main_magnif = $(e.target).is("#magnify-popup");
	    var click_outside_magnif = !(click_child_magnif || click_main_magnif);

	    if((magnif_showing < 3) && click_outside_magnif){

		var container_pos = $("#img-section").offset();
		var box_x = e.pageX - container_pos.left;
		var box_y = e.pageY - container_pos.top - parseInt($("#magnify-popup").css("height"))/2;

		//if visible, need to move it with an animation (can never be -1 here)
		if(magnif_showing != 0){
		    $("#magnify-popup").animate({
			left: box_x,
			top: box_y
		    }, t_move);

		}else{
		    //move it directly to location without animation
		    $("#magnify-popup").css({
			left: box_x,
			top: box_y
		    });
		}
	    }

	    // 3. set to highest opacity and extend (=set short) display-time
	    // (so long as not on long timeout or requested close)
	    if(magnif_showing < 2){
		// stop() => cancel any fadeOut in progress...
		$("#magnify-popup").show().animate({opacity: 0.9}, t_fade);
		set_magnif_show_time("brief");//disappear soon (1 second)
	    }


	});

	//respond to clicking a magnifier button
	$("#magnify-popup .buttons > div").on("click", function(){

	    // 1. if fading out, stop this;
	    if(magnif_showing == -1){
		$("#magnify-popup").stop();
	    }

	    //so long as not on requested close, restore highest opacity and extend timeout
	    if(magnif_showing < 3){
		// stop() => cancel any fadeOut in progress...
		$("#magnify-popup").animate({opacity: 0.9}, t_fade);
		set_magnif_show_time("long");//disappear after longer time (10 second)
	    }
	});

	//respond to clicking a the "close" button for the window...
	$("#magnify-popup .close").on("click", function(){
	    set_magnif_show_time("immediate");//disappear right now (effectively, it's 1ms!)
	});


	var opac_med = 0.6;
	var opac_low = 0.85;

	var mouseenter_counter = 0;
	$("#Tab-exmp #img-section").on("mouseenter", function(){
	    if(mouseenter_counter > 0){
		$("img#magnify-icon").animate({opacity: opac_med}, 200);
		setTimeout(function(){
		    $("img#magnify-icon").animate({opacity: 0}, 1000);
		}, 3200);
	    }
	    mouseenter_counter++;
	});

	//do it here rather than using css :hover (which conficts with js-managed styling responsiveness)
	$("#Tab-exmp img#magnify-icon").on("mouseenter", function(){
	    $("img#magnify-icon").animate({opacity: opac_low}, 200);
	});

	$("#Tab-exmp img#magnify-icon").on("mouseleave", function(){
	    $("img#magnify-icon").animate({opacity: opac_med}, 200);
	    setTimeout(function(){
		$("img#magnify-icon").animate({opacity: 0}, 1000);
	    }, 3200);
	});



	$("#Tab-exmp img#magnify-icon").on("click", function(){
	    gallery_zoom.set_panning_zoom();
	});

	//disable Firefox image drag behaviour for every image
	$(document).on("dragstart", function(e) {
	    if (e.target.nodeName.toUpperCase() == "IMG") {
		//however, this also prevents the behaviour where it is intended...
//		return false;
	    }
	});

    },


    set_panning_zoom: function(switch_on){


	if(switch_on === undefined){//then toggle whatever it is...

	    $("#Tab-exmp #img-section")
		.toggleClass("normal")
		.toggleClass("zooming")
	    switch_on = $("#Tab-exmp #img-section").hasClass("zooming");
	}else{

	    $("#Tab-exmp #img-section")
		.toggleClass("normal", !switch_on)
		.toggleClass("zooming", switch_on)
	    

	}

	if(switch_on){
	    //Changes for the panning zoom.

	    var pho_W = parseInt($(".pattern-photo").css("width"));
	    var pho_H = parseInt($(".pattern-photo").css("height"));

	    var win_W = parseInt($("#img-section").css("width"));
	    var win_H = parseInt($("#img-section").css("height"));

	    var pan_box_Left = win_W - pho_W;
	    var pan_box_Top = win_H - pho_H;
	    var pan_box_Width = 2*pho_W - win_W;
	    var pan_box_Height = 2*pho_H - win_H;
	    var img_central_Left = (win_W - pho_W)/2;
	    var img_central_Top = (win_H - pho_H)/2;

	    //handle case of image smaller than view-window. X and Y directions are independant
	    if(pho_W < win_W){
		var pan_box_Left = (win_W - pho_W)/2;
		var pan_box_Width = pho_W;
	    }
	    if(pho_H < win_H){
		var pan_box_Top = (win_H - pho_H)/2;
		var pan_box_Height = pho_H;
	    }

	    $("#panning-img-container")
		.css("left", pan_box_Left)
		.css("top", pan_box_Top)
		.css("width", pan_box_Width)
		.css("height", pan_box_Height)

	    $("#Tab-exmp #img-section img.pattern-photo")
		.draggable({
		    containment: $("#panning-img-container")
		})
		.css("left", img_central_Left)
		.css("top", img_central_Top);

	}else{

	    //Changes to remove the panning zoom.

	    try{// use TRY statement because destroy will throw an error if it is not a dragable anyway
		$("#Tab-exmp #img-section img.pattern-photo")
		    .draggable( "destroy" )
		    .attr("style","");//remove inline styles not removed by the "destroy" method above...
	    }catch(err){
		// nevermind
	    }

	}

    }


};

