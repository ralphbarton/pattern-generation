var plots = {

    do: function(){

	var winW = $(window).width();
	var winH = $(window).height();


	//get or create new canvas for the plot...
	if($("#plot-canv").length > 0){
	    var ctx = $("#plot-canv")[0].getContext('2d');
	}else{
	    var $pc = $('<canvas/>')
		.attr("width", winW)
		.attr("height", winH)
		.attr("id", "plot-canv");
	    $("#backgrounds").append($pc);
	    var ctx = $pc[0].getContext('2d');
	}

	var BOX = 5; // how many pixels per box

	var sf = 2 / winW; //how many units per 1 pixel
	var x_or = winH / 2;
	var y_or = winW / 2;

	var compilled_formula = math.compile("z^7");


	for(var x=0; x < winW; x += BOX){	
	    for(var y=0; y < winH; y += BOX){	

		var Xm = (x - x_or) * sf;
		var Ym = (y - y_or) * sf;
		//console.log(Xm,Ym);

		var my_z = math.complex(Xm, Ym)
		var my_h = compilled_formula.eval({z: my_z});
		//draw that pixel

//		console.log(my_h);
		var hue = (my_h.im) / 1.2;
		

		var color = tinycolor.fromRatio({ h: hue, s: 1, l: 0.5 });

		ctx.fillStyle = "#" + color.toHex();
		ctx.fillRect (x, y, BOX, BOX);//x,y,w,h


	    }
	}

	console.log("complete");

    }

};
