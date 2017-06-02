import React from 'react';

//import Grid_d3draw from './Grid/plain-js/Grid_d3draw';

class PGT_Background extends React.PureComponent {
    
    render() {
	const winW = window.innerWidth;
	const winH = window.innerHeight;
	console.log("PGT_Background render() called");
	return (
	    <div className="PGT_Background">
	      <svg style={{width:  winW, height:  winH, background: 'cyan',}}>
	      </svg>
	    </div>
	);
    }
}

export default PGT_Background;
