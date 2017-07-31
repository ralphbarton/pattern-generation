import React from 'react';

//libraries
import Draggable from 'react-draggable';


//custom
import WgTabbedSection from './Wg/WgTabbedSection';

import MainTab_CpotView from './Cpot/MainTab_CpotView';
import MainTab_Grid from './Grid/MainTab_Grid';
import MainTab_Plot from './Plot/MainTab_Plot';
import MainTab_MotfView from './Motf/MainTab_MotfView';

import withTabSupport from './withTabSupport';

const TS_MainTab_CpotView = withTabSupport(MainTab_CpotView);
const TS_MainTab_Grid = withTabSupport(MainTab_Grid);
const TS_MainTab_Plot = withTabSupport(MainTab_Plot);
const TS_MainTab_MotfView = withTabSupport(MainTab_MotfView);


class Toolbox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    toolboxSize: 1, /*options ae 1,2,3*/
	    selectedTabIndex: 4,//default Tab selection
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


		
		<WgTabbedSection
		   className="main"
		   enabled={this.state.tabsEnabled}
		   tabSelectedIndex={this.state.selectedTabIndex}
		   // The function below is worth rewriting for every component instance
		   // it sets the specific state variable associated with the tab choice
		   onTabClick={ new_i => {
		       if (new_i === this.state.selectedTabIndex){return;}
		       this.setState({
			   selectedTabIndex: new_i
		       });
		   }}
		  items={
		      [
			  {// Tab 1 - Colour Pots
			      name: "Colour Pots",
			      renderJSX: ()=>{
				return (
				    <TS_MainTab_CpotView
				       PGTobjArray={this.props.PGTobjARRAYS['cpot']}
				       onPGTobjArrayChange={this.props.onPGTobjARRAYSChange.bind(null, "cpot")}
				      UI={this.props.UIState['cpot']}
				      setPGTtabUIState={($chg)=>{this.props.onUIStateChange({"cpot": $chg});}}
				      //Additional Prop, as this tab can change Toolbox size
				      onToolboxSizeChange={this.handleToolboxSizeChange.bind(this)}
				      />
				);
			      }

			  },{// Tab 2 - Colouring Functions
			      name: "Colouring Functions",
			      renderJSX: ()=>{
				  return(
				      // Colouring Functions
				      <span> ere...  </span>
				  );
			      }

			  },{// Tab 3 - Motifs
			      name: "Motifs",
			      renderJSX: ()=>{
				  return(
				      <TS_MainTab_MotfView
					 PGTobjArray={this.props.PGTobjARRAYS['motf']}
					 onPGTobjArrayChange={this.props.onPGTobjARRAYSChange.bind(null, 'motf')}
					 UI={this.props.UIState['motf']}
					 setPGTtabUIState={($chg)=>{this.props.onUIStateChange({"motf": $chg});}}
					 onToolboxSizeChange={this.handleToolboxSizeChange.bind(this)}
					/>
				  );
			      }

			  },{// Tab 4 - Grids
			      name: "Grids",
			      renderJSX: ()=>{
				  return(
				      <TS_MainTab_Grid
				       PGTobjArray={this.props.PGTobjARRAYS['grid']}
				       onPGTobjArrayChange={this.props.onPGTobjARRAYSChange.bind(null, 'grid')}
				       UI={this.props.UIState['grid']}
				       setPGTtabUIState={($chg)=>{this.props.onUIStateChange({"grid": $chg});}}
				      />
				  );
			      }

			  },{// Tab 5 - Density Plots
			      name: "Density Plots",
			      renderJSX: ()=>{
				  return (
				      <TS_MainTab_Plot
					 PGTobjArray={this.props.PGTobjARRAYS['plot']}
					 onPGTobjArrayChange={this.props.onPGTobjARRAYSChange.bind(null, "plot")}
					 UI={this.props.UIState['plot']}
					 setPGTtabUIState={($chg)=>{this.props.onUIStateChange({"plot": $chg});}}
					/>
				  );
			      }

			  },{// Tab 6 - Density Paintings
			      name: "Density Paintings",
			      renderJSX: ()=>{
				  return(
				      <span> Density Paintings JSX to go here... </span>
				  );
			      }

			  },{// Tab 7 - Patterns
			      name: "Patterns",
			      renderJSX: ()=>{
				  return(
				      <span> Patterns JSX to go here... </span>
				  );
			      }

			  },{// Tab 8 - Examples
			      name: "Examples",
			      renderJSX: ()=>{
				  return(
				      <span> Examples JSX to go here... </span>
				  );
			      }

			  },{// Tab 9 - Options
			      name: "Options",
			      renderJSX: ()=>{
				  return(
				      <span> Options JSX to go here... </span>
				  );
			      }

			  },{// Tab 10 - Tutorial
			      name: "Tutorial",
			      renderJSX: ()=>{
				  return(
				      <span> Tutorial JSX to go here... </span>
				  );
			      }
			  }
		      ]
		  }
		/>


	    </div>
	</Draggable>
	);
    }
}

export default Toolbox;
