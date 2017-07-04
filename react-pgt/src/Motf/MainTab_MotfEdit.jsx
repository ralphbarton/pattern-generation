import React from 'react';
var _ = require('lodash');

// generic project widgets
 import WgButton from '../Wg/WgButton';

/*
 import WgTable from '../Wg/WgTable';

 import WgBoxie from '../Wg/WgBoxie';


 import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
 import WgActionLink from '../Wg/WgActionLink';


 import Motf_util from './plain-js/Motf_util';
 import util from '.././plain-js/util'; // for lookup by uid
 */

class MainTab_MotfEdit extends React.PureComponent {


    render(){
	return (

	    <div className="MainTab_MotfEdit">

	      {/* Column 1 */}
	      <div className="column1">
		<div className="parameters">
		  params
		</div>

		<div className="properties">
		  properties interactive listing
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


	      {/* Column 2 */}
	      <div className="column2">

		
		<div className="canvasControls">
		  canvasControls
		</div>

		<div className="canvasSection">
		  <div className="drawingTools">
		    drawingTools
		  </div>
		  <div className="canvas400">
		    canvas400
		  </div>
		</div>

		<div className="advancedFeatures">
		  advancedFeatures
		</div>

		<div className="mainButtons">
		  mainButtons
		</div>


	      </div>
	    </div>

	);
    }
}

export default MainTab_MotfEdit;
