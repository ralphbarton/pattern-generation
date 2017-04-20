var gallery = {


    init: function(){

	//Put all the image file names into appropriate data structures.
	gallery_images.init();

	//attach appropriate listeners to various UI componenents relating to the slideshow
	gallery_slideshow.init();

	//for mouse-over effect showing magnify tool on image...
	gallery_zoom.init();


	this.set_random_thumbnails();


	//put thumbnails into list...
	$.each( gallery_images.dict_thumb, function(key, filelist) {
	    var file_index = Math.floor( Math.random() * filelist.length );
	    for (var i = 0; i < filelist.length; i++){
		if(filelist[i].includes("Primary")){
		    file_index = i;
		    break;
		}
	    }

	    $("#listing-bar").append(
		$("<div/>")
		    .addClass("drawn-thumb")
		    .addClass("list")
		    .append(
			$("<div/>").text(key),
			$("<img/>").attr("src", gallery_images.path_thumb + filelist[file_index])
		    )
		    .data({pattern_id: key})
		    .click(function(){

			// render pattern
			var pattern_id = $(this).data("pattern_id")
			gallery.show_pattern(pattern_id);


		    })
	    );
	});

	//bind functionality to elements (buttons & links) in (initialially hidden) Gallery...
	$("#Tab-exmp #close-gallery").click(function(){
	    gallery.hide_gallery();
	});

    },

    set_random_thumbnails: function(){

	// 1. put list of thumbnails into a random order
	var rand_ordering = [];
	$.each( gallery_images.dict_thumb, function(key, value) {
	    rand_ordering.push({
		pattern_id: key,
		files_list: value,
		seq_rand: Math.random()
	    });
	});

	function compare(a,b) {
	    if (a.seq_rand < b.seq_rand)
		return -1;
	    if (a.seq_rand > b.seq_rand)
		return 1;
	    return 0;
	};

	rand_ordering.sort(compare);

	// 2. populate 3 DIV's using the first 3 in the list
	var t_counter = 0;
	$.each( $("#Tab-exmp div#thumb-container > div.drawn-thumb"), function(key, DOM_myDiv) {

	    // 2.1 for the thumbnail set of a specific pattern, randomly choose the actual thumbnail to display.
	    var this_thumb = rand_ordering[t_counter];
	    t_counter++;
	    var rand_i = Math.floor( Math.random() * this_thumb.files_list.length );

	    // 2.2 change contents of DOM...
	    $(DOM_myDiv)
		.html("")
		.append(
		    $("<div/>").text(this_thumb.pattern_id),
		    $("<img/>").attr("src", gallery_images.path_thumb + this_thumb.files_list[rand_i])
		).click(function(){
		    gallery.show_gallery(this_thumb.pattern_id);
		});
	});

    },

    show_gallery: function(pattern_id){

	$(".cpanel#main").removeClass("cpanel-main-size1").addClass("cpanel-main-size3");

	//sets the global this.wcx.canvas_ctx
	var newLeft = ($(window).width() - 1000)/2;
	var newTop = ($(window).height() - 750)/2;

	$(".cpanel#main").animate({
	    left: newLeft,
	    top: newTop
	}, 700);

	$("#Tab-exmp #thumbs-view").hide();
	$("#Tab-exmp #gallery-view").show();
	$("#cpanel-main-tabs").tabs("option", "disabled", true);

	this.show_pattern(pattern_id);

    },
	    
    hide_gallery: function(){

	$("#Tab-exmp #gallery-view").hide();
	$("#Tab-exmp #thumbs-view").show();
	$(".cpanel#main").removeClass("cpanel-main-size3").addClass("cpanel-main-size1");
	$("#cpanel-main-tabs").tabs("option", "disabled", false);

    },

    current_Details: undefined,
    show_pattern: function(pattern_id){

	//cancel any ongoing slideshow if moving between patterns...
	gallery_zoom.set_panning_zoom(false);//unzoom image
	gallery_slideshow.stop_slideshow();


	//get the obj for Textual details...
	var Arr = hand_descriptions.text_obj;
	var TextDetails = undefined;
	for (var i = 0; i < Arr.length; i++){
	    if(Arr[i].pattern_id == pattern_id){
		TextDetails = Arr[i];
		this.current_Details = Arr[i];
		break;
	    }
	}

	//MUST be called after update of "current_Details"
	// this function only updates the HTML to show the correct value in text
	gallery_slideshow.update_duration_slideshow();

	$("#Tab-exmp #heading span.value").text(pattern_id);

	$("#Tab-exmp #date span.value").text(TextDetails["completion_date"]);
	$("#Tab-exmp #materials span.value").text(TextDetails["materials_used"]);
	$("#Tab-exmp #description span.value").html(TextDetails["description"]);//may contain <br>
	$("#Tab-exmp #dimentions span.value").text(TextDetails["dimentions"]);


	this.show_photo();
	this.remove_last_photo(0, 200);

	var PATpix_fileslist = gallery_images.dict_fullsize[pattern_id];

	// create the list of photo links...
	var final_i = PATpix_fileslist.length - 1;

	var links_html = [];
	if(final_i > 0){
	    links_html.push("Progress photos : ");
	    var x = PATpix_fileslist.map(function(filename, i){
		links_html.push(
		    $("<div/>")
			.text(i==final_i ? "final" : i+1)
			.addClass("button pho")
			.toggleClass("fin", i==final_i)// different css padding needed for word 'final'...
			.toggleClass("selected", i==final_i)
			.click(function(){
			    //cancel any ongoing slideshow if user selects photo
			    gallery_zoom.set_panning_zoom(false);//unzoom image
			    gallery_slideshow.stop_slideshow();

			    $(".button.pho").removeClass("selected");
			    $(this).addClass("selected");
			    gallery.show_photo(i);
			})
		);
	    });
	}else{
	    links_html.push(
		$("<div/>")
		    .addClass("single-photo-text")
		    .text("Final photo shown below.")
	    );
	}

	$("#Tab-exmp #links span.value")
	    .html("")
	    .append(links_html);

    },


    photo_show_cnt: 0,
    remove_last_photo: function(delay, duration){

	var cnt = this.photo_show_cnt-1;

	//fade it out
	setTimeout(function(){
	    $("#img-" + cnt).fadeOut({duration: duration, easing: "linear"});
	}, delay);

	//remove element
	if(cnt > 0){
	    setTimeout(function(){
		$("#img-" + cnt).remove();
	    }, delay + duration + 1);//timeout ordering not guarenteed hence 1 extra ms...
	}

    },


    show_photo: function(photo_id){

	var PATpix_fileslist = gallery_images.dict_fullsize[this.current_Details.pattern_id];

	if(photo_id === undefined){
	    photo_id = PATpix_fileslist.length - 1;
	}

	var photo_file = PATpix_fileslist[photo_id];

	//add the new IMG
	this.photo_show_cnt++;
	$("#img-section")
	    .append(
		$("<img/>")
		    .addClass("pattern-photo")
		    .attr("src", gallery_images.path_fullsize + photo_file)
		    .attr("id", "img-" + this.photo_show_cnt)
		    .hide()
		    .fadeIn({duration: 600, easing: "linear"})
	    );

	this.remove_last_photo(600, 0);

	//if undefined, use an empty string.
	var comment = this.current_Details.img_comments[photo_file] || "";

	$("#Tab-exmp #bottom-section").text(comment);

    }

};
