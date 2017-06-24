import React from 'react';

//import WgButton from '../Wg/WgButton';
import WgActionLink from '../Wg/WgActionLink';


function Plot_Popout(props) {

    return(
    	<div className="BeigeWindow">
	  Type: {props.popoutType}
	  <WgActionLink
	     name={"OK"}
	     onClick={props.handleClose}
	    enabled={true}
	    />

	</div>
    );

}

export default Plot_Popout;
