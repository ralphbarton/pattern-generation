import tinycolor from 'tinycolor2';

var Cpot_util = {
    
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

	    var X = Cpot_util.range_unpack( pot_elem.range );

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

	    col: tinycolor({h: R.h, s: R.s, l: R.l, a: R.a}).toHslString(),
	    col_opaque: tinycolor({h: R.h, s: R.s, l: R.l}).toHslString()
	    
	};	
    },


    /* Three ways of using this function:
       (1.)  'adjustment' is a colour string. It will recenter the 'prev range' provided
       (2.)  'adjustment' is a single or multiple props to modify in 'prev range'
       (3.)  As above, but optional 'prev range' not supplied. Default values of 0 used for all properties
       (n.b. at some point in future, check if cases (2 & 3) are ever needed.

       unlike in my jQuery incarnation, this function **may** mutate the 'prev_range' obj provided
     */
    
    range_set: function(adjustment, prev_range){

	if(typeof(adjustment) === "string"){
	    adjustment = tinycolor(adjustment).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }	    
	}

	prev_range = prev_range || {};
	
	var my_range = prev_range || {
	    h:  prev_range.h  || 0,
	    s:  prev_range.s  || 0,
	    l:  prev_range.l  || 0,
	    a:  prev_range.a  || 0,
	    dh: prev_range.dh || 0,
	    ds: prev_range.ds || 0,
	    dl: prev_range.dl || 0,
	    da: prev_range.da || 0
	};


	Object.keys(adjustment).map(function(keyName, keyIndex) {
	    
	    //here we iterate over all properties of obj 'adjustment'
	    const value = adjustment[keyName];
	    if(keyName === "h"){
		my_range.h = value;
		
	    }else if(keyName === "dh"){
		my_range.dh = value;

	    }else if(keyName[0] === "d"){
		// change to "ds", "dl", "da" (the key)
		var keyA = keyName[1]; // key of the complementary property
		my_range[keyName] = value;
		my_range[keyA] = Math.min(my_range[keyA], 1-value);
		my_range[keyA] = Math.max(my_range[keyA], value);
		
	    }else{
		// (assume) change to "s", "l", "a" (the key)
		var keyB = "d" + keyName; // key of the complementary property
		my_range[keyName] = value;
		my_range[keyB] = Math.min(value, 1-value, my_range[keyB]);
	    }
	    
	    return null;
	});
	    
	return my_range;
    }
    
    
};

export {Cpot_util as default};
