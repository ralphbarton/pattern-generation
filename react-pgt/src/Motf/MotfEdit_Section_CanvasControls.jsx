import React from 'react';

import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgDropDown from '../Wg/WgDropDown';

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
		  <WgMutexActionLink
		     name="Gridlines:"
		     className="gridlines"
		     equityTestingForEnabled={{
			 currentValue: UI.gridlines,
			 representedValuesArray: [false, true]
		     }}
		     actions={[
			 {
			     name: "off",
			     cb: setUI("gridlines", false)
			 },{
			     name: "on",
			     cb: setUI("gridlines", true)
			 }
		     ]}
		     />
		  <WgMutexActionLink
		     name="Snap to Grid:"
		     className="snapToGrid"
		     equityTestingForEnabled={{
			 currentValue: UI.snapToGrid,
			 representedValuesArray: [false, true]
		     }}
		     actions={[
			 {
			     name: "off",
			     cb: setUI("snapToGrid", false)
			 },{
			     name: "on",
			     cb: setUI("snapToGrid", true)
			 }
		     ]}
		     />
		  <WgMutexActionLink
		     name="Axes:"
		     className="axes"
		     equityTestingForEnabled={{
			 currentValue: UI.axes,
			 representedValuesArray: [false, true]
		     }}
		     actions={[
			 {
			     name: "off",
			     cb: setUI("axes", false)
			 },{
			     name: "on",
			     cb: setUI("axes", true)
			 }
		     ]}
		     />
		</div>

		<div className="column3">





		  <WgDropDown
		     name="Grid Settings"
		     className="gridSettings"// from line below, avoid crazy indent, add or delete    0}/>
		  content={
		  <div>
		    Grid System
		    <div className="btn-set">
		      <button onClick={setUI("gridSystem", "cartesian")}>Cartesian</button>
		      <button onClick={setUI("gridSystem", "polar")}>Polar</button>
		    </div>

		    Grid Size
		    <div className="btn-set">

		      <button onClick={setUI("gridSize", "s")}>
			Small
			<div className="c-note">{UI.gridSystem==="cartesian" ? "10px" : "25px, 15°"}</div>
		      </button>
		      
		      <button onClick={setUI("gridSize", "m")}>
			Medium
			<div className="c-note">{UI.gridSystem==="cartesian" ? "25px" : "50px, 45°"}</div>
		      </button>

		      <button onClick={setUI("gridSize", "l")}>
			Large
			<div className="c-note">{UI.gridSystem==="cartesian" ? "50px" : "100px, 95°"}</div>
		      </button>
		    </div>


		    <div>
		      Grid weight
		      <div className="btn-set">
			<button onClick={setUI("gridWeight", "faint")}>Faint</button>
			<button onClick={setUI("gridWeight", "normal")}>Normal</button>
			<button onClick={setUI("gridWeight", "strong")}>Strong</button>
		      </div>
		    </div>
		    <div>
		      Custom size
		      <div>
			<span className="i-note">{UI.gridSystem==="cartesian" ? "x-spacing" : "radius-incr"}: </span>
			<input className="plain-cell s"/>
		      </div>
		      <div>
			<span className="i-note">{UI.gridSystem==="cartesian" ? "y-spacing" : "angular-incr"}: </span>
			<input className="plain-cell s"/>
		      </div>
		      <button onClick={null}>Reset</button>
		    </div>
		  </div>
		  }
		  enabled={UI.gridlines}
		  ddStyle="plain"
		  />

		<WgDropDown
		   name="Snap Settings"
		   className="snapSettings"
		   content={
			   <div>
				 hello cat <br/>
				     hello doggie
			       </div>
			   }
			   enabled={UI.snapToGrid}
			   ddStyle="plain"
			   />
		  
		  {UI.mouseOverCanvas ? 
		      <div className="mouseCoords">
			    Mouse (x,y): (<span className="val">{UI.mouseCoords.x}</span>,
					  <span className="val">{UI.mouseCoords.y}</span>)
		   </div> : null }

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
