import React from 'react';

import {WgMutexActionLink, WgMut2WayActionLink} from '../Wg/WgMutexActionLink';
import WgDropDown from '../Wg/WgDropDown';
import {WgButton2} from '../Wg/WgButton';
import WgFadeTransition from '../Wg/WgFadeTransition';

import Motf_lists from './plain-js/Motf_lists'; // used only for grid sizes

class MotfEdit_sub_mCoords extends React.PureComponent {

    constructor() {
	super();
	this.state = {};
	this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    handleMouseMove(e){
	this.setState({
	    mouseX: e.pageX,
	    mouseY: e.pageY
	});
    }
    
    componentWillMount()   { document.addEventListener('mousemove', this.handleMouseMove);    }

    componentWillUnmount() { document.removeEventListener('mousemove', this.handleMouseMove); }

    render(){
	const canvBox = this.props.MS_UI.canvBoundingBoxCoords;
	if(!canvBox || isNaN(this.state.mouseX)){return null;}
	return(
	    <div className="mouseCoords"> 
	      Mouse (x,y): (<span className="val">{this.state.mouseX - canvBox.left -200}</span>,
			    <span className="val">{this.state.mouseY - canvBox.top -200}</span>)
	    </div>
	);
    }
}





class MotfEdit_Section_CanvasControls extends React.PureComponent {
    
