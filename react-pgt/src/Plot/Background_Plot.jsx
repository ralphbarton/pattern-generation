import React from 'react';

import util from '.././plain-js/util';


class Background_Plot extends React.PureComponent {

    
    render() {
	
	const plotUIState = this.props.plotUIState;
	console.log("<Background_Plot> render() called", plotUIState);
	
	const plotArray = this.props.plotArray;
	
	return (
	    <div className="Background_Plot">
	      {
		  JSON.stringify(plotUIState, null, 2)
	      }
	    </div>
	);
    }
}


export default Background_Plot;
