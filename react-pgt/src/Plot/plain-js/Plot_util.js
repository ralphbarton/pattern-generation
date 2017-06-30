import math from 'mathjs';
var _ = require('lodash');

var Plot_util = {

    check_eqn_type: function(formulaString){//check the equation...

	try{
	    var usrFn = math.compile(formulaString);
	}
	catch (e){
	    console.log("Cannot compile formula");
	    console.log("e.name", e.name);
	    console.log("e.message", e.message);
	    return "invalid";
	}

	// test if it can be evaluated as a real formula, fixing values of x and y only
	var OK_real = true;
	try{
	    usrFn.eval({x:0, y:0});
	}
	catch (e){
	    OK_real = false;
	    var e1 = e;
	}

	// test if it can be evaluated as a complex formula, fixing value of z only
	var OK_cplx = true;
	try{
	    usrFn.eval({z:0});
	}
	catch (e){
	    OK_cplx = false;
	}

	if((!OK_real)&&(!OK_cplx)){
	    console.log("There's a problem in the formula!");
	    console.log("e.name", e1.name);
	    console.log("e.message", e1.message);
	    return "invalid";
	}
	

	return OK_real ? "real" : "cplx";
    },

    newPlot: function(myFormula){

	/*
	// see - https://lodash.com/docs/4.17.4#random
	_.random(0, 5);   // => an integer between 0 and 5
	_.random(5);      // => also an integer between 0 and 5
	*/

	//plot may be real (50%) or imaginary (50%) with some randomisation of values...

	var formula = "";
	if(myFormula !== undefined){
	    formula = myFormula;
	    
	}else if(Math.random()>0.5){ // real
	    const Cx = _.random(2, 6); // x-coefficient
	    const Cy = _.random(2, 6); // y-coefficient
	    const Sg = Math.random()>0.5 ? "+" : "-"; // sign (plus or minus)
	    formula = Cx+"x"+Sg+Cy+"y";

	}else{ //imaginary
	    const Pz = _.random(1, 12); // z-power
	    const Sg = Math.random()>0.5 ? "" : "-"; // sign (nothing, or minus)
	    formula = Sg+"z^"+Pz;	    
	}	
	
	return {
	    formula: formula,
	    /*uid:  (added later)  */   
	    histogram: {
		val_min: 0,
		val_max: 0,
	    }
	};
    }
    
}



export {Plot_util as default};
