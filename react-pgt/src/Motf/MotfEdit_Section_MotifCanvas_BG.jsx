import React from 'react';

import {WgFadeTransition} from '../Wg/WgTransition';

import GimpTransparent from './asset/gimp-transparent.png';

class MotfEdit_Section_MotifCanvas_BG extends React.PureComponent {
    
    render(){

	const BWWT = this.props.CC_UI.backgroundBTTW;
	const plainColour = BWWT === 3 ? "black" : "white";
	
	return (
	    <div className="bgLayers400">
	      <div className="layer GimpTransparent" style={{backgroundImage: 'url(' + GimpTransparent + ')'}}>
	      </div>
	      <WgFadeTransition speed={0}>
		{BWWT !== 2 && <div className={`layer ${plainColour}`}></div>}
		{BWWT === 1 && <div className="layer chequer"></div>}
	      </WgFadeTransition>
	    </div>
	);
    }
}

export default MotfEdit_Section_MotifCanvas_BG;
