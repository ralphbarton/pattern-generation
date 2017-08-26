import React from 'react';

class MotfEdit_Section_DrawingTools_LineTh extends React.PureComponent {
    
    render(){
	return (
	    <div className="LineTh">
	      <div className="button">
		<div className="text">Line</div>

		<svg width="30" height="15">
		  <line x1="0" y1="5.5" x2="30" y2="5.5" stroke="black" strokeWidth="4"/>
		</svg>
		
	      </div>
	    </div>
	);
    }
}

import withClickOut from './../withClickOut';
export default withClickOut(MotfEdit_Section_DrawingTools_LineTh);
