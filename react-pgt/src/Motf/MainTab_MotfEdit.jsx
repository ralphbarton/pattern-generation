import React from 'react';

// externally developed libraries
import update from 'immutability-helper';
var _ = require('lodash');

// generic project widgets
import {WgButton} from '../Wg/WgButton';


import MotfEdit_Section_Parameters from './MotfEdit_Section_Parameters';
import MotfEdit_Section_Properties from './MotfEdit_Section_Properties';

import MotfEdit_Section_CanvasControls from './MotfEdit_Section_CanvasControls';
import MotfEdit_Section_DrawingTools from './MotfEdit_Section_DrawingTools';
import MotfEdit_Section_MotifCanvas from './MotfEdit_Section_MotifCanvas';
import MotfEdit_Section_AdvancedFeatures from './MotfEdit_Section_AdvancedFeatures';

import Motf_util from './plain-js/Motf_util';
import Motf_lists from './plain-js/Motf_lists'; // used only for grid sizes
import Motf_FabricHandlers from './plain-js/Motf_FabricHandlers'; // this is getting messy now, but snap handlers are in here...

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
		    selectedMElemsUIDArr: [],
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


    // add keyboard listeners when component mounts
    componentDidMount(){
	const TS = this;
	this.props.kb.setKeyDownHandler(function(keyCode, keysState){

	    // Pick out these data and give abbreviated names...
	    const Motf = TS.state.Motf;
	    const Selection = TS.state.UI.fabricSelection.selectedMElemsUIDArr;
	    const ChangeBySelection = Motf_util.$ChgObj_ChangeMotfBySelection;
	    
	    //Delete key pressed...
	    if(keyCode === 46){

		//make the change in "one hit" of set state
		const $chg = ChangeBySelection(Motf, Selection, "delete");
		TS.setState({
		    Motf: update(Motf, $chg),
		    UI: update(TS.state.UI, {fabricSelection: {selectedMElemsUIDArr: {$set: []}}})//simply clear selection
		});

		return;
	    }

	    const C_sizes = Motf_lists.GridSizes.Cartesian.Dict;
	    const step = keysState.CTRL ? C_sizes[TS.state.UI.canvasControls.gridSize] : 1;
	    //This is really messy: I'm binding an external exported object externally to make the function work correctly!!
	    const roundToGrid = keysState.CTRL ? Motf_FabricHandlers.snapCoord.bind(Motf_FabricHandlers): x=>{return x;};

	    // if shift key is pressed, keys will change the size rather than the position
	    const dimention = keysState.SHIFT ? {x: "width", y: "height"} : {x: "left", y: "top"};

	    // "macro" to generate individual property change Object
	    const getMod = (xyStr, sign)=>{return {[dimention[xyStr]]: {$apply: x=>{return roundToGrid(x + sign * step);}}};};
	    
	    //an ARROW key pressed...
	    if((keyCode >= 37)&&(keyCode <= 40)){
		var $chg = {};
		if(keyCode === 37){ // left arrow 37
		    $chg = ChangeBySelection(Motf, Selection, getMod("x", -1));
		}else if(keyCode === 38){ // up arrow 38
		    $chg = ChangeBySelection(Motf, Selection, getMod("y", -1));
		}else if(keyCode === 39){ // right arrow 39
		    $chg = ChangeBySelection(Motf, Selection, getMod("x", +1));
		}else if(keyCode === 40){ // down arrow 40 
		    $chg = ChangeBySelection(Motf, Selection, getMod("y", +1));
		}

		//Apply a bunch of changes in one hit:
		TS.handleEditingMotfChange($chg);
	    }
	});
    }

    
    render(){
	console.log("MainTab_MotfEdit - render()");
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
		   FS_UI={this.state.UI.fabricSelection}
		   handleEditingMotfChange={this.handleEditingMotfChange} // canvas controls can change Motif Name!!
		   handleMotfUIStateChange={this.handleMotfUIStateChange} //needed to set multiple values at once
		   hofHandleUIchange_CC={this.hofHandleUIchange_CC}
		   />

		
		<div className="canvasSection">


		  {/* >> Drawing Tools */}
		  <MotfEdit_Section_DrawingTools
		     Motf={this.state.Motf}//extract colours from selected element...
		     DT_UI={this.state.UI.drawingTools}
		     FS_UI={this.state.UI.fabricSelection}
		     hofHandleUIchange_DT={this.hofHandleUIchange_DT} // action link
		     handleMotfUIStateChange={this.handleMotfUIStateChange} // set 'DT_UI.fill' etc. to a non-fixed colour
		     handleEditingMotfChange={this.handleEditingMotfChange} // set colour changes within Motif
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
