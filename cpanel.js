cpanel = {

    init_cpanel: function(){
	
	// 1. main the main DIV draggable...
	$("#cpanel-main").draggable();

	// 2. add functionality to the "hide" badge"s.c
	$("#cpanel-title-hide").click(function(){
	    
	    //animate Object then hide
	    $("#cpanel-main").animate({
		opacity:0
	    },{
		duration: 1000,
		easing: "linear",
		complete: function(){
		    $("#cpanel-main").hide();
		}
	    });
	});

	//add keystroke handling
	document.addEventListener("keydown",function(e){
	    var myKeycode = e.keyCode;
	    var keyPressed = String.fromCharCode(myKeycode);//note that this is non-case sensitive.

	    if (keyPressed == 'H'){
		//animate Object then hide
		$("#cpanel-main").show().animate({
		    opacity:1
		},{
		    duration: 500,
		    easing: "linear"
		});
	    }


	}, false);

	//initiate tabs...
	$("#cpanel-main-tabs").tabs();


    }



}



// executive code...
$(document).ready(function() {
    cpanel.init_cpanel();
});


