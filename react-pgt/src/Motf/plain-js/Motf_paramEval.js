var _ = require('lodash');
import math from 'mathjs';

import Motf_lists from './Motf_lists';

var Motf_paramEval = {

    numberFromFormula: function(formulaString){

	const formulaStr = formulaString.split('=')[1];
	
	// 1. compile
	try{
	    var usrFn = math.compile(formulaStr);
	}
	catch (syntaxError){
	    console.log("syntaxError"/*, syntaxError*/);
	}

	// 2. evaluate
	try{
	    var result = usrFn.eval({x:0, y:0});
	}
	catch (evaluationError){
	    var fail = true;
	    console.log("evaluationError"/*, evaluationError*/);
	}

//	console.log(`formulaString ${formulaStr} gave ${result}`);
	return fail ? 0 : result;

    },
    
    evaluateMotifElement: function(Element){
	return _.mapValues(Element, (value, key) =>{

	    const PropertyDetails = _.find(Motf_lists.ObjectProperties, {DatH_Key: key} );
	    const applyFormulaEval = PropertyDetails && PropertyDetails.type === "number" && value[0] === '=';

	    //console.log(key, value, PropertyDetails);
	    return applyFormulaEval ? this.numberFromFormula(value) : value;
	});
    }

};

export default Motf_paramEval;
