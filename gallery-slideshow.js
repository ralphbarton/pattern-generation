var gallery_slideshow = {

    init: function(){

	$("#Tab-exmp #pp-fast .action-link").click(function(){
	    $("#Tab-exmp #pp-fast span").text("*");
	    $("#Tab-exmp #pp-slow span").text("");
	    gallery_slideshow.change_periodicity_slideshow(true);//slow -> fast
	    gallery_slideshow.update_duration_slideshow();
	});

	//almost duplicate of above.
	$("#Tab-exmp #pp-slow .action-link").click(function(){
	    $("#Tab-exmp #pp-fast span").text("");
	    $("#Tab-exmp #pp-slow span").text("*");
	    gallery_slideshow.change_periodicity_slideshow(false);//fast -> slow
	    gallery_slideshow.update_duration_slideshow();
	});

	$("#Tab-exmp #play-pause #pp-icon").click(function(){

	    if($(this).attr("class") == "play"){
		gallery_zoom.set_panning_zoom(false);//unzoom image
		gallery_slideshow.slideshow();
		$("#Tab-exmp #play-pause #pp-icon").removeClass("play").addClass("pause");
	    }else{
		gallery_slideshow.stop_slideshow();
		$("#Tab-exmp #play-pause #pp-icon").removeClass("pause").addClass("play");
	    }

	});
    },


    slideshow_fast: false,
    slideshow_timeout_id: undefined,
    t_fast: 1000,
    t_slow: 3000,
    slideshow: function(S){

	var PATpix_fileslist = gallery_images.dict_fullsize[gallery.current_Details.pattern_id];
	var final_i = PATpix_fileslist.length - 1;
	var slide_counter = S || 0;

	var chain_photo = function (){

	    //show the next photo
	    gallery.show_photo(slide_counter)
	    $(".button.pho").removeClass("selected");
	    $(".button.pho:nth-of-type("+(slide_counter+1)+")").addClass("selected");

	    //check if there's another to show, and if so set a timeout
	    if(slide_counter < final_i){
		slide_counter++;
		gallery_slideshow.slideshow_timeout_id = setTimeout(function(){
		    chain_photo();
		}, gallery_slideshow.slideshow_fast ? gallery_slideshow.t_fast : gallery_slideshow.t_slow);
		gallery_slideshow.timout_sc = slide_counter;
	    }else{
		setTimeout(function(){
		    $("#Tab-exmp #play-pause #pp-icon").removeClass("pause").addClass("play");
		}, 1000);
	    }
	};

	chain_photo();

    },

    stop_slideshow: function(){
	$("#Tab-exmp #play-pause #pp-icon").removeClass("pause").addClass("play");
	clearTimeout(this.slideshow_timeout_id);
	this.slideshow_timeout_id = undefined;
    },

    timout_sc: undefined,
    change_periodicity_slideshow: function(to_fast){
	this.slideshow_fast = to_fast;
	clearTimeout(this.slideshow_timeout_id);
	if(this.slideshow_timeout_id != undefined){
	    gallery_slideshow.slideshow(this.timout_sc - (to_fast?0:1));
	}
	this.slideshow_timeout_id = undefined;
    },

    update_duration_slideshow: function(){
	var N_photo = gallery_images.dict_fullsize[gallery.current_Details.pattern_id].length;
	var t = (this.slideshow_fast ? gallery_slideshow.t_fast : gallery_slideshow.t_slow) * N_photo/1000;
	$("#Tab-exmp #pp-runtime").text(t.toFixed(t<10)+" seconds");
    },

};
