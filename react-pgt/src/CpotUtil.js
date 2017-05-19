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
    }
    
};

export {cpot_util as default};
