import React from 'react';

import {WgButton} from '../Wg/WgButton';

class MotfEdit_Section_Properties extends React.PureComponent {
    
    render(){
	return (
	    <div>
	      <div className="properties">
		<div className="freezeHeading">
		  Motif Elements: Properties
		</div>
		<div className="scrollableContent">
		  lots of scrollable items here...
		  <div className="blob">
		    blob
		  </div>

		</div>
	      </div>

	      
	      <div className="propertiesButtons">
		<WgButton
		   name="Contract All"
		   buttonStyle={"small"}
		   />
		<WgButton
		   name="Expand All"
		   buttonStyle={"small"}
		   />
		<WgButton
		   name="Sweep"
		   buttonStyle={"small"}
		   />
		<WgButton
		   name="Render"
		   buttonStyle={"small"}
		   />
		<WgButton
		   name="Render ×10"
		   buttonStyle={"small"}
		   />
	      </div>
	    </div>
	);
    }
}

export default MotfEdit_Section_Properties;
