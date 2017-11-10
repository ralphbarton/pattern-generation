var _ = require('lodash');
import math from 'mathjs';

import Motf_lists from './Motf_lists';

var Motf_paramEval = {

    numberFromFormula: function(formulaString, random_Params, evaldParams){

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

	// 2. evaluate
	try{

	    //converting an array into an object, by mutating an empty object
	    const param_KVPs = {};
	    random_Params.forEach( P => {
		param_KVPs[P.name] = P.min + Math.random() * (P.max-P.min);
	    });

	    const allParams = _.assign(param_KVPs, evaldParams);
	    
	    var result = usrFn.eval( allParams );
	    
	}
	catch (evaluationError){
	    fail = true;
	    console.log("evaluationError"/*, evaluationError*/);
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
	
	const random_Params = _.filter(paramData.mParams , {type: 1});
	const evaldParams = paramData.readyEvaluatedParams;
	
	// "mapValues()" - for an Object (rather than Array): keeping same keys, convert values.
	return _.mapValues(Element, (value, key) =>{

	    const PropertyDetails = _.find(Motf_lists.ObjectProperties, {DatH_Key: key} );
	    const applyFormulaEval = PropertyDetails && PropertyDetails.type === "number" && value[0] === '=';

	    // was the Property of the Element a formula that needed evaluation?
	    return applyFormulaEval ? this.numberFromFormula(value, random_Params, evaldParams).r : value;
	});
    }

};

export default Motf_paramEval;
