import React from 'react';
import {CpotSampleData} from './DatH/SampleData_Cpot';
import {GridSampleData} from './DatH/SampleData_Grid';

//libraries
import Draggable from 'react-draggable';

//custom
import TabStrip from './TabStrip';
import MainTab_CpotView from './Cpot/MainTab_CpotView';
import MainTab_Grid from './Grid/MainTab_Grid';

import DatH from './DatH/DatH';

class Toolbox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    toolboxSize: 1, /*options ae 1,2,3*/
	    selectedTabIndex: 3,
	    tabsEnabled: true,
	    DataArrays: {
		"cpot": CpotSampleData.arr,
		"grid": GridSampleData.arr
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

    
    
    handleToolboxSizeChange(newSize){
	this.setState({
	    toolboxSize: newSize,
	    tabsEnabled: (newSize === 1) /* There may be other conditions for disabling main strip...*/
	});
    }

    
    render() {
	const toolboxDivClasses = "BeigeWindow Toolbox size-" + this.state.toolboxSize;
	return (
	    <Draggable handle=".handle">
	      <div className={toolboxDivClasses}>
		<div className="Title-Strip handle">
		  Re-Implementing the Toolbox in React...
		</div>

		<TabStrip items={
			      [
				  {a: "Colour Pots", i: 0},
				  {a: "Colouring Functions", i: 1},
				  {a: "Motifs", i: 2},
				  {a: "Grids", i: 3},
				  {a: "Density Plots", i: 4},
				  {a: "Density Paintings", i: 5},
				  {a: "Patterns", i: 6},
				  {a: "Examples", i: 7},
				  {a: "Options", i: 8},
				  {a: "Tutorial", i: 9}
			      ]
			  }
			  selected={this.state.selectedTabIndex}
			  enabled={this.state.tabsEnabled}
			  onTabSelect={(i) => {this.setState({
			      selectedTabIndex: i
		  });}}
		  />

		  <div className="Tab-Body">
		    {
			//Determine which tab body to show...
			(() => {
			    switch (this.state.selectedTabIndex) {
			    case 0:
				return (
				    <MainTab_CpotView					    
				       cpotArray={this.state.DataArrays.cpot}
				       onCpotChange={(arg1, arg2)=>{this.handleDataChange("cpot", arg1, arg2);}}
				      onToolboxSizeChange={this.handleToolboxSizeChange.bind(this)}
				      />
				);
			    case 1:
				return <span> ere...  </span>;
			    case 2:
				return <span> Motifs here...  </span>;
			    case 3:
				return (
				    <MainTab_Grid
				       gridArray={this.state.DataArrays.grid}
				       onGridChange={(arg1, arg2)=>{this.handleDataChange("grid", arg1, arg2);}}
				      />
				);
			    case 4:
				return <span> Density Plots here...  </span>;
			    case 5:
				return <span> Density Paintings here...  </span>;
			    case 6:
				return <span> Patterns here...  </span>;
			    case 7:
				return <span> Examples here...  </span>;
			    case 8:
				return <span> Options here...  </span>;
			    case 9:
				return <span> Tutorial here...  </span>;
			    default:
				return <span> unhandled tab clicked in </span>;
				
			    }
			})()
		    }
	    </div>
		</div>
	    </Draggable>
	);
    }
}

export default Toolbox;
