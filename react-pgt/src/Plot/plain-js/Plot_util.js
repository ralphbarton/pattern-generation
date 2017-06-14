import math from 'mathjs';

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
    }

}



export {Plot_util as default};
