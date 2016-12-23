var gradient_cell = {

    make: function(size, colour_1, colour_2, conf){

	var $grad = $('<canvas/>')
	    .attr("width", size)
	    .attr("height", size)
	    .addClass("gradient-cell");
	var ctx = $grad[0].getContext('2d');

	var A1 = hexToRgb(colour_1);//{}
	var B1 = rgbToHsl(A1.r,A1.g,A1.b);//[]
	var C1 = {H: B1[0], S: B1[1], L: B1[2]}

	var A2 = hexToRgb(colour_2);//{}
	var B2 = rgbToHsl(A2.r,A2.g,A2.b);//[]
	var C2 = {H: B2[0], S: B2[1], L: B2[2]}

	var Cdiff = {H: C2.H - C1.H,
		     S: C2.S - C1.S,
		     L: C2.L - C1.L
		    };

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

		    var Hx = C1.H + H_frac * Cdiff.H;
		    var Sx = C1.S + S_frac * Cdiff.S;
		    var Lx = C1.L + L_frac * Cdiff.L;
		    
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
