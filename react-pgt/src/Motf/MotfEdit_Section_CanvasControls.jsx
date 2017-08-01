import React from 'react';

import WgMutexActionLink from '../Wg/WgMutexActionLink';

class MotfEdit_Section_CanvasControls extends React.PureComponent {
    
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
		 initalEnabledArray={[false, false, false, false]}
		 actions={[
		     {
			 name: "white"
		     },{
			 name: "trans.1"
		     },{
			 name: "trans.2"
		     },{
			 name: "black"
		     }
		 ]}
		 />

	    </div>

	);
    }
}

export default MotfEdit_Section_CanvasControls;
