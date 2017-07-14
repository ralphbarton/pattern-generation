import React from 'react';

// externally developed libraries
var _ = require('lodash');
import update from 'immutability-helper';

// generic project widgets
import WgButton from '../Wg/WgButton';
import WgTable from '../Wg/WgTable';
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';

/*
 import WgBoxie from '../Wg/WgBoxie';
 import WgActionLink from '../Wg/WgActionLink';

 import Motf_util from './plain-js/Motf_util';
 import util from '.././plain-js/util'; // for lookup by uid
 */

class MainTab_MotfEdit extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    motf: props.motf,
	    advancedFeaturesTabSelected: 0
	};
    }


    //This is copy-pasted from 'MainTab_CpotEdit.jsx' - is this an application for another HOC??
    handleEditingMotfChange(changesObject){
	this.setState({
	    motf: update(this.state.motf, changesObject)
	});
    }
    
    
    MotfEdit_params_WgTableColumns(){
	return ([
	    {
		heading: "Identifier",
		renderCellContents: (param, i)=>{return "c1";}
	    },{
		heading: "Min",
		renderCellContents: (param, i)=>{return "c2";}
	    },{
		heading: "Max",
		renderCellContents: (param, i)=>{return "c3";}
	    }
	]);
    }

    
    render(){
	return (

	    <div className="MainTab_MotfEdit">

	      {/* Column 1 */}
	      <div className="column1">

		{/* >> Parameters */}
		<div className="parameters">
		  <WgTable
		     selectedRowIndex={0}
		     onRowSelectedChange={()=>{}}
		     rowRenderingData={[ [], [], [], []]}
		     columnsRendering={this.MotfEdit_params_WgTableColumns()}
		    />

		</div>

		{/* >> Motif Elements: Properties */}
		<div className="properties">
		  <div className="freezeHeading">
		    Motif Elements: Properties
		  </div>
		  <div className="scrollableContent">
		    lots of scrollable items here...
		    <div className="blob">
		      blob
		    </div>

		  </div>
		</div>

		
		<div className="propertiesButtons">
		  <WgButton
		     name="Contract All"
		     buttonStyle={"small"}
		     />
		  <WgButton
		     name="Expand All"
		     buttonStyle={"small"}
		     />
		  <WgButton
		     name="Sweep"
		     buttonStyle={"small"}
		     />
		  <WgButton
		     name="Render"
		     buttonStyle={"small"}
		     />
		  <WgButton
		     name="Render ×10"
		     buttonStyle={"small"}
		     />
		</div>
	      </div>


	      {/* Column 2 */}
	      <div className="column2">

		
		<div className="canvasControls">
		  {/* 1. The <input> for Motif Title*/}
		    <input className="plain-cell"
			   value={this.state.motf.name} 
			   onChange={event => {
			       // Change the Motif name...
			       this.handleEditingMotfChange({
				   name: {$set: event.target.value}
			       });
		      }}
		      />
		  canvasControls
		</div>


		
		<div className="canvasSection">
		  <div className="drawingTools">
		    drawingTools
		  </div>
		  <div className="canvas400">
		    canvas400
		  </div>
		</div>



		<WgTabbedBoxie
		   className="advancedFeatures"
		   tabbedBoxieStyle={"small"}
		   tabSelectedIndex={this.state.advancedFeaturesTabSelected}
		   // The function below is worth rewriting for every component instance
		   // it sets the specific state variable associated with the tab choice
		   onTabClick={ new_i => {
		       if (new_i === this.state.advancedFeaturesTabSelected){return;}
		       this.setState({
			   advancedFeaturesTabSelected: new_i
		       });
		   }}
		  items={
		      [
			  {
			      name: "Design mode",
			      renderJSX: ()=>{
				  return(
				      <div> [JSX content (Design mode)] <br/>
					Container class: "advancedFeatures"

				      </div>
				  );
			      }
			  },
			  {
			      name: "Macros",
			      renderJSX: ()=>{
				  return(
				      <div> [JSX content (Macros)] </div>
				  );
			      }
			  },
			  {
			      name: "Patterning Controls",
			      renderJSX: ()=>{
				  return(
				      <div> [JSX content (Patterning Controls)] </div>
				  );
			      }
			  },
			  {
			      name: "Embed Motif",
			      renderJSX: ()=>{
				  return(
				      <div> [JSX content (Embed Motif)] </div>
				  );
			      }
			  }
		      ]
		  }
		/>

		
		<div className="mainButtons">
		<WgButton
	    name="Cancel"
	    onClick={this.props.onCloseEditingMode.bind()}
		/>
		<WgButton
	    name="Done"
	    onClick={()=>{
		this.props.onSaveEdits(this.state.motf);
		this.props.onCloseEditingMode();
	    }}
		/>
		</div>


	      </div>
	    </div>

	);
    }
}

export default MainTab_MotfEdit;
