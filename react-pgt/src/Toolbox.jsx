import React from 'react';

//libraries
import Draggable from 'react-draggable';


//custom
import TabStrip from './TabStrip';
import MainTab_CpotView from './Cpot/MainTab_CpotView';
import MainTab_Grid from './Grid/MainTab_Grid';
import MainTab_Plot from './Plot/MainTab_Plot';


class Toolbox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    toolboxSize: 1, /*options ae 1,2,3*/
	    selectedTabIndex: 3,//default Tab selection
	    tabsEnabled: true
	};
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
				// Colour Pots
				return (
				    <MainTab_CpotView					    
				       cpotArray={this.props.DataArrays['cpot']}
				       onCpotChange={(arg1, arg2)=>{this.props.onDataChange("cpot", arg1, arg2);}}
				      onToolboxSizeChange={this.handleToolboxSizeChange.bind(this)}
				      />
				);
				
			    case 1:
				// Colouring Functions
				return <span> ere...  </span>;

			    case 2:
				// Motifs
				return <span> Motifs here...  </span>;

			    case 3:
				return (
				    <MainTab_Grid
				       gridArray={this.props.DataArrays['grid']}
				       onGridChange={(arg1, arg2)=>{this.props.onDataChange("grid", arg1, arg2);}}
				      UI={this.props.UIState['grid']}
				      setGridUIState={($chg)=>{this.props.onUIStateChange({"grid": $chg});}}
				      />
				);

			    case 4:
				// Density Plots
				return (
				    <MainTab_Plot
				       plotArray={this.props.DataArrays['plot']}
				       onPlotChange={(arg1, arg2)=>{this.props.onDataChange("plot", arg1, arg2);}}
				      UI={this.props.UIState['plot']}
				      setPlotUIState={($chg)=>{this.props.onUIStateChange({"plot": $chg});}}
				      />
				);

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
