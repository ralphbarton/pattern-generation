var gradient_cell = {

    make: function(size, colour_1, colour_2, conf){

	var $grad = $('<canvas/>')
	    .attr("width", size)
	    .attr("height", size)
	    .addClass("gradient-cell");
	var ctx = $grad[0].getContext('2d');
	
	var hslp = logic.colour_pair_to_hsl(colour_1, colour_2); // HSL pair

	if (ctx) {
	    for (var x = 0; x < size; x++){
		for (var y = 0; y < size; y++){
		    //determine colour at x,y
		    var x_frac = x/(size-1);//what fraction of the x-distance along is this pixel?
		    var y_frac = y/(size-1);
		    // for this pixel, to what extent should it be the hue of colour 2?
		    var H_frac = conf.H=="x" ? x_frac : (conf.H=="y" ? y_frac : conf.H);
		    var S_frac = conf.S=="x" ? x_frac : (conf.S=="y" ? y_frac : conf.S);
		    var L_frac = conf.L=="x" ? x_frac : (conf.L=="y" ? y_frac : conf.L);

		    var Hx = hslp.C1.H + H_frac * hslp.Cdiff.H;
		    var Sx = hslp.C1.S + S_frac * hslp.Cdiff.S;
		    var Lx = hslp.C1.L + L_frac * hslp.Cdiff.L;
		    
		    var mix = hslToRgb(Hx, Sx, Lx);
		    
		    //draw that pixel
		    ctx.fillStyle = "rgb("+mix[0]+","+mix[1]+","+mix[2]+")";
		    ctx.fillRect (x, y, 1, 1);//x,y,w,h
		}
	    }
	}

	return $grad;

    }

}
