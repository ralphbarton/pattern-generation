import numeral from 'numeral';

var util = {
    lookup: function(arr, keyName, keyValue){
	for (var i = 0; i < arr.length; i++) {
	    if(arr[i][keyName] === keyValue){
		return arr[i];
	    }
	}
	return undefined;
    },

    //display a number of any magnitude concisely.
    FM1: function(x){
	if(typeof(x) !== "number" || x === Infinity || x === -Infinity || x === 0) {return x;}
	const expF = Math.abs(x) < 0.1 || Math.abs(x) > 1e8;
	return numeral(x).format(expF ? '0.0e+0' : '0.00a');
    },

    // display an integer with commas
    FM2: function(x){
	return numeral(x).format('0,0');
    }
    
};


export {util as default};
