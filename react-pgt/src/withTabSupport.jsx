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
		handleRowSelectedChange: this.handleRowSelectedChange.bind(this)
	    };
	}

	// An (immutable) change in the selected object
	// this wraps 'onPGTobjModify'
	handleModifySelPGTobj($change){
	    const rIndex = this.props.UI.selectedRowIndex;
	    this.props.onPGTobjModify("update", {index: rIndex, $Updater: $change});
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

	// Copy-pasted, shared with Grid / Cpot
	handleRowSelectedChange(index){

	    const PGTobj_i = this.props.PGTobjArray[index];
	    
	    //the object is updated to contain both the index and the UID of the PGTobj...
	    this.props.setPGTtabUIState({
		selectedRowIndex: {$set: index},
		selectionUid: {$set: PGTobj_i.uid}
	    });
	}	

	render() {
	    const { onPGTobjModify, setPGTtabUIState, ...restProps } = this.props;//pull off some props...
	    return <WrappedComponent fn={this.fn} {...restProps} />;
	}
    };
}

export default withTabSupport;