    render(){
	const UI = this.props.CC_UI;
	const setUI = this.props.hofHandleUIchange_CC;
	const CartesianSizes = Motf_lists.GridSizes.Cartesian.Arr;
	const selection_size = this.props.FS_UI.selectedMElemsUIDArr.length;//quantity of Items selected on-Canvas
	return (
	    <div className="canvasControls">
	      {/* 1. The <input> for Motif Title*/}
		<div className="column1">
		  <input className="plain-cell"
			 value={this.props.Motf.name} 
			 onChange={event => {
			     // Change the Motif name...
			     this.props.handleEditingMotfChange({
				 name: {$set: event.target.value}
			     });
		    }}
		    />

		    <WgMut2WayActionLink
		       name="Canvas Shape:"
		       variableName="canvasCircular"
		       actionNames={["square", "circle"]}
		       value={UI.canvasCircular}
		       hofCB={setUI}/>
		    
		    <WgMutexActionLink
		       name="Background:"
		       className="backgroundBTTW"
		       equityTestingForEnabled={{
			   currentValue: UI.backgroundBTTW,
			   representedValuesArray: [0, 1, 2, 3]
		       }}
		       actions={[
			   {
			       name: "white",
			       cb: setUI("backgroundBTTW", 0)
			   },{
			       name: "trans.1",
			       cb: setUI("backgroundBTTW", 1)
			   },{
			       name: "trans.2",
			       cb: setUI("backgroundBTTW", 2)
			   },{
			       name: "black",
			       cb: setUI("backgroundBTTW", 3)
			   }
		       ]}
		       />
		    
		</div>
		
		<div className="column2">

		  <WgMut2WayActionLink
		     name="Gridlines:"
		     variableName="gridlines"
		     value={UI.gridlines}
		     hofCB={setUI}/>

		  <WgMut2WayActionLink
		     name="Snap to Grid:"
		     variableName="snapToGrid"
		     value={UI.snapToGrid}
		     hofCB={setUI}/>

		  <WgMut2WayActionLink
		     name="Axes:"
		     variableName="axes"
		     value={UI.axes}
		     hofCB={setUI}/>

		</div>

		<div className="column3">



		  <WgDropDown
		     name="Grid Settings"
		     className="gridSettings"// from line below, avoid crazy indent, add or delete    0}/>
		  enabled={UI.gridlines}
		  ddStyle="plain">

		  Grid System
		  <div className="btn-set">
		    <WgButton2 dot={UI.gridSystem==="cartesian"} onClick={setUI("gridSystem", "cartesian")}>Cartesian</WgButton2>
		    <WgButton2 dot={UI.gridSystem==="polar"} onClick={setUI("gridSystem", "polar")}>Polar</WgButton2>
		  </div>

		  Grid Size
		  <div className="btn-set">

		    <WgButton2 dot={UI.gridSize==="small"} onClick={setUI("gridSize", "small")}>
		      Small
		      <div className="c-note">{UI.gridSystem==="cartesian" ? (CartesianSizes[0]+"px") : "25px, 15°"}</div>
		    </WgButton2>
		    
		    <WgButton2 dot={UI.gridSize==="medium"} onClick={setUI("gridSize", "medium")}>
		      Medium
		      <div className="c-note">{UI.gridSystem==="cartesian" ? (CartesianSizes[1]+"px") : "50px, 45°"}</div>
		    </WgButton2>

		    <WgButton2 dot={UI.gridSize==="large"} onClick={setUI("gridSize", "large")}>
		      Large
		      <div className="c-note">{UI.gridSystem==="cartesian" ? (CartesianSizes[2]+"px") : "100px, 90°"}</div>
		    </WgButton2>
		  </div>

		  Grid weight
		  <div className="btn-set">
		    <WgButton2 dot={UI.gridWeight==="faint"} onClick={setUI("gridWeight", "faint")}>Faint</WgButton2>
		    <WgButton2 dot={UI.gridWeight==="normal"} onClick={setUI("gridWeight", "normal")}>Normal</WgButton2>
		    <WgButton2 dot={UI.gridWeight==="strong"} onClick={setUI("gridWeight", "strong")}>Strong</WgButton2>
		  </div>

		  <div className="customSize">
		    Custom size
		    <div>
		      <span className="i-note">{UI.gridSystem==="cartesian" ? "x-spacing" : "radius-incr"}: </span>
		      <input className="plain-cell s"/>
		    </div>
		    <div>
		      <span className="i-note">{UI.gridSystem==="cartesian" ? "y-spacing" : "angular-incr"}: </span>
		      <input className="plain-cell s"/>
		    </div>
		  </div>		    

		  <div className="btn-set">
		    <button onClick={()=>{
			  this.props.handleMotfUIStateChange({
			      canvasControls: {
				  // State contained in "Grid Settings" Dropdown
				  gridSystem: {$set: "cartesian"},
				  gridSize: {$set: "medium"},
				  gridWeight: {$set: "normal"},
				  customXSpacing: {$set: 1},
				  customYSpacing: {$set: 1},
				  customRadiusIncr: {$set: 1},
				  customAngularIncr: {$set: 1}
			      }
			  });
		      }}>
		      Reset
		    </button>
		  </div>
                  </WgDropDown>

		  <WgDropDown
		     name="Snap Settings"
		     className="snapSettings"
		     enabled={UI.snapToGrid}
		     ddStyle="plain">
		    
		    Snap Response Style
		    <div className="btn-set">
		      <WgButton2 dot={UI.snapResponseStyle==="soft"} onClick={setUI("snapResponseStyle", "soft")}>
			Soft</WgButton2>
		      <WgButton2 dot={UI.snapResponseStyle==="medium"} onClick={setUI("snapResponseStyle", "medium")}>
			Medium</WgButton2>
		      <WgButton2 dot={UI.snapResponseStyle==="hard"} onClick={setUI("snapResponseStyle", "hard")}>
			Hard</WgButton2>
		    </div>

		    Shape Snap-Origin
		    <div className="btn-set shapeSnapOrigin">
		      <WgButton2 dot={UI.shapeSnapOrigin==="TL1"} onClick={setUI("shapeSnapOrigin", "TL1")}>Top-Left corner
			<div className="c-note">(outside outline)</div></WgButton2>
		      <WgButton2 dot={UI.shapeSnapOrigin==="TL2"} onClick={setUI("shapeSnapOrigin", "TL2")}>Top-Left corner
			<div className="c-note">(ignoring outline)</div></WgButton2>
		      <WgButton2 dot={UI.shapeSnapOrigin==="center"} onClick={setUI("shapeSnapOrigin", "center")}>Shape Center
		      </WgButton2>
		    </div>

		    Snap on Axes
		    <div className="btn-set snapAxes">
		      <WgButton2 dot={UI.snapAxes==="xy"} onClick={setUI("snapAxes", "xy")}>x, y</WgButton2>
		      <WgButton2 dot={UI.snapAxes==="x"} onClick={setUI("snapAxes", "x")}>x only</WgButton2>
		      <WgButton2 dot={UI.snapAxes==="y"} onClick={setUI("snapAxes", "y")}>y only</WgButton2>
		    </div>
		  </WgDropDown>


		  <WgDropDown
		     name="Object Origin"
		     className="objectOrigin"
		     ddStyle="plain">
		    AAA
		  </WgDropDown>
		    
		  {/* Mouse Coordinates */}
		  {selection_size > 0 &&
		      <div className={"selection-comment" + (selection_size>1 ? " multi" : "")}>
			    Selected: {selection_size}
		      </div>
		  }
		    
		  {/* Mouse Coordinates */}
	          <WgFadeTransition speed={0}>
		    {this.props.MS_UI.mouseOverCanvas && <MotfEdit_sub_mCoords MS_UI={this.props.MS_UI}/>}
		  </WgFadeTransition>
		  
		</div>

	    </div>
	    
	);
    }
}


export default MotfEdit_Section_CanvasControls;
