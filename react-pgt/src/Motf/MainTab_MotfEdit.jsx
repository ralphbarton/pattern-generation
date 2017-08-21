import React from 'react';

// externally developed libraries
import update from 'immutability-helper';


// generic project widgets
import {WgButton} from '../Wg/WgButton';


import MotfEdit_Section_Parameters from './MotfEdit_Section_Parameters';
import MotfEdit_Section_Properties from './MotfEdit_Section_Properties';

import MotfEdit_Section_CanvasControls from './MotfEdit_Section_CanvasControls';
import MotfEdit_Section_DrawingTools from './MotfEdit_Section_DrawingTools';
import MotfEdit_Section_MotifCanvas from './MotfEdit_Section_MotifCanvas';
import MotfEdit_Section_AdvancedFeatures from './MotfEdit_Section_AdvancedFeatures';

var _ = require('lodash');

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
		mouseStatus: {
		    // Mouse Position / Status
		    mouseOverCanvas: false,
		    canvBoundingBoxCoords: {}
		},
		canvasControls: {
		    // 1. Direct State
		    backgroundBTTW: 0,
		    canvasCircular: false,
		    gridlines: true,
		    snapToGrid: false,
		    axes: true,
		    // 2. State contained in "Grid Settings" Dropdown
		    gridSystem: "cartesian",
		    gridSize: "medium",
		    gridWeight: "normal",
		    customXSpacing: 1,
		    customYSpacing: 1,
		    customRadiusIncr: 1,
		    customAngularIncr: 1,
		    // 3. State contained in "Snap Settings" Dropdown
		    snapResponseStyle: "medium",// "soft" / "medium" / "hard"
		    shapeSnapOrigin: "TL1",
		    /*
		     Top-Left corner (outside outline) = "TL1"
		     Top-Left corner (ignoring outline)  = "TL2"
		     ShapeCenter  = "center"
		     */
		    snapAxes: "xy" // x, y or x and y
		},
		fabricSelection: {
		    selectionUID: undefined,
		    chgOrigin_Properties_count: 0 // counter for changes originating in the Properties Section
		},
		drawingTools:{
		    drawMany: true,
		    shape: null,
		    strokeWidth: null,
		    stroke: "red",
		    fill: "yellow"
		}
	    }
	};
	
	this.handleEditingMotfChange = this.handleEditingMotfChange.bind(this);
	this.handleMotfUIStateChange = this.handleMotfUIStateChange.bind(this);
	this.hofHandleUIchange_CC    = this.hofHandleMotfUIStateChange.bind(this, "canvasControls");
	this.hofHandleUIchange_DT    = this.hofHandleMotfUIStateChange.bind(this, "drawingTools");

	this.editingMotifElemChangeElement = this.editingMotifElemChangeElement.bind(this);
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

    // Apply a modification to the Motif under editing.
    editingMotifElemChangeElement(prop, $chg){
	const selectionPGTuid = this.state.UI.fabricSelection.selectionUID;
	if(selectionPGTuid === undefined){return;}// no mutation required if no object selected.
	const mElem_index = _.findIndex(this.props.Motf.Elements, {PGTuid: selectionPGTuid} );	
	
	this.handleEditingMotfChange({
	    Elements: {
		[mElem_index]: {
		    [prop]: $chg
		}
	    }
	});
	/*	    
	 $push: [Motf_util.DatH_NewShape(boundingBox, this.props.DT_UI, this.props.Motf.Elements)]
	 }});*/
    }

    // add keyboard listeners when component mounts
    componentDidMount(){
	const TS = this;
	this.props.kb.setKeyDownHandler(function(keyCode){

	    //Delete key pressed...
	    if(keyCode === 46){
		/*
		 this.ActUponFabricSelection(function(fObj, uid){
		 motifs_edit.deleteMotifElement(uid);
		 }, {
		 groupDiscard: true
		 });*/
		return;
	    }

	    //an ARROW key pressed...
	    if((keyCode >= 37)&&(keyCode <= 40)){
		if(keyCode === 37){ // left arrow 37
		    TS.editingMotifElemChangeElement("left", {$apply: x=>{return x-1;}});
		}else if(keyCode === 38){ // up arrow 38
		    TS.editingMotifElemChangeElement("top", {$apply: x=>{return x-1;}});
		}else if(keyCode === 39){ // right arrow 39
		    TS.editingMotifElemChangeElement("left", {$apply: x=>{return x+1;}});
		}else if(keyCode === 40){ // down arrow 40 
		    TS.editingMotifElemChangeElement("top", {$apply: x=>{return x+1;}});
		}
	    }
	});
    }
    
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
		   handleEditingMotfChange={this.handleEditingMotfChange} // e.g. to delete a Motif Element
		   handleMotfUIStateChange={this.handleMotfUIStateChange} // so that selected item on canvas can be changed.
		   FS_UI={this.state.UI.fabricSelection}
		   />
		
	      </div>



	      {/* -------- Column 2 -------- */}
	      <div className="column2">


		{/* >> Canvas Controls */}
		<MotfEdit_Section_CanvasControls
		   Motf={this.state.Motf}
		   CC_UI={this.state.UI.canvasControls}
		   MS_UI={this.state.UI.mouseStatus}
		   handleEditingMotfChange={this.handleEditingMotfChange} // canvas controls can change Motif Name!!
		   handleMotfUIStateChange={this.handleMotfUIStateChange} //needed to set multiple values at once
		   hofHandleUIchange_CC={this.hofHandleUIchange_CC}
		   />

		
		<div className="canvasSection">


		  {/* >> Drawing Tools */}
		  <MotfEdit_Section_DrawingTools
		     DT_UI={this.state.UI.drawingTools}
		     hofHandleUIchange_DT={this.hofHandleUIchange_DT} // action link
		     onToastMsg={this.props.onToastMsg}
		     />


		  {/* >> Motif Canvas */}
		  <MotfEdit_Section_MotifCanvas
		     Motf={this.state.Motf}
		     CC_UI={this.state.UI.canvasControls}
		     FS_UI={this.state.UI.fabricSelection}
		     DT_UI={this.state.UI.drawingTools}
		     MS_UI={this.state.UI.mouseStatus}
		     handleEditingMotfChange={this.handleEditingMotfChange}
		     handleMotfUIStateChange={this.handleMotfUIStateChange}// Set: motif Bounding box, Fabric selection UID...
		     onToastMsg={this.props.onToastMsg}
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

import withKeyboardEvents from './../withKeyboardEvents';
export default withKeyboardEvents(MainTab_MotfEdit, {withKeysHeldProp: false});
