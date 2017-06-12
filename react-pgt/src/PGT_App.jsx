import React from 'react';
import update from 'immutability-helper';

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
	    UI: {
		"grid": {}
	    }
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

    handleUIStateChange($update){
	this.setState({
	    UI: update(this.state.UI, $update)
	});
    }
    
    
    render() {
	return (
	    <div className="PGT_App">
	      {/* 1. Backgrounds */}
	      {
		  //CONDITIONALLY RENDER GRID BACKGROUND COMPONENT...
		  this.state.UI['grid'].selectedRowIndex === undefined ? null : (

		      <PGT_Background
			 DataArrays={this.state.DataArrays}
			 UIState={this.state.UI}
			 />
		  )
	      }


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
