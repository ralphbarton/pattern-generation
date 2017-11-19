var _ = require('lodash');
import math from 'mathjs';

import Motf_lists from './Motf_lists';

var Motf_paramEval = {

    numberFromFormula: function(formulaString, paramData){

	const formulaStr = formulaString.split('=')[1];
	
	// 1. compile
	try{
	    var usrFn = math.compile(formulaStr);
	}
	catch (syntaxError){
	    var fail = true;
	    console.log("syntaxError"/*, syntaxError*/);
	    console.log(formulaStr);
	}

	const getV = (P,r) => {return P.min + r * (P.max-P.min);}

	// 2. evaluate
	try{

	    //converting an array into an object, by mutating an empty object
	    /* the array of parameters is an array of things looking like this:
		{
		    id: 2,
		    type: 1, //random
		    name: "LP03",
		    min: 30,
		    max: 40
		}
	     */
	    
	    const param_KVPs = {};
	    let allParams;
	    
	    if(paramData.useAve){
		paramData.mParams.forEach( P => {
		    param_KVPs[P.name] = getV(P, 0.5);
		});

		allParams = param_KVPs;
		
	    }else{
		paramData.random_Params.forEach( P => {
		    param_KVPs[P.name] = getV(P, Math.random());
		});

		allParams = _.assign(param_KVPs, paramData.evaldParams);
	    }


	    var result = usrFn.eval( allParams );
	    
	}
	catch (evaluationError){
	    fail = true;
	    console.log("evaluationError" /*, evaluationError*/);
	}

//	console.log(`formulaString ${formulaStr} gave ${result}`);
	return {
	    err: fail,//error flag
	    r: fail ? 0 : result
	};

    },
    
    evaluateMotifElement: function(Element, paramData){

	/*
	   // SOME WORK HERE IS NEEDED TO EVALUATE ONE-TIME (colour, dimention) values for this motif instance
	*/

	const paramData_flt = {
	    mParams: paramData.mParams,
	    random_Params: _.filter(paramData.mParams , {type: 1}),
	    evaldParams: paramData.readyEvaluatedParams,
	    useAve: paramData.useParamAverage || false
	};
	
	
	// "mapValues()" - for an Object (rather than Array): keeping same keys, convert values.
	return _.mapValues(Element, (value, key) =>{

	    const PropertyDetails = _.find(Motf_lists.ObjectProperties, {DatH_Key: key} );
	    const applyFormulaEval = PropertyDetails && PropertyDetails.type === "number" && value[0] === '=';

	    // was the Property of the Element a formula that needed evaluation?
	    return applyFormulaEval ? this.numberFromFormula(value, paramData_flt).r : value;
	});
    }

};

export default Motf_paramEval;
