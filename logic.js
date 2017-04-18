var logic = {

    DrawFromColourPot: function(colour_pot){
	//so far this'll only do solid colours. Adapt it to handle ranges.
	//so far, we're not handling random seeding. When we do, Math.random() will need to be replaced.
	var dice_roll = Math.random() * 100;
	
	var items = colour_pot.contents;
	
	var accumulator = 0;
	for (var i=0; i < items.length; i++){
	    accumulator += items[i].prob;
	    if (dice_roll < accumulator){
		break;
	    }
	}
	
	if (items[i].type== "solid"){
	    return items[i].solid;
	}

	else if (items[i].type== "range"){

	    var Rdat1 = cpot_edit.make_Rdata({colour_pair: items[i].range });
	    var X = cpot_edit.get_Rdata_components(Rdat1);

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


    colour_pair_to_hsl: function(colour_1, colour_2){
	var A1 = hexToRgb(colour_1);//{}
	var B1 = rgbToHsl(A1.r,A1.g,A1.b);//[]
	var C1 = {H: B1[0], S: B1[1], L: B1[2]}

	var A2 = hexToRgb(colour_2);//{}
	var B2 = rgbToHsl(A2.r,A2.g,A2.b);//[]
	var C2 = {H: B2[0], S: B2[1], L: B2[2]}

	var C_av = {H: (C2.H + C1.H)/2,
		    S: (C2.S + C1.S)/2,
		    L: (C2.L + C1.L)/2
		   };

	var Cdiff = {H: C2.H - C1.H,
		     S: C2.S - C1.S,
		     L: C2.L - C1.L
		    };

	return {
	    C1: C1,
	    C2: C2,
	    C_av: C_av,
	    Cdiff: Cdiff	
	}
    },

    
    tiny_HSLA_average: function(colour_1, colour_2){
	var A = tinycolor(colour_1).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
	var B = tinycolor(colour_2).toHsl();
	return tinycolor({h: (A.h+B.h)/2 , s: (A.s+B.s)/2, l: (A.l+B.l)/2, a: (A.a+B.a)/2})
    },

    HSLA_average_delta: function(colour_1, colour_2){
	var A = tinycolor(colour_1).toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }
	var B = tinycolor(colour_2).toHsl();
	var C = {h: (A.h+B.h)/2 , s: (A.s+B.s)/2, l: (A.l+B.l)/2, a: (A.a+B.a)/2};
	var dH = Math.abs(A.h - B.h);
	var dS = Math.abs(A.s - B.s);
	var dL = Math.abs(A.l - B.l);
	var dA = Math.abs(A.a - B.a);
	
	var D = {h: dH, s: dS, l: dL, a: dA};
	
	//
	return {av:C, df:D};
    },

    tiny_HSLA_shift: function(colour_1, colour_2, colour_new){
	var X = this.HSLA_average_delta(colour_1, colour_2).df;//take the difference
	var W = tinycolor(colour_new).toHsl();
	return [
	    tinycolor({h: (W.h - (X.h/2)) , s: (W.s - (X.s/2)) , l: (W.l - (X.l/2)) , a: (W.a - (X.a/2)) }).toRgb(),
	    tinycolor({h: (W.h + (X.h/2)) , s: (W.s + (X.s/2)) , l: (W.l + (X.l/2)) , a: (W.a + (X.a/2)) }).toRgb()
	];
    }    

}

//get this working...
//http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


///// my custom colour manipulation functions...s
function hslToHex(h, s, l) {
    var arr = hslToRgb(h, s, l);
    return rgbToHex(arr[0], arr[1], arr[2]);
}

/*
http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
*/
/// CONVERT BETWEEN HEX COLOURS AND RGB-COMPONENT COLOURS
///
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/*
http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
*/

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
