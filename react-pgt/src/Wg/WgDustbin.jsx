import React from 'react';

import imgDustbin   from './asset/dustbin-100.png';
import imgDuplicate from './asset/duplicate-icon-g.png';


function WgDustbin(props) {

    return (
	<img className="WgDustbin"
	     src={imgDustbin}
	     onClick={props.onClick}
	     alt=""/>
    );
}


function WgDuplicate(props) {

    return (
	<img className="WgDuplicate"
	     src={imgDuplicate}
	     onClick={props.onClick}
	     alt=""/>
    );
}

export {WgDustbin, WgDuplicate};
