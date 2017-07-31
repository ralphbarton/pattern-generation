import update from 'immutability-helper';
var _ = require('lodash');

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

    newName: function(PGTobjArr, name_i, isDupl){

	const bracket_strip = str => {return str.replace(/ *\([^)]*\) */g, "");};
	const baseName = bracket_strip(name_i);
	
	// (1) Lodash makes array of names only (2) remove all bracketed contents from this 
	const names = _.map(PGTobjArr, "name").map(bracket_strip);
	const qty = _.filter(names, nam => {return nam.includes(baseName)}).length;

	if(isDupl){
	    return baseName + " (copy"+(qty>1 ? " "+qty : "")+")";
	}else{
	    return baseName + (qty>0 ? " ("+(qty+1)+")" : "");
	}
    },
    
    immutUpdateAllArrays: function(PGTobjARRAYS, objectType, changeType, details){

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
	  possible properties for the 'details' object:
	  'index' (required)
	  'new_name'
	  'new_object'
	  'replacement_object'
	*/

	const oldObjArray = PGTobjARRAYS[objectType];
	const i = details.index;

	let $Updater;
	let newUid;
	
	switch (changeType) {
	    
	case "name":
	    $Updater = {[i]: {name: {$set: details.new_name}}};
	    break;

	case "duplicate":
	    newUid = nextUidOf(objectType);
	    const newName = this.newName(oldObjArray, oldObjArray[i].name, true);
	    
	    let copiedObj = update(oldObjArray[i], {
		name: {$set: newName},
		uid: {$set: newUid}
	    });
	    $Updater = {$splice: [[i+1, 0, copiedObj]]};
	    break;

	case "add":
	    newUid = nextUidOf(objectType);
	    // two changes that mutate the object. There is nothing wrong with mutating the object at this stage,
	    // it is not yet added as Component state (but will be immediately after mutation)
	    details.new_object.uid  = newUid;

	    if(details.new_object.name){ // some PGTobj's don't have names (e.g. Plots)
		details.new_object.name = this.newName(oldObjArray, details.new_object.name, false);
	    }
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
	   
	return {
	    newArrays: update(PGTobjARRAYS, {[objectType]: $Updater}),
	    newPGTobjUid: newUid
	}
    }

};


export {DatH as default};
