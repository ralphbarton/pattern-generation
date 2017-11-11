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

    //I'm using a pattern where I parent state upon component first mount........
    componentDidMount(){
	if (this.props.UIState.Toolbox.selectedTabIndex !== undefined){return;}

	// Initial state below:
	this.props.onUIStateChange({Toolbox: {
	    $set:{
		toolboxSize: 1, /*options ae 1,2,3*/
		selectedTabIndex: 6, // default Tab selection /* 0-cpot, 1-cfun, 2-motf, 4-plot, 6-patt, 7-Opt*/
		tabsEnabled: true // the tab-strip becomes 'disabled' when in a sub-menu of a tab
	    }
	}});
    }    
    
    handleToolboxSizeChange(newSize){
	this.props.onUIStateChange({Toolbox: {
	    toolboxSize: {$set: newSize},
	    tabsEnabled: {$set: (newSize === 1)} /* There may be other conditions for disabling main strip...*/
	}});
    }

    
    render() {
	//sacraficial first render for default state
	if (this.props.UIState.Toolbox.selectedTabIndex === undefined){return null;}

	const toolboxDivClasses = "BeigeWindow Toolbox size-" + this.props.UIState.Toolbox.toolboxSize;

	return (
	    <Draggable handle=".handle">
	      <div className={toolboxDivClasses}>
		<div className="Title-Strip handle">
		  Re-Implementing the Toolbox in React...
		</div>


		
		<WgTabbedSection
		   className="main"
		   enabled={this.props.UIState.Toolbox.tabsEnabled}
		   tabSelectedIndex={this.props.UIState.Toolbox.selectedTabIndex}
		   // The function below is worth rewriting for every component instance
		   // it sets the specific state variable associated with the tab choice
		   onTabClick={ new_i => {
		       if (new_i === this.props.UIState.Toolbox.selectedTabIndex){return;}
		       this.props.onUIStateChange({Toolbox: {
			   selectedTabIndex: {$set: new_i}
		       }});
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
					 PlotImgCache={this.props.DensityImgCache["plot"]}
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
					 DensityImgCache={this.props.DensityImgCache}
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
					 PGTobjARRAYS={this.props.PGTobjARRAYS}// for export feature...
					 paneCfg={this.props.DensityImgCache.paneCfg}
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
