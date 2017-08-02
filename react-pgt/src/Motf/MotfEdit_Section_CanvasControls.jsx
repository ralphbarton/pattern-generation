import React from 'react';

import WgMutexActionLink from '../Wg/WgMutexActionLink';

class MotfEdit_Section_CanvasControls extends React.PureComponent {

    hofHandleUIchange(CC_key, value){
	return this.props.handleMotfUIStateChange.bind(null, {
	    canvasControls: {[CC_key]: {$set: value}}
	});
    };
    
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
			       cb: this.hofHandleUIchange("backgroundBTTW", 0)
			   },{
			       name: "trans.1",
			       cb: this.hofHandleUIchange("backgroundBTTW", 1)
			   },{
			       name: "trans.2",
			       cb: this.hofHandleUIchange("backgroundBTTW", 2)
			   },{
			       name: "black",
			       cb: this.hofHandleUIchange("backgroundBTTW", 3)
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
			     cb: this.hofHandleUIchange("gridlines", false)
			 },{
			     name: "on",
			     cb: this.hofHandleUIchange("gridlines", true)
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
			     cb: this.hofHandleUIchange("snapToGrid", false)
			 },{
			     name: "on",
			     cb: this.hofHandleUIchange("snapToGrid", true)
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
			     cb: this.hofHandleUIchange("axes", false)
			 },{
			     name: "on",
			     cb: this.hofHandleUIchange("axes", true)
			 }
		     ]}
		     />
		</div>

		<div className="column3">

		</div>

	    </div>
	    
	);
    }
}

export default MotfEdit_Section_CanvasControls;
