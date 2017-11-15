var _ = require('lodash');

var Cfun_util = {

    newRandomCfun: function(){
	return {//default data
	    name: "New C-Fun",
	    stops: [
		{
		    colour: 0,
		    position: 1,
		}
	    ],
	    reps: [],
	}
    },

    cssGradient: function(cfun){

	//generate a string from all stops (colour & position)
	let str = "";
	_.each(cfun.stops, (stop, i) => {

	    str += i !== 0 ? ", " : "";
	    str += stop.colour + " " + stop.position + "%";
	    
	});

	return {
	    backgroundImage: "linear-gradient(to right, " + str + ")"
	};

    }

};

    
export {Cfun_util as default};
    
