var gallery_images = {

    //long lists are:
    // gallery_files.fullsize_img
    // gallery_files.thumb_img

    path_thumb: "hand-drawing/square-thumb/",
    path_fullsize: "hand-drawing/gallery/",

    dict_thumb: {},
    dict_fullsize: {},


    init: function(){

	/*
	  "139-02a.jpg",
	  "139-02b.jpg",
	*/
	gallery_files.thumb_img.forEach(function(filename) {

	    var img_code = filename.slice(0,6);
	    if(gallery_images.dict_thumb[img_code] == undefined){
		gallery_images.dict_thumb[img_code] = [];
	    }
	    gallery_images.dict_thumb[img_code].push(filename);

	});

	/*
	  "139-01-1600px01.jpg",
	  "139-02-1600px02.jpg",
	*/	
	gallery_files.fullsize_img.forEach(function(filename) {

	    var img_code = filename.slice(0,6);
	    if(gallery_images.dict_fullsize[img_code] == undefined){
		gallery_images.dict_fullsize[img_code] = [];
	    }
	    gallery_images.dict_fullsize[img_code].push(filename);

	});

    }

};
