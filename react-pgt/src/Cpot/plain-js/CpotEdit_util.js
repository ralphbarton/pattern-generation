var CpotEdit_util = {

    calcProbsSum: function(cpot){
	var accumulator = 0;

	for (var i=0; i < cpot.contents.length; i++){
	    accumulator += cpot.contents[i].prob;
	}

	//rounding necessary due to floating point lsb accuracy for non-integers.
	return Number(accumulator.toFixed(3));
    },

    /*
    EDcpot_sum100: function(cpot){
	var items = this.EDITINGcpot.contents;	
	var accumulator = 0;

	//1. sum
	for (var i=0; i < items.length; i++){
	    accumulator += Number(items[i].prob);
	}

	//2. rescale (with rounding and guarenteed sum=100)
	var r_acc = 0;
	for (var i=0; i < items.length; i++){
	    var rounded = +((items[i].prob * (100/accumulator)).toFixed(1));
	    var remainder = +((100-r_acc).toFixed(1));//we assume the %'s have 1.d.p.
	    items[i].prob = (i == items.length-1 ? remainder : rounded);
	    r_acc += rounded;
	}

    },

    EDcpot_AllEqualProbs: function(cpot){
	var items = this.EDITINGcpot.contents;	
	for (var i=0; i < items.length; i++){
	    items[i].prob = 3;//an arbitrary number
	}
    },

    EDcpot_DeleteRow: function(index){
	this.EDITINGcpot.contents.splice(index, 1);
    },

    EDcpot_NewRow: function(row_col){
	this.EDITINGcpot.contents.push(
	    {
		prob: 15,
		type: "solid",
		solid: (row_col || "#FF0000")
	    }
	);
	return this.EDITINGcpot.contents.length;
    }
    */

    
};

export {CpotEdit_util as default};
