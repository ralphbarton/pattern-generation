import update from 'immutability-helper';

import {CpotSampleData} from './SampleData_Cpot';
import {GridSampleData} from './SampleData_Grid';
import {PlotSampleData} from './SampleData_Plot';
import {MotfSampleData} from './SampleData_Motf';
import {PattSampleData} from './SampleData_Patt';
import {CfunSampleData} from './SampleData_Cfun';

const uidCounters = {
    "cpot": CpotSampleData.arr.length,
    "grid": GridSampleData.arr.length,
    "plot": PlotSampleData.arr.length,
    "motf": MotfSampleData.arr.length,
    "patt": PattSampleData.arr.length,
    "cfun": CfunSampleData.arr.length,
};


//this function is only called within this file
function nextUidOf(Object_Type){
    return uidCounters[Object_Type]++;
};


const DatH = {

    immutUpdateAllArrays: function(DataArrays, objectType, changeType, details){

	/*
	  Possible values for the 'objectType' parameter
	  "cpot"
	  "grid"
	  "plot"
	  "motf"
	  "patt"
	  "cfun"
	*/

	
	/*
	  Possible values for the 'changeType' parameter
	  "name"
	  "duplicate"
	  "delete"
	  "update"
	*/

	
	
	/*
	  keys for the 'details' object:
	  'index' (required)
	  'new_name'
	  'updated_object'
	  
	*/

	const oldObjArray = DataArrays[objectType];
	const i = details.index;

	let $Updater;
	
	switch (changeType) {
	    
	case "name":
	    $Updater = {[i]: {name: {$set: details.new_name}}};
	    break;

	case "duplicate":
	    let copiedObj = update(oldObjArray[i], {
		name: {$set: oldObjArray[i].name + "(copy)"},
		uid: {$set: nextUidOf("cpot")}
	    });
	    $Updater = {$splice: [[i+1, 0, copiedObj]]};
	    break;

	case "add":
	    details.new_object.uid = nextUidOf(objectType);//doesn't need to be an immutable update
	    $Updater = {$splice: [[i+1, 0, details.new_object]]};
	    break;
	    
	case "delete":
	    $Updater = {$splice: [[i, 1]]};
	    break;

	case "replace":
	    $Updater = {$splice: [[i, 1, details.replacement_object]]};
	    break;

	case "update":
	    $Updater = {[i]: details.$Updater};
	    break;

	default: break;
	}
	   
	return update(DataArrays, {[objectType]: $Updater});	    
    }

};


export {DatH as default};
