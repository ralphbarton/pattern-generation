import React from 'react';
import update from 'immutability-helper';

// Underlying data
import DatH from './DatH/DatH';

import {CpotSampleData} from './DatH/SampleData_Cpot';
import {GridSampleData} from './DatH/SampleData_Grid';
import {PlotSampleData} from './DatH/SampleData_Plot';
import {MotfSampleData} from './DatH/SampleData_Motf';
import {PattSampleData} from './DatH/SampleData_Patt';
import {CfunSampleData} from './DatH/SampleData_Cfun';

//Custom Components
import Toolbox from './Toolbox';
import PGT_Background from './PGT_Background';

class PGT_App extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    DataArrays: {
		"cpot": CpotSampleData.arr,
		"grid": GridSampleData.arr,
		"plot": PlotSampleData.arr,
		"motf": MotfSampleData.arr,
		"patt": PattSampleData.arr,
		"cfun": CfunSampleData.arr
	    },
	    UI: {
		"grid": {},
		"plot": {},
		"motf": {},
		"patt": {}
	    }
	};
	this.latestUI = this.state.UI;
    }

    handleDataChange(dataCategory, changeType, details){
	const oldArrs = this.state.DataArrays;
	// This function call returns an updated Array...
	const newArrs = DatH.immutUpdateAllArrays(oldArrs, dataCategory, changeType, details);
	this.setState({
	    DataArrays: newArrs
	});
    }

    handleUIStateChange($update){

	/*
	 if I have this function 'handleUIStateChange' calculate new state as a function of 'this.state',
	 then after multiple calls (between the Component itself Updating), only the most recent call makes an impact.

	 Responses to events can seem to fail to occur in the Software.

	 This is due to the fact that 'this.state' only consolidates (i.e. actually changes) when the the component,
	 updates, so after the first call (within a response to handling one single event) state state information
	 starts to be used.

	 to get round this, I am declaring some new 'member data' for the component/class, 'latestUI'. This will
	 accumulate all change requests. I cannot work out if doing this is somehow an anti-pattern for React.

	 */
	this.latestUI = update(this.latestUI, $update);
	this.setState({
	    UI: this.latestUI
	});
    }
    
    
    render() {
	return (
	    <div className="PGT_App">
	      {/* 1. Backgrounds */}
	      <PGT_Background
		 DataArrays={this.state.DataArrays}
		 UIState={this.state.UI}
		 />
	      
	      {/* 2. Floating (draggable) Toolbox */}
	      <Toolbox
		 DataArrays={this.state.DataArrays}
		 onDataChange={this.handleDataChange.bind(this)}
		 UIState={this.state.UI}
		 onUIStateChange={this.handleUIStateChange.bind(this)}
		 />
	    </div>
	);
    }
}


export default PGT_App;
