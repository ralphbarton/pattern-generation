var cpot_util = {
    
    colourPair_to_range: function(colour_pair){
	var A = tinycolor(colour_pair[0]).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
	var B = tinycolor(colour_pair[1]).toHsl();
	
	// Hue angle utilised is going clockwise from A to B
	// wrap around is handled in the structure of these calculations...
	return{
	    h: ((A.h+B.h)/2 + (B.h < A.h ? 180 : 0)) % 360,
	    dh: (B.h-A.h)/2 + (B.h < A.h ? 180 : 0),	    
	    s: (A.s+B.s)/2,
	    ds: Math.abs(A.s - B.s)/2,
	    l: (A.l+B.l)/2,
	    dl: Math.abs(A.l - B.l)/2,
	    a: (A.a+B.a)/2,
	    da: Math.abs(A.a - B.a)/2,
	    s: (A.s+B.s)/2,
	    ds: Math.abs(A.s - B.s)/2,
	};
	
    },


    //the 'default_range' parameter is optional, and can be ommitted to achieve certainn functions:
    // 1. for case 2 (repack an unpacked range)
    // 2. create a range object from only a colour...
    range_set: function(adjustment, default_range){

	if(typeof(adjustment) == "string"){
	    // case 1: adjustment is a Colour String
	    // convert it into the range-center values...
	    adjustment = tinycolor(adjustment).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }	    

	}

//Does this use case ever occur?
/*
	else if(adjustment.h2 != undefined){
	    // case 2: reducing an unpacked range into a simple range...
	    return {
		h: adjustment.h2,
		s: adjustment.s2,
		l: adjustment.l2,
		a: adjustment.a2,
		dh: adjustment.dh,
		ds: adjustment.ds,
		dl: adjustment.dl,
		da: adjustment.da,
	    };
	    
	}
*/

	
	// Case 3: where adjustment is just several h or dh values.
	// Handle this along with remainder of handling for case 1...

	var blank_range = {
	    h: 0,
	    s: 0,
	    l: 0,
	    a: 0,
	    dh: 0,
	    ds: 0,
	    dl: 0,
	    da: 0
	};


	// Deep copy, so that changes are made to a distinct Object...
	var my_range = jQuery.extend(true, {}, default_range || blank_range);

	
	$.each( adjustment, function( key, value ) {

	    if(key == "h"){
		my_range.h = value;
		
	    }else if(key == "dh"){
		my_range.dh = value;

	    }else if(key[0] == "d"){
		// change to "ds", "dl", "da" (the key)
		var keyA = key[1]; // key of the complementary property
		my_range[key] = value;
		my_range[keyA] = Math.min(my_range[keyA], 1-value);
		my_range[keyA] = Math.max(my_range[keyA], value);
		
	    }else{
		// (assume) change to "s", "l", "a" (the key)
		var keyA = "d" + key; // key of the complementary property
		my_range[key] = value;
		my_range[keyA] = Math.min(value, 1-value, my_range[keyA]);
	    }
	});

	return my_range;

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
	
	if (pot_elem.type== "solid"){
	    return pot_elem.solid;
	}

	else if (pot_elem.type== "range"){

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

    
    make_gradient_cell: function(size, RC, conf){
	
	var $grad = $('<canvas/>')
	    .attr("width", size)
	    .attr("height", size)
	    .addClass("gradient-cell");
	var ctx = $grad[0].getContext('2d');

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

		    var Hx = (RC.h1 + H_frac * RC.dh * 2)%360;
		    var Sx = RC.s1 + S_frac * RC.ds * 2;
		    var Lx = RC.l1 + L_frac * RC.dl * 2;
		    
		    //draw that pixel
		    ctx.fillStyle = tinycolor( {h: Hx, s: Sx, l: Lx} ).toHexString();
		    ctx.fillRect (x, y, 1, 1);//x,y,w,h
		}
	    }
	}

	return $grad;

    }

};
