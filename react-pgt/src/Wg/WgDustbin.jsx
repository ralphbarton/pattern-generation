import React from 'react';

import imgDustbin from './asset/dustbin-100.png';

function WgDustbin(props) {

    return (
	<img className="WgDustbin"
	     src={imgDustbin}
	     onClick={props.onClick}
	     alt=""/>
    );
}


export default WgDustbin;
