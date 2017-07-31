import math from 'mathjs';
var _ = require('lodash');

var Plot_util = {

    checkPlotFormula: function(Plot){//check the equation...

	const appearsComplex = Plot.formula.includes("z");
	const closestByIncl_z = appearsComplex ? "cplx" : "real";
	
	try{
	    var usrFn = math.compile(Plot.formula);
	}
	catch (syntaxError){

	    // Case 1: syntax error
	    return {
		determination: "invalid",		
		closest: closestByIncl_z,
		className: "invalid",
		Error: syntaxError
	    };
	}

	// test if it can be evaluated as a real formula, fixing values of x and y only
	var OK_real = true;
	try{
	    usrFn.eval({x:0, y:0});
	}
	catch (e){
	    OK_real = false;
	    var evaluationErrorReal = e; // evaluationError is less severe than syntax error.
	}

	// test if it can be evaluated as a complex formula, fixing value of z only
	var OK_cplx = true;
	try{
	    usrFn.eval({z:0});
	}
	catch (e){
	    OK_cplx = false;
	    var evaluationErrorCplx = e; // evaluationError is less severe than syntax error.
	}

	// test if it can be evaluated when x,y and z are passed. Valid formulas will not contain all 3 variables.
	var OK_real_cplx = true;
	try{
	    usrFn.eval({x:0, y:0, z:0});
	}
	catch (e){
	    OK_real_cplx = false;
	}

		
	if((!OK_real)&&(!OK_cplx)){

	    // Case 2:  both real and complex variables in formula
	    if(OK_real_cplx){
		return {
		    determination: "invalid",
		    closest: "real", // where x,y and z are all featuring, we'll use f(x,y)
		    className: "invalid",
		    Error: {
			name: "Error",
			message: "Formula must be in terms of x and y, or in terms of z"
		    }
		};
	    }
	    
	    const evaluationError = appearsComplex ? evaluationErrorCplx : evaluationErrorReal;

	    // Case 3: general evaluation error
	    return {
		determination: "invalid",
		closest: closestByIncl_z,
		className: "invalid",
		Error: evaluationError
	    };
	}

	// Case 4: formula is Valid
	return {
	    determination: (OK_real ? "real" : "cplx"),
	    closest: (OK_real ? "real" : "cplx"),
	    className: (OK_real ? "" : "pink")
	};
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
	    section: {
		xOffset: 0,
		yOffset: 0,
		xZoom: 1,
		yZoom: 1,
		rotation: 0
	    },
	    lastRenderScale: {}
	};
    }
    
}



export {Plot_util as default};
