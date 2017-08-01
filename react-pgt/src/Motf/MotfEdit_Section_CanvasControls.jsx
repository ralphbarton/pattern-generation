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

	);
    }
}

export default MotfEdit_Section_CanvasControls;
