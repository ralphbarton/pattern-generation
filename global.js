var global = {

    keys: {
	CTRL: false,
	SHIFT: false
    },

    toolbox_visible: true,
    
    init: function(){
	// 1. main the main DIV draggable...
	$(".cpanel#main").draggable({cancel: "div#cpanel-main-body"});

	// 2. initiate tabs...
	$("#cpanel-main-tabs").tabs()
	
	
	// 3. add functionality to the "hide" badge
	$("#cpanel-title-hide").click(function(){
	    $(".cpanel#main").fadeOut({duration: 1000, easing: "linear"});
	    global.toolbox_visible = false;

	});

	// 4. Global keystroke handling: key down
	document.addEventListener("keydown",function(e){
	    var myKeycode = e.keyCode;
	    var keyPressed = String.fromCharCode(myKeycode);//note that this is non-case sensitive.

	    /* my key assignments
	       A - add row
	       B
	       C
	       D
	       E
	       F
	       G
	       H - restore box
	       I
	       J
	       K
	       L
	       M
	       N
	       O
	       P
	    */

	    if (keyPressed == 'H'){
		// the 'H' key can only UNHIDE....
		$(".cpanel#main").fadeIn({duration: 400, easing: "linear"});
		global.toolbox_visible = true;
		
	    }
	    if (keyPressed == 'A'){
		//Action for 'A' pressed
	    }


	    if(myKeycode == 16){//shift key
		global.keys.SHIFT = true;
	    }

	    if(myKeycode == 17){//control key
		global.keys.CTRL = true;
	    }

	    

	    if(motifs_edit.active){
		// Arrow keys and delete keys must be passed...
		motifs_edit.keyStrokeHandler(myKeycode, keyPressed, "keydown");

	    }

	}, false);


	// 5. Global keystroke handling: key up
	document.addEventListener("keyup",function(e){
	    var myKeycode = e.keyCode;
	    var keyPressed = String.fromCharCode(myKeycode);//note that this is non-case sensitive.

	    if(myKeycode == 16){//shift key
		global.keys.SHIFT = false;
	    }

	    if(myKeycode == 17){//control key
		global.keys.CTRL = false;
	    }

	    if(motifs_edit.active){
		// Arrow keys and delete keys must be passed...
		motifs_edit.keyStrokeHandler(myKeycode, keyPressed, "keyup");

	    }
	    
	}, false);

	
	// 6. click upon anywhere
	$(document).click(function(){
	    if(global.toolbox_visible == false){
		global.toast("Press the 'H' key to unhide the toolbox");
	    }
	});

    },

    
    toast: function(text){

	$("#toast-box")
	    .text(text)
	    .fadeIn({duration:200, easing: "linear"});

	
	setTimeout(function(){
	    $("#toast-box")
	    	.fadeOut({duration:200, easing: "linear"});
	}, 1000);
	
    },

    
    $div_array: function(qty, my_class, ColourPot){//function to generate many mini DIVs
	var tinies = [];
	for(var i=0; i<qty; i++){
	    var cell_colour = ColourPot ? cpot_util.DrawFromColourPot(ColourPot) : "white";
	    tinies.push(
		$('<div/>').addClass(my_class).css("background",cell_colour)
	    );
	}
	return tinies;
    }

};


// executive code...
$(document).ready(function() {
    global.init();

    cpot_view.init();
    grids.init();

    plots.init();

    export_pat.init();

    gallery.init();

    motifs_view.init();
    motifs_edit_init.init();

    //code to auto enter CP edit and speed up testing...



    //go straight to CP edit
    $("#view-cp-table tbody tr").first().click();
    $("#cp-view-table-buttons #edit").click();
    /*

    //go straight to Grids ( = 3rd tab...)
    $("#cpanel-main-tabs > ul > li:nth-of-type(3) a").click();


    //go straight to Grids ( = 4rd tab...)
    $("#cpanel-main-tabs > ul > li:nth-of-type(8) a").click();


    //go straight to Motifs ( = 6th tab...)
    $("#cpanel-main-tabs > ul > li:nth-of-type(3) a").click();
    // --> and into Motif EDIT
    $("#motifs-view .table-buttons #edit").click();
*/

});

