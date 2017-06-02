import React from 'react';


// Underlying data
import DatH from './DatH/DatH';

import {CpotSampleData} from './DatH/SampleData_Cpot';
import {GridSampleData} from './DatH/SampleData_Grid';

//Custom Components
import Toolbox from './Toolbox';
import PGT_Background from './PGT_Background';

class PGT_App extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    DataArrays: {
		"cpot": CpotSampleData.arr,
		"grid": GridSampleData.arr
	    },
	    bgControl: {}
	};
    }

    handleDataChange(dataCategory, changeType, details){
	const oldArrs = this.state.DataArrays;
	// This function call returns an updated Array...
	const newArrs = DatH.immutUpdateAllArrays(oldArrs, dataCategory, changeType, details);
	this.setState({
	    DataArrays: newArrs
	});
    }

    handleBgChange(newBgState){
	this.setState({
	    bgControl: newBgState
	});
    }

    
    render() {
	return (
	    <div className="PGT_App">
	      {/* 1. Backgrounds */}
	      <PGT_Background
		 DataArrays={this.state.DataArrays}
		 bgControl={this.state.bgControl}
		 />

	      {/* 2. Floating (draggable) Toolbox */}
	      <Toolbox
		 DataArrays={this.state.DataArrays}
		 handleDataChange={this.handleDataChange.bind(this)}
		 onBgChange={this.handleBgChange.bind(this)}
		 />
	    </div>
	);
    }
}


export default PGT_App;
