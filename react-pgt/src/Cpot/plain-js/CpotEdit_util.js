var CpotEdit_util = {

    calcProbsSum: function(cpot){
	var accumulator = 0;

	for (var i=0; i < cpot.contents.length; i++){
	    accumulator += cpot.contents[i].prob;
	}

	//rounding necessary due to floating point lsb accuracy for non-integers.
	return Number(accumulator.toFixed(3));
    },


    calcSum100ProbsSet: function(cpot, options){
	options = options || {};
	
	//1. sum
	var accumulator = 0;
	for (var i = 0; i < cpot.contents.length; i++){
	    accumulator += Number(cpot.contents[i].prob);
	}
	

	//2. rescale (with rounding and guarenteed sum=100)
	var r_acc = 0;
	let $updater = {contents: {}};
	
	for (let i = 0; i < cpot.contents.length; i++){
	    var weightedShare = +((cpot.contents[i].prob * (100/accumulator)).toFixed(1));
	    var equalShare = +((100 / cpot.contents.length).toFixed(1));
	    var rounded = options.all_equal ? equalShare : weightedShare;
	    
	    var remainder = +((100-r_acc).toFixed(1));//we assume the %'s have 1.d.p.

	    const new_prob = (i === cpot.contents.length-1 ? remainder : rounded);
	    $updater.contents[i] = {prob: {$set: new_prob}};

	    r_acc += rounded;
	}

	return $updater
    },

    allProbsAreEqual: function(cpot){
	for (var i = 1; i < cpot.contents.length; i++){
	    if (cpot.contents[i].prob !== cpot.contents[0].prob){return false;}
	}
	return true;
    }
	
};

export {CpotEdit_util as default};
