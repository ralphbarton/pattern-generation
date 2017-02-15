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

	
	//bind functionality to elements in (initialially hidden) Gallery...
	$("#tabs-8 #close-gallery").click(function(){
	    hand.hide_gallery();
	});


	//put thumbnails into list...
	$.each( this.dict_thumb, function(key, filelist) {
	    var rand_i = Math.floor( Math.random() * filelist.length );
	    $("#listing-bar").append(
		$("<div/>")
		    .addClass("drawn-thumb")
		    .addClass("list")
		    .append(
			$("<div/>").text(key),
			$("<img/>").attr("src", "hand-drawing/square-thumb/" + filelist[rand_i])
		    )
		    .data({pattern_id: key})
		    .click(function(){

			//this function places an image inside the image container DIV
			var pID = $(this).data("pattern_id")
			
			var fileslist = hand.dict_fullsize[pID];

			$("#img-container")
			    .html("")
			    .append(
			    $("<img/>").attr("src", "hand-drawing/gallery/" + fileslist[0])
			);

			//get the correct details obj;
			var Arr = hand_descriptions.text_obj;
			var TextDetails = undefined;
			for (var i = 0; i < Arr.length; i++){
			    if(Arr[i].pattern_id == pID){
				TextDetails = Arr[i];
				break;
			    }
			}
			$("#tabs-8 #heading span.value").text(pID);

			$("#tabs-8 #date span.value").text(TextDetails["completion_date"]);
			$("#tabs-8 #materials span.value").text(TextDetails["materials_used"]);
			$("#tabs-8 #links span.value").text("Progress photos: [1 | 2 | 3 | 4]. Final Photo");
			$("#tabs-8 #description span.value").text(TextDetails["description"]);
			$("#tabs-8 #dimentions span.value").text(TextDetails["dimentions"]);

			/*
			  use this data:

			  "img_comments": {
			  "139-01-1600px01.jpg": "I ought to retake this photo using a flatbed scanner instead of my phone camera."
			  }
			*/


		    })
	    );
	});




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

	$("#tabs-8 #heading span.value").text(pattern_id);

    },
	    
    hide_gallery: function(){

	$("#tabs-8 #gallery-view").hide();
	$("#tabs-8 #thumbs-view").show();
	$(".cpanel#main").removeClass("cpanel-main-size3").addClass("cpanel-main-size1");
	$("#cpanel-main-tabs").tabs("option", "disabled", false);

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
	"139-02a.jpg",
	"139-02b.jpg",
	"139-02c.jpg",
	"139-02d.jpg",
	"139-03.png",
	"139-03b.png",
	"139-03c.png",
	"139-04a.png",
	"139-04b.png",
	"139-04c.png",
	"139-04d.png",
	"139-04e.png",
	"139-04f.png",
	"139-04g.png",
	"146-01a.png",
	"146-01b.jpg",
	"146-01c.jpg",
	"146-01d.jpg",
	"146-02a.jpg",
	"146-02b.jpg",
	"146-02c.jpg",
	"146-02d.jpg",
	"146-02e.jpg",
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
	"152-02a.jpg",
	"152-02b.jpg",
	"152-02c.jpg",
	"152-02d.jpg",
	"152-02e.jpg",
	"152-02f.jpg",
	"153-01a.jpg",
	"153-01b.jpg",
	"153-01c.jpg",
	"153-01d.jpg"
    ]

};
