import React from 'react';

// externally developed libraries
import update from 'immutability-helper';


// generic project widgets
import WgButton from '../Wg/WgButton';


import MotfEdit_Section_Parameters from './MotfEdit_Section_Parameters';
import MotfEdit_Section_Properties from './MotfEdit_Section_Properties';

import MotfEdit_Section_CanvasControls from './MotfEdit_Section_CanvasControls';
import MotfEdit_Section_DrawingTools from './MotfEdit_Section_DrawingTools';
import MotfEdit_Section_MotifCanvas from './MotfEdit_Section_MotifCanvas';
import MotfEdit_Section_AdvancedFeatures from './MotfEdit_Section_AdvancedFeatures';


/*
 import WgBoxie from '../Wg/WgBoxie';
 import WgActionLink from '../Wg/WgActionLink';

 import util from '.././plain-js/util'; // for lookup by uid
 */

class MainTab_MotfEdit extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    Motf: props.Motf,
	    UI: {
		canvasControls: {
		    backgroundBTTW: 0,
		    gridlines: false,
		    snapToGrid: false,
		    axes: false,
		    mouseOverCanvas: false,
		    mouseCoords: {x: 44, y: 44}
		}
	    }
	};
	
	this.handleEditingMotfChange = this.handleEditingMotfChange.bind(this);
	this.handleMotfUIStateChange = this.handleMotfUIStateChange.bind(this);
    }


    //This is copy-pasted from 'MainTab_CpotEdit.jsx' - is this an application for another HOC??
    handleEditingMotfChange($changesObj){
	this.setState({
	    Motf: update(this.state.Motf, $changesObj)
	});
    }

    handleMotfUIStateChange($changesObj){
	this.setState({
	    UI: update(this.state.UI, $changesObj)
	});
    }
    
    // This higher order Function may be partially applied, returning another higher order function.
    // This adds conciseness and hierarchical ordering
    //
    // Partially applied inside this Component
    // Fully applied in a child component at Component render time. At this point, a reguar handler function is returned.
    hofHandleMotfUIStateChange(UI_section, subkey, value){
	const TS = this;
	return function (){
	    TS.setState({
		UI: update(TS.state.UI, {
		    [UI_section]: {[subkey]: {$set: value}}
		})
	    });
	};
    };

    
    render(){
	return (

	    <div className="MainTab_MotfEdit">

	      {/* -------- Column 1 -------- */}
	      <div className="column1">

		
		{/* >> Parameters */}
		<MotfEdit_Section_Parameters
		   Motf={this.state.Motf}
		   />

		
		{/* >> Properties (and buttons underneath) */}
		<MotfEdit_Section_Properties
		   Motf={this.state.Motf}
		   />
		
	      </div>



	      {/* -------- Column 2 -------- */}
	      <div className="column2">


		{/* >> Canvas Controls */}
		<MotfEdit_Section_CanvasControls
		   Motf={this.state.Motf}
		   CC_UI={this.state.UI.canvasControls}
		   handleEditingMotfChange={this.handleEditingMotfChange}
		   hofHandleUIchange_CC={this.hofHandleMotfUIStateChange.bind(this, "canvasControls")}
		   />

		
		<div className="canvasSection">


		  {/* >> Drawing Tools */}
		  <MotfEdit_Section_DrawingTools
		     />


		  {/* >> Motif Canvas */}
		  <MotfEdit_Section_MotifCanvas
		     Motf={this.state.Motf}
		     hofHandleUIchange_CC={this.hofHandleMotfUIStateChange.bind(this, "canvasControls")}
		     handleMotfUIStateChange={this.handleMotfUIStateChange}
		     />
		</div>


		{/* >> Advanced Features */}
		<MotfEdit_Section_AdvancedFeatures
		   />

		
		<div className="mainButtons">
		  <WgButton
		     name="Cancel"
		     onClick={this.props.onCloseEditingMode.bind()}
		     />
		  <WgButton
		     name="Done"
		     onClick={()=>{
			 this.props.onSaveEdits(this.state.Motf);
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
