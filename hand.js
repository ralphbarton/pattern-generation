var hand = {

    //long lists are:
    // this.fullsize_img
    // this.thumb_img
    dict_thumb: {},
    dict_fullsize: {},

    init: function(){

	/*
	  "139-02a.jpg",
	  "139-02b.jpg",
	*/
	this.thumb_img.forEach(function(filename) {

	    var img_code = filename.slice(0,6);
	    if(hand.dict_thumb[img_code] == undefined){
		hand.dict_thumb[img_code] = [];
	    }
	    hand.dict_thumb[img_code].push(filename);

	});

	/*
	  "139-01-1600px01.jpg",
	  "139-02-1600px02.jpg",
	*/	
	this.fullsize_img.forEach(function(filename) {

	    var img_code = filename.slice(0,6);
	    if(hand.dict_fullsize[img_code] == undefined){
		hand.dict_fullsize[img_code] = [];
	    }
	    hand.dict_fullsize[img_code].push(filename);

	});

	this.set_random_thumbnails();


	//put thumbnails into list...
	$.each( this.dict_thumb, function(key, filelist) {
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
			$("<img/>").attr("src", "hand-drawing/square-thumb/" + filelist[file_index])
		    )
		    .data({pattern_id: key})
		    .click(function(){

			// render pattern
			var pattern_id = $(this).data("pattern_id")
			hand.show_pattern(pattern_id);


		    })
	    );
	});

	//bind functionality to elements (buttons & links) in (initialially hidden) Gallery...
	$("#tabs-8 #close-gallery").click(function(){
	    hand.hide_gallery();
	});


	$("#tabs-8 #pp-fast .action-link").click(function(){
	    $("#tabs-8 #pp-fast span").text("*");
	    $("#tabs-8 #pp-slow span").text("");
	    hand.change_periodicity_slideshow(true);//slow -> fast
	    hand.update_duration_slideshow();
	});

	//almost duplicate of above.
	$("#tabs-8 #pp-slow .action-link").click(function(){
	    $("#tabs-8 #pp-fast span").text("");
	    $("#tabs-8 #pp-slow span").text("*");
	    hand.change_periodicity_slideshow(false);//fast -> slow
	    hand.update_duration_slideshow();
	});

	$("#tabs-8 #play-pause #pp-icon").click(function(){

	    if($(this).attr("class") == "play"){
		hand.slideshow();
		$("#tabs-8 #play-pause #pp-icon").removeClass("play").addClass("pause");
	    }else{
		hand.stop_slideshow();
		$("#tabs-8 #play-pause #pp-icon").removeClass("pause").addClass("play");
	    }

	});

    },

    slideshow_fast: false,
    slideshow_timeout_id: undefined,
    t_fast: 1000,
    t_slow: 3000,
    slideshow: function(S){

	var PATpix_fileslist = hand.dict_fullsize[this.current_Details.pattern_id];
	var final_i = PATpix_fileslist.length - 1;
	var slide_counter = S || 0;

	var chain_photo = function (){

	    //show the next photo
	    hand.show_photo(slide_counter)
	    $(".button.pho").removeClass("selected");
	    $(".button.pho:nth-of-type("+(slide_counter+1)+")").addClass("selected");

	    //check if there's another to show, and if so set a timeout
	    if(slide_counter < final_i){
		slide_counter++;
		hand.slideshow_timeout_id = setTimeout(function(){
		    chain_photo();
		}, hand.slideshow_fast ? hand.t_fast : hand.t_slow);
		hand.timout_sc = slide_counter;
	    }else{
		setTimeout(function(){
		    $("#tabs-8 #play-pause #pp-icon").removeClass("pause").addClass("play");
		}, 1000);
	    }
	};

	chain_photo();

    },

    stop_slideshow: function(){
	$("#tabs-8 #play-pause #pp-icon").removeClass("pause").addClass("play");
	clearTimeout(this.slideshow_timeout_id);
	this.slideshow_timeout_id = undefined;
    },

    timout_sc: undefined,
    change_periodicity_slideshow: function(to_fast){
	this.slideshow_fast = to_fast;
	clearTimeout(this.slideshow_timeout_id);
	if(this.slideshow_timeout_id != undefined){
	    hand.slideshow(this.timout_sc - (to_fast?0:1));
	}
	this.slideshow_timeout_id = undefined;
    },

    update_duration_slideshow: function(){
	var N_photo = hand.dict_fullsize[hand.current_Details.pattern_id].length;
	var t = (this.slideshow_fast ? hand.t_fast : hand.t_slow) * N_photo/1000;
	$("#tabs-8 #pp-runtime").text(t.toFixed(t<10)+" seconds");
    },

    set_random_thumbnails: function(){

	// 1. put list of thumbnails into a random order
	var rand_ordering = [];
	$.each( this.dict_thumb, function(key, value) {
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
	$.each( $("#tabs-8 div#thumb-container > div.drawn-thumb"), function(key, DOM_myDiv) {

	    // 2.1 for the thumbnail set of a specific pattern, randomly choose the actual thumbnail to display.
	    var this_thumb = rand_ordering[t_counter];
	    t_counter++;
	    var rand_i = Math.floor( Math.random() * this_thumb.files_list.length );

	    // 2.2 change contents of DOM...
	    $(DOM_myDiv)
		.html("")
		.append(
		    $("<div/>").text(this_thumb.pattern_id),
		    $("<img/>").attr("src", "hand-drawing/square-thumb/" + this_thumb.files_list[rand_i])
		).click(function(){
		    hand.show_gallery(this_thumb.pattern_id);
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

	$("#tabs-8 #thumbs-view").hide();
	$("#tabs-8 #gallery-view").show();
	$("#cpanel-main-tabs").tabs("option", "disabled", true);

	this.show_pattern(pattern_id);

    },
	    
    hide_gallery: function(){

	$("#tabs-8 #gallery-view").hide();
	$("#tabs-8 #thumbs-view").show();
	$(".cpanel#main").removeClass("cpanel-main-size3").addClass("cpanel-main-size1");
	$("#cpanel-main-tabs").tabs("option", "disabled", false);

    },

    current_Details: undefined,
    show_pattern: function(pattern_id){

	//cancel any ongoing slideshow if moving between patterns...
	this.stop_slideshow();

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
	this.update_duration_slideshow();

	$("#tabs-8 #heading span.value").text(pattern_id);

	$("#tabs-8 #date span.value").text(TextDetails["completion_date"]);
	$("#tabs-8 #materials span.value").text(TextDetails["materials_used"]);
	$("#tabs-8 #description span.value").html(TextDetails["description"]);//may contain <br>
	$("#tabs-8 #dimentions span.value").text(TextDetails["dimentions"]);


	this.show_photo();
	this.remove_last_photo(0, 200);

	var PATpix_fileslist = hand.dict_fullsize[pattern_id];

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
			    hand.stop_slideshow();

			    $(".button.pho").removeClass("selected");
			    $(this).addClass("selected");
			    hand.show_photo(i);
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

	$("#tabs-8 #links span.value")
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

	var PATpix_fileslist = hand.dict_fullsize[this.current_Details.pattern_id];

	if(photo_id === undefined){
	    photo_id = PATpix_fileslist.length - 1;
	}

	var photo_file = PATpix_fileslist[photo_id];

	//add the new IMG
	this.photo_show_cnt++;
	$("#img-section")
	    .append(
		$("<div/>").addClass("img-white-box").append(
		    $("<div/>").addClass("img-container").append(
			$("<img/>")
			    .attr("src", "hand-drawing/gallery/" + photo_file)
		    )
		)
		    .attr("id", "img-" + this.photo_show_cnt)
		    .hide()
		    .fadeIn({duration: 600, easing: "linear"})
	    );

	this.remove_last_photo(600, 0);

	//if undefined, use an empty string.
	var comment = this.current_Details.img_comments[photo_file] || "";

	$("#tabs-8 #bottom-section").text(comment);

    },


    fullsize_img: [
	"139-01-1600px01.jpg",
	"139-02-1600px02.jpg",
	"139-03-1600px01.jpg",
	"139-03-1600px03.jpg",
	"139-03-1600px05.jpg",
	"139-03-1600px06.jpg",
	"139-03-1600px07.jpg",
	"139-03-1600px10.jpg",
	"139-03-1600px11.jpg",
	"139-03-1600px13.jpg",
	"139-03-1600px17.jpg",
	"139-03-1600px21.jpg",
	"139-03-1600px24.jpg",
	"139-03-1600px25.jpg",
	"139-03-1600px27.jpg",
	"139-03-1600px28.jpg",
	"139-04-1600px02.jpg",
	"139-04-1600px04.jpg",
	"139-04-1600px06.jpg",
	"139-04-1600px07.jpg",
	"139-04-1600px10.jpg",
	"146-01-1600px01.jpg",
	"146-01-1600px03.jpg",
	"146-02-1600px01.jpg",
	"146-02-1600px02.jpg",
	"146-03-1600px01.jpg",
	"146-03-1600px02.jpg",
	"146-03-1600px03.jpg",
	"146-03-1600px04.jpg",
	"146-03-1600px05.jpg",
	"146-04-1600px01.jpg",
	"146-04-1600px02.jpg",
	"146-04-1600px03.jpg",
	"146-04-1600px05.jpg",
	"146-04-1600px06.jpg",
	"146-04-1600px07.jpg",
	"146-04-1600px08.jpg",
	"146-04-1600px09.jpg",
	"146-04-1600px10.jpg",
	"146-04-1600px12.jpg",
	"146-04-1600px13.jpg",
	"152-01-1600px01.jpg",
	"152-01-1600px02.jpg",
	"152-01-1600px03.jpg",
	"152-01-1600px04.jpg",
	"152-01-1600px05.jpg",
	"152-01-1600px06.jpg",
	"152-01-1600px07.jpg",
	"152-01-1600px08.jpg",
	"152-01-1600px09.jpg",
	"152-01-1600px10.jpg",
	"152-02-1600px01.jpg",
	"152-02-1600px02.jpg",
	"152-02-1600px04.jpg",
	"152-02-1600px05.jpg",
	"152-02-1600px06.jpg",
	"152-02-1600px08.jpg",
	"152-02-1600px10.jpg",
	"152-02-1600px11.jpg",
	"152-03-1600px01.jpg",
	"152-03-1600px04.jpg",
	"153-01-1600px02.jpg",
	"153-01-1600px04.jpg",
	"153-01-1600px05.jpg",
	"153-01-1600px07.jpg",
	"153-02-1600px01.jpg",
	"153-02-1600px02.jpg",
	"153-02-1600px03.jpg",
	"153-02-1600px04.jpg",
	"153-03-1600px01.jpg",
	"153-03-1600px02.jpg",
	"153-03-1600px06.jpg",
	"153-04-1600px01.jpg",
	"153-04-1600px02.jpg",
	"153-04-1600px03.jpg",
	"153-04-1600px05.jpg",
	"153-04-1600px06.jpg",
	"153-04-1600px07.jpg",
	"153-04-1600px08.jpg",
	"153-04-1600px09.jpg",
	"153-04-1600px10.jpg",
	"153-04-1600px12.jpg",
	"153-04-1600px14.jpg",
	"153-04-1600px15.jpg",
	"153-04-1600px18.jpg",
	"153-04-1600px19.jpg"
    ],

    thumb_img: [
	"139-01-thumb-A.jpg",
	"139-01-thumb-B.jpg",
	"139-01-thumb.Primary.jpg",
	"139-02-thumb-A.jpg",
	"139-02-thumb-B.jpg",
	"139-02-thumb-C.jpg",
	"139-02-thumb.Primary.jpg",
	"139-03-thumb-A.png",
	"139-03-thumb-B.png",
	"139-03-thumb-C.jpg",
	"139-03-thumb-D.jpg",
	"139-03-thumb-E.jpg",
	"139-03-thumb-F.jpg",
	"139-03-thumb-G.jpg",
	"139-03-thumb-H.png",
	"139-03-thumb-I.jpg",
	"139-03-thumb-J.jpg",
	"139-03-thumb.Primary.jpg",
	"139-04-thumb-A.png",
	"139-04-thumb-B.jpg",
	"139-04-thumb-C.jpg",
	"139-04-thumb-D.png",
	"139-04-thumb-E.jpg",
	"139-04-thumb-F.png",
	"139-04-thumb-G.jpg",
	"139-04-thumb-H.png",
	"139-04-thumb-I.png",
	"139-04-thumb-J.jpg",
	"139-04-thumb-K.jpg",
	"139-04-thumb-L.jpg",
	"139-04-thumb-M.png",
	"139-04-thumb.Primary.jpg",
	"146-01-thumb-A.png",
	"146-01-thumb-B.jpg",
	"146-01-thumb-C.jpg",
	"146-01-thumb.Primary.jpg",
	"146-02-thumb-A.jpg",
	"146-02-thumb-B.jpg",
	"146-02-thumb-C.jpg",
	"146-02-thumb-D.jpg",
	"146-02-thumb.Primary.jpg",
	"146-03a.jpg",
	"146-03b.jpg",
	"146-03c.jpg",
	"146-03d.jpg",
	"146-03e.jpg",
	"146-03f.jpg",
	"146-04a.jpg",
	"146-04b.jpg",
	"146-04c.jpg",
	"146-04d.jpg",
	"146-04e.jpg",
	"146-04f.jpg",
	"146-04g.jpg",
	"152-01-thumb-A.jpg",
	"152-01-thumb-B.jpg",
	"152-01-thumb-C.jpg",
	"152-01-thumb-D.jpg",
	"152-01-thumb-E.jpg",
	"152-01-thumb-F.jpg",
	"152-01-thumb-G.jpg",
	"152-01-thumb-H.jpg",
	"152-01-thumb-I.jpg",
	"152-01-thumb-J.jpg",
	"152-01-thumb-K.jpg",
	"152-01-thumb-L.jpg",
	"152-01-thumb-M.jpg",
	"152-01-thumb-N.jpg",
	"152-01-thumb-O.jpg",
	"152-01-thumb-P.jpg",
	"152-01-thumb-Q.jpg",
	"152-01-thumb-R.jpg",
	"152-01-thumb-S.jpg",
	"152-01-thumb.Primary.jpg",
	"152-02a.jpg",
	"152-02b.jpg",
	"152-02c.jpg",
	"152-02d.jpg",
	"152-02e.jpg",
	"152-02f.jpg",
	"152-03-thumb-A.jpg",
	"152-03-thumb-B.jpg",
	"152-03-thumb-C.jpg",
	"152-03-thumb-D.jpg",
	"152-03-thumb-E.jpg",
	"152-03-thumb-F.jpg",
	"152-03-thumb-G.jpg",
	"152-03-thumb-H.jpg",
	"152-03-thumb.Primary.jpg",
	"153-01a.jpg",
	"153-01b.jpg",
	"153-01c.jpg",
	"153-01d.jpg",
	"153-02-thumb-A.jpg",
	"153-02-thumb-B.jpg",
	"153-02-thumb-C.jpg",
	"153-02-thumb-D.jpg",
	"153-02-thumb-E.jpg",
	"153-02-thumb-F.jpg",
	"153-02-thumb-G.jpg",
	"153-02-thumb-H.jpg",
	"153-02-thumb.Primary.jpg",
	"153-03-thumb-A.jpg",
	"153-03-thumb-B.jpg",
	"153-03-thumb-C.jpg",
	"153-03-thumb-D.jpg",
	"153-03-thumb-E.jpg",
	"153-03-thumb-F.jpg",
	"153-03-thumb-G.jpg",
	"153-03-thumb-H.jpg",
	"153-03-thumb.Primary.jpg",
	"153-04-thumb-A.jpg",
	"153-04-thumb-B.jpg",
	"153-04-thumb-C.jpg",
	"153-04-thumb-D.jpg",
	"153-04-thumb-E.jpg",
	"153-04-thumb-F.jpg",
	"153-04-thumb-G.jpg",
	"153-04-thumb-H.jpg",
	"153-04-thumb-I.jpg",
	"153-04-thumb-J.jpg",
	"153-04-thumb-K.jpg",
	"153-04-thumb-L.jpg",
	"153-04-thumb-M.jpg",
	"153-04-thumb.Primary.jpg"
    ]

};
