import React from 'react';

import WgMutexActionLink from '../Wg/WgMutexActionLink';

class MotfEdit_Section_CanvasControls extends React.PureComponent {
    
    render(){
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
			   currentValue: this.props.CC_UI.backgroundBTTW,
			   representedValuesArray: [0, 1, 2, 3]
		       }}
		       actions={[
			   {
			       name: "white",
			       cb: this.props.hofHandleUIchange_CC("backgroundBTTW", 0)
			   },{
			       name: "trans.1",
			       cb: this.props.hofHandleUIchange_CC("backgroundBTTW", 1)
			   },{
			       name: "trans.2",
			       cb: this.props.hofHandleUIchange_CC("backgroundBTTW", 2)
			   },{
			       name: "black",
			       cb: this.props.hofHandleUIchange_CC("backgroundBTTW", 3)
			   }
		       ]}
		       />

		</div>
		
		<div className="column2">
		  <WgMutexActionLink
		     name="Gridlines:"
		     className="gridlines"
		     equityTestingForEnabled={{
			 currentValue: this.props.CC_UI.gridlines,
			 representedValuesArray: [false, true]
		     }}
		     actions={[
			 {
			     name: "off",
			     cb: this.props.hofHandleUIchange_CC("gridlines", false)
			 },{
			     name: "on",
			     cb: this.props.hofHandleUIchange_CC("gridlines", true)
			 }
		     ]}
		     />
		  <WgMutexActionLink
		     name="Snap to Grid:"
		     className="snapToGrid"
		     equityTestingForEnabled={{
			 currentValue: this.props.CC_UI.snapToGrid,
			 representedValuesArray: [false, true]
		     }}
		     actions={[
			 {
			     name: "off",
			     cb: this.props.hofHandleUIchange_CC("snapToGrid", false)
			 },{
			     name: "on",
			     cb: this.props.hofHandleUIchange_CC("snapToGrid", true)
			 }
		     ]}
		     />
		  <WgMutexActionLink
		     name="Axes:"
		     className="axes"
		     equityTestingForEnabled={{
			 currentValue: this.props.CC_UI.axes,
			 representedValuesArray: [false, true]
		     }}
		     actions={[
			 {
			     name: "off",
			     cb: this.props.hofHandleUIchange_CC("axes", false)
			 },{
			     name: "on",
			     cb: this.props.hofHandleUIchange_CC("axes", true)
			 }
		     ]}
		     />
		</div>

		<div className="column3">
		  {JSON.stringify(this.props.CC_UI.mouseOverCanvas)}<br/>
		  {JSON.stringify(this.props.CC_UI.mouseCoords)}
		</div>

	    </div>
	    
	);
    }
}

export default MotfEdit_Section_CanvasControls;
