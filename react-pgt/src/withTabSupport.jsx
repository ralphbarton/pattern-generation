import React from 'react';

function withTabSupport(WrappedComponent) {

    // ...return another component...
    return class extends React.Component {

	constructor() {
	    super();
	    
	    this.fn = {
		handleModifySelPGTobj: this.handleModifySelPGTobj.bind(this),
		handleUIStateChange: this.handleUIStateChange.bind(this),
		defaultUIStateConfiguration: this.defaultUIStateConfiguration.bind(this),
		handleRowSelectedChange: this.handleRowSelectedChange.bind(this),
		handleDeleteSelPGTobj: this.handleDeleteSelPGTobj.bind(this),
		handleReplaceSelPGTobj: this.handleReplaceSelPGTobj.bind(this),
		handleDuplicateSelPGTobj: this.handleDuplicateSelPGTobj.bind(this),
		hofHandleAddPGTobj: this.hofHandleAddPGTobj.bind(this)
	    };
	}

	
	// Copy-pasted, shared with Grid / Cpot
	handleRowSelectedChange(index, newUid){

	    const selPGTobj = this.props.PGTobjArray[index];
	    const PGTobj_uid = typeof(newUid) === "number" ? newUid : (selPGTobj ? selPGTobj.uid : null);
	    
	    //the object is updated to contain both the index and the UID of the PGTobj...
	    this.props.setPGTtabUIState({
		selectedRowIndex: {$set: index},
		selectionUid: {$set: PGTobj_uid}
	    });
	}	

	
	// An (immutable) change in the selected object
	// this is a specific case of 'onPGTobjArrayChange'
	handleModifySelPGTobj($change){
	    const rIndex = this.props.UI.selectedRowIndex;
	    this.props.onPGTobjArrayChange("update", {index: rIndex, $Updater: $change});
	}

	// delete the selected item in the array
	handleDeleteSelPGTobj(){
	    const i = this.props.UI.selectedRowIndex;
	    const i_new = Math.min(this.props.PGTobjArray.length -2, i);
	    this.props.onPGTobjArrayChange("delete", {index: i});
	    this.handleRowSelectedChange(i_new);
	}

	handleReplaceSelPGTobj(replacementPGTobj){
	    this.props.onPGTobjArrayChange("replace", {
		index: this.props.UI.selectedRowIndex,
		replacement_object: replacementPGTobj
	    });
	}

	handleDuplicateSelPGTobj(){
	    const i = this.props.UI.selectedRowIndex;
	    const newUid = this.props.onPGTobjArrayChange("duplicate", {index: i});
	    this.handleRowSelectedChange(i+1, newUid);
	}

	// add a new item into the array
	hofHandleAddPGTobj(createPGTobj_Fn){
	    const TS = this;
	    return function (){
		const i = TS.props.UI.selectedRowIndex;
		const new_PGTobj = createPGTobj_Fn();
		const newUid = TS.props.onPGTobjArrayChange("add", {index: i, new_object: new_PGTobj});
		TS.handleRowSelectedChange(i+1, newUid);
	    };
	}

	
	// pass UI state change up to a parent component. It is not stored here...
	//this wraps 'setPGTtabUIState'
	handleUIStateChange(key, value){
	    this.props.setPGTtabUIState({
		[key]: {$set: value}
	    });
	}

	defaultUIStateConfiguration(defaultsObj){

	    //no action required if a value already set
	    if(this.props.UI.selectedRowIndex !== undefined){return;}

	    const initialSelectedRowIndex = 0;
	    const PGTobj_i = this.props.PGTobjArray[initialSelectedRowIndex];

	    const $bigChn = {
		selectedRowIndex: {$set: initialSelectedRowIndex},
		selectionUid: {$set: PGTobj_i.uid}
	    };
	    
	    Object.keys(defaultsObj).forEach(function(key,index) {
		$bigChn[key] = {$set: defaultsObj[key]};
	    });

	    this.props.setPGTtabUIState($bigChn);

	}

	
	render() {
	    const { onPGTobjArrayChange, setPGTtabUIState, ...restProps } = this.props;//pull off some props...
	    return <WrappedComponent fn={this.fn} {...restProps} />;
	}
    };
}

export default withTabSupport;