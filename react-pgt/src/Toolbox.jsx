import React from 'react';

//libraries
import Draggable from 'react-draggable';


//custom
import WgTabbedSection from './Wg/WgTabbedSection';

import MainTab_CpotView from './Cpot/MainTab_CpotView';
import MainTab_Grid from './Grid/MainTab_Grid';
import MainTab_Plot from './Plot/MainTab_Plot';
import MainTab_MotfView from './Motf/MainTab_MotfView';
import MainTab_Patt from './Patt/MainTab_Patt';
import MainTab_Opts from './Opts/MainTab_Opts';


class Toolbox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    toolboxSize: 1, /*options ae 1,2,3*/
	    selectedTabIndex: 4, // default Tab selection /* 0-cpot, 1-cfun, 2-motf, 4-plot, 6-patt, 7-Opt*/
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
				    <MainTab_CpotView
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
				      <MainTab_MotfView
					 PGTobjArray={this.props.PGTobjARRAYS['motf']}
					 onPGTobjArrayChange={this.props.onPGTobjARRAYSChange.bind(null, 'motf')}
					 UI={this.props.UIState['motf']}
					 setPGTtabUIState={($chg)=>{this.props.onUIStateChange({"motf": $chg});}}
					 onToolboxSizeChange={this.handleToolboxSizeChange.bind(this)}
					 onToastMsg={this.props.onToastMsg}
					/>
				  );
			      }

			  },{// Tab 4 - Grids
			      name: "Grids",
			      renderJSX: ()=>{
				  return(
				      <MainTab_Grid
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
				      <MainTab_Plot
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
				      <MainTab_Patt
					 PGTobjArray={this.props.PGTobjARRAYS['patt']}
					 PGTobjARRAYS={this.props.PGTobjARRAYS}// separately, Patt tab needs access to everything
					 onPGTobjArrayChange={this.props.onPGTobjARRAYSChange.bind(null, "patt")}
					 UI={this.props.UIState['patt']}
					 setPGTtabUIState={($chg)=>{this.props.onUIStateChange({"patt": $chg});}}
					 />
				  );
			      }

			  },{// Tab 8 - Options
			      name: "Options",
			      renderJSX: ()=>{
				  return(
				      <MainTab_Opts
					 UI={this.props.UIState['opts']}
					 setPGTtabUIState={($chg)=>{this.props.onUIStateChange({"opts": $chg});}}
					 />
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
