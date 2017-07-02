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
	handleRowSelectedChange(index){

	    /*
	     In the case of a 'duplicate' command, the 'PGTobjArray' will be data version prior to the duplication.
	     So the [PGTobj] at 'index' may be outside of Array bounds. It certainly will not be a correct uid.

	     This basically doesn't matter, since the uid of the selected CPOT according to controlled UI
	     state is not used by any 'background rendering' type components higher up the render tree.

	     Nonetheless, this value may be set incorrectly.

	     This also implies that Background-rendering components could not handle a duplicate command.

	     The fundamental issue, I suppose, is calling 2 event handlers for one event which attempt to perform
	     two state transitions 'in parallel', in the hope that they 'add'. I suppose this is anti-pattern;
	     */
	    const PGTobj_uid = this.props.PGTobjArray[index] ? this.props.PGTobjArray[index].uid : null;
	    
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
	    this.props.onPGTobjArrayChange("duplicate", {index: i});
	    this.handleRowSelectedChange(i+1);
	}

	// add a new item into the array
	hofHandleAddPGTobj(createPGTobj_Fn){
	    const TSprops = this.props;
	    return function (){
		const i = TSprops.UI.selectedRowIndex;
		const new_PGTobj = createPGTobj_Fn();
		TSprops.onPGTobjArrayChange("add", {index: i, new_object: new_PGTobj});
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
