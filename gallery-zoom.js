var gallery_zoom = {

    magnif_timeout_id: undefined,
    init: function(){

	var t_ani = 400;
	var t_brief = 1000;
	var t_long = 10000;

	var set_magnif_show_time = function(t_showfor){

	    clearTimeout(gallery_zoom.magnif_timeout_id);

	    gallery_zoom.magnif_timeout_id = setTimeout(function(){
		$("#magnify-popup").animate({opacity: 0}, t_ani);
		gallery_zoom.magnif_timeout_id = undefined;
	    }, t_showfor);
	};


	// respond to clicking within the image space...
	$("#tabs-8 #img-section").on("click", function(){
	    if(gallery_zoom.magnif_timeout_id == undefined){
		console.log("img click");
		$("#magnify-popup").animate({opacity: 0.9}, t_ani);
		set_magnif_show_time(t_brief);//disappear soon (1 second)
	    }else{
		console.log("img click (ignored)");
	    }
	});

	//respond to clicking a magnifier button
	$("#magnify-popup .buttons > div").on("click", function(){
	    set_magnif_show_time(t_long);//disappear after longer time (10 second)
	});

	//respond to clicking a magnifier button
	$("#magnify-popup .close").on("click", function(){
	    $("#magnify-popup").animate({opacity: 0}, t_ani);
	    gallery_zoom.magnif_timeout_id = "holdoff";//prevent this click from causing it to show again
	    set_magnif_show_time(t_brief);//this will re-enable the click functionality in 1 second.
	});



	var opac_med = 0.6;
	var opac_low = 0.85;

	var mouseenter_counter = 0;
	$("#tabs-8 #img-section").on("mouseenter", function(){
	    if(mouseenter_counter > 0){
		$("img#magnify-icon").animate({opacity: opac_med}, 200);
		setTimeout(function(){
		    $("img#magnify-icon").animate({opacity: 0}, 1000);
		}, 3200);
	    }
	    mouseenter_counter++;
	});

	//do it here rather than using css :hover (which conficts with js-managed styling responsiveness)
	$("#tabs-8 img#magnify-icon").on("mouseenter", function(){
	    $("img#magnify-icon").animate({opacity: opac_low}, 200);
	});

	$("#tabs-8 img#magnify-icon").on("mouseleave", function(){
	    $("img#magnify-icon").animate({opacity: opac_med}, 200);
	    setTimeout(function(){
		$("img#magnify-icon").animate({opacity: 0}, 1000);
	    }, 3200);
	});



	$("#tabs-8 img#magnify-icon").on("click", function(){
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

	    $("#tabs-8 #img-section")
		.toggleClass("normal")
		.toggleClass("zooming")
	    switch_on = $("#tabs-8 #img-section").hasClass("zooming");
	}else{

	    $("#tabs-8 #img-section")
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

	    $("#tabs-8 #img-section img.pattern-photo")
		.draggable({
		    containment: $("#panning-img-container")
		})
		.css("left", img_central_Left)
		.css("top", img_central_Top);

	}else{

	    //Changes to remove the panning zoom.

	    try{// use TRY statement because destroy will throw an error if it is not a dragable anyway
		$("#tabs-8 #img-section img.pattern-photo")
		    .draggable( "destroy" )
		    .attr("style","");//remove inline styles not removed by the "destroy" method above...
	    }catch(err){
		// nevermind
	    }

	}

    }


};

