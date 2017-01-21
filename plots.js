var plots = {

    eq1: {
	func:"z^7",
	cell_px: 5,
    },

    eq2: {
	func:"i*exp(3*z^3)*(z+1.2)^3",
	cell_px: 3,
    },

    init: function(){

	

	$("#tabs-4 input#equation").SmartInput({
	    underlying_obj: this.eq2,
	    underlying_key: "func",
	    style_class: "plain-cell",
	    data_class: "text",
	    underlying_from_DOM_onChange: true,
//	    cb_change: 
	});


	$("#tabs-4 input#cell-px").SmartInput({
	    underlying_obj: this.eq2,
	    underlying_key: "cell_px",
	    style_class: "plain-cell",
	    data_class: "pixels",
	});


	$("#tabs-4 #exec-plot").click(function(){
	    plots.exec();
	});

    },

    exec: function(){

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

	var BOX = this.eq2.cell_px; // how many pixels per box

	var sf = 2 / winW; //how many units per 1 pixel
	var x_or = winH / 2;
	var y_or = winW / 2;

	var compilled_formula = math.compile(this.eq2.func);

	// 1. Calculating the underlying data
	var starting = new Date();//record start time
	var Curve = [];
	var G_max = null;
	var G_min = null;
	var count = 0;
	for(var x=0; x < winW; x += BOX){	
	    Curve[x] = [];
	    for(var y=0; y < winH; y += BOX){	

		var Xm = (x - x_or) * sf;
		var Ym = (y - y_or) * sf;
		//console.log(Xm,Ym);

		var my_z = math.complex(Xm, Ym)
		var my_fz = compilled_formula.eval({z: my_z});
		var my_h = my_fz.im;

		//store that pixel!
		Curve[x][y] = my_h;
		
		count++;
		G_max = Math.max(G_max, my_h);
		G_min = Math.min(G_min, my_h);

	    }
	}
	console.log("Data creation took (ms) : ", new Date()-starting);
	console.log("min:", G_min, "max:", G_max, "count:", count);

	// 2. convert to pixel colours
	starting = new Date();//record start time
	var Curve_cols = [];
	
	var UU = 2;
	var LL = -2;

	for(var x=0; x < winW; x += BOX){	
	    Curve_cols[x] = [];
	    for(var y=0; y < winH; y += BOX){	
		var my_h = Curve[x][y];

		//draw that pixel
		var hue = (my_h - LL) / (UU - LL);
		var color = tinycolor.fromRatio({ h: hue, s: 1, l: 0.5 });
		Curve_cols[x][y] = "#" + color.toHex();
	    }
	}
	console.log("converting numbers to px colours (ms) : ", new Date()-starting);

	// 3. plot on canvas
	starting = new Date();//record start time
	for(var x=0; x < winW; x += BOX){	
	    for(var y=0; y < winH; y += BOX){	


		ctx.fillStyle = Curve_cols[x][y];
		ctx.fillRect (x, y, BOX, BOX);//x,y,w,h

	    }
	}
	console.log("Putting data into Canvas took (ms) : ", new Date()-starting);

    }

};
