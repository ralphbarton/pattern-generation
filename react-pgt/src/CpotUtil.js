import tinycolor from 'tinycolor2';

var cpot_util = {

    DrawFromColourPot: function(colour_pot){
	//not handling random seeding. When we do, Math.random() will need to be replaced.
	var dice_roll = Math.random() * 100;
	var items = colour_pot.contents;
	
	var accumulator = 0;
	for (var i=0; i < items.length; i++){
	    accumulator += items[i].prob;
	    if (dice_roll < accumulator){
		break;
	    }
	}
	var pot_elem = items[i];
	
	if (pot_elem.type === "solid"){
	    return pot_elem.solid;
	}

	else if (pot_elem.type === "range"){

	    var X = cpot_util.range_unpack( pot_elem.range );

	    var D = false;// dimentionality controls not yet implemented, and set to 'false' as default.

	    var FR = Math.random();// this is a fixed random value

	    
	    return tinycolor({
		h: (X.h1 + (D ? FR : Math.random()) * X.dh * 2)%360,
		s: X.s1 + (D ? FR : Math.random()) * X.ds * 2,
		l: X.l1 + (D ? FR : Math.random()) * X.dl * 2,
		a: X.a1 + (D ? FR : Math.random()) * X.da * 2
	    }).toRgbString();

	}

    },

    range_unpack: function(R){

    	var Q = function (x){return x>0 ? (x%360) : ((x+360)%360);}

	return {
	    h1: Q( R.h - R.dh ), // lower Hue
	    h2: R.h,             // mid Hue
	    h3: Q( R.h + R.dh ), // upper Hue
	    dh: R.dh,
	    
	    s1: R.s - R.ds,
	    s2: R.s,
	    s3: R.s + R.ds,
	    ds: R.ds,
	    
	    l1: R.l - R.dl,
	    l2: R.l,
	    l3: R.l + R.dl,
	    dl: R.dl,

	    a1: R.a - R.da,
	    a2: R.a,
	    a3: R.a + R.da,
	    da: R.da,

	    tiny_av: tinycolor({h: R.h, s: R.s, l: R.l, a: R.a})
	};	
    },

    
    putGradientOnCanvas: function(canvas, colour_range, gradient_config){
	var ctx = canvas.getContext('2d');
	var size = canvas.width;
	var imageData = ctx.getImageData(0, 0, size, size);
	var pixelData = imageData.data;

	for (var x = 0; x < size; x++){
	    for (var y = 0; y < size; y++){
		//determine colour at x,y
		const x_frac = x/(size-1);//what fraction of the x-distance along is this pixel?
		const y_frac = y/(size-1);

		// for this pixel, to what extent should it be the hue of colour 2?
		const H_frac = gradient_config.H === "x" ? x_frac : (gradient_config.H === "y" ? y_frac : gradient_config.H);
		const S_frac = gradient_config.S === "x" ? x_frac : (gradient_config.S === "y" ? y_frac : gradient_config.S);
		const L_frac = gradient_config.L === "x" ? x_frac : (gradient_config.L === "y" ? y_frac : gradient_config.L);

		const Hx = (colour_range.h1 + H_frac * colour_range.dh * 2)%360;
		const Sx = colour_range.s1 + S_frac * colour_range.ds * 2;
		const Lx = colour_range.l1 + L_frac * colour_range.dl * 2;
		
		//draw that pixel
		const i = (y * size + x) * 4;
		const Colour = tinycolor( {h: Hx, s: Sx, l: Lx} ).toRgb();

		pixelData[i]     = Colour.r;
		pixelData[i + 1] = Colour.g;
		pixelData[i + 2] = Colour.b;
		pixelData[i + 3] = 255;//alpha -> fully opaque

	    }
	}

	ctx.putImageData(imageData, 0, 0);

    }
    
    
    
};

export {cpot_util as default};
