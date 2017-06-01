import update from 'immutability-helper';

import {CpotSampleData} from './SampleData_Cpot';
import {GridSampleData} from './SampleData_Grid';
import {PlotSampleData} from './SampleData_Plot';


const uidCounters = {
    "cpot": CpotSampleData.arr.length,
    "grid": GridSampleData.arr.length,
    "plot": PlotSampleData.arr.length,
    "motf": 2,
    "patt": 3,
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
	    $Updater = {};
	    $Updater[i] = {name: {$set: details.new_name}}	    
	    break;

	case "duplicate":
	    let copiedObj = update(oldObjArray[i], {
		name: {$set: oldObjArray[i].name + "(copy)"},
		uid: {$set: nextUidOf("cpot")}
	    });
	    $Updater = {$splice: [[i+1, 0, copiedObj]]};
	    break;

	case "add":
	    details.new_object.uid = nextUidOf("grid");//doesn't need to be an immutable update
	    $Updater = {$splice: [[i+1, 0, details.new_object]]};
	    break;
	    
	case "delete":
	    $Updater = {$splice: [[i, 1]]};
	    break;

	case "update":
	    $Updater = {$splice: [[i, 1, details.updated_object]]};
	    break;	    

	default: break;
	}

	const newObjArr = update(oldObjArray, $Updater);
	let $MainUpdater = {};
	$MainUpdater[objectType] = {$set: newObjArr}
	return update(DataArrays, $MainUpdater);

    }

};


export {DatH as default};
