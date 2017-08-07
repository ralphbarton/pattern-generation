import React from 'react';

import {WgMutexActionLink, WgMut2WayActionLink} from '../Wg/WgMutexActionLink';
import WgDropDown from '../Wg/WgDropDown';
import WgFadeTransition from '../Wg/WgFadeTransition';

class MotfEdit_Section_CanvasControls extends React.PureComponent {
    
    render(){
	const UI = this.props.CC_UI;
	const setUI = this.props.hofHandleUIchange_CC;
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
		    <button onClick={setUI("gridSystem", "cartesian")}>Cartesian</button>
		    <button onClick={setUI("gridSystem", "polar")}>Polar</button>
		  </div>

		  Grid Size
		  <div className="btn-set">

		    <button onClick={setUI("gridSize", "small")}>
		      Small
		      <div className="c-note">{UI.gridSystem==="cartesian" ? "10px" : "25px, 15°"}</div>
		    </button>
		    
		    <button onClick={setUI("gridSize", "medium")}>
		      Medium
		      <div className="c-note">{UI.gridSystem==="cartesian" ? "25px" : "50px, 45°"}</div>
		    </button>

		    <button onClick={setUI("gridSize", "large")}>
		      Large
		      <div className="c-note">{UI.gridSystem==="cartesian" ? "50px" : "100px, 95°"}</div>
		    </button>
		  </div>

		  Grid weight
		  <div className="btn-set">
		    <button onClick={setUI("gridWeight", "faint")}>Faint</button>
		    <button onClick={setUI("gridWeight", "normal")}>Normal</button>
		    <button onClick={setUI("gridWeight", "strong")}>Strong</button>
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
		      <button onClick={setUI("snapResponseStyle", "soft")}>Soft</button>
		      <button onClick={setUI("snapResponseStyle", "medium")}>Medium</button>
		      <button onClick={setUI("snapResponseStyle", "hard")}>Hard</button>
		    </div>

		    Shape Snap-Origin
		    <div className="btn-set shapeSnapOrigin">
		      <button onClick={setUI("shapeSnapOrigin", "TL1")}>Top-Left corner
			<div className="c-note">(outside outline)</div></button>
		      <button onClick={setUI("shapeSnapOrigin", "TL2")}>Top-Left corner
			<div className="c-note">(ignoring outline)</div></button>
		      <button onClick={setUI("shapeSnapOrigin", "center")}>Shape Center</button>
		    </div>

		    Snap on Axes
		    <div className="btn-set snapAxes">
		      <button onClick={setUI("snapAxes", "xy")}>x, y</button>
		      <button onClick={setUI("snapAxes", "x")}>x only</button>
		      <button onClick={setUI("snapAxes", "y")}>y only</button>
		    </div>
		  </WgDropDown>
		  


	        <WgFadeTransition speed={0}>
		  {UI.mouseOverCanvas &&
		      <div className="mouseCoords"> 
			    Mouse (x,y): (<span className="val">{UI.mouseCoords.x}</span>,
					  <span className="val">{UI.mouseCoords.y}</span>)
		   </div>
		  }
		</WgFadeTransition>
		
		  {/*
		  {JSON.stringify(UI.mouseOverCanvas)}<br/>
		  {JSON.stringify(UI.mouseCoords)}
		  */}
		  
		</div>

	    </div>
	    
	);
    }
}

export default MotfEdit_Section_CanvasControls;
