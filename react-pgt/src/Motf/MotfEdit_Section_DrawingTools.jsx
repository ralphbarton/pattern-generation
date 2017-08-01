import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';

class MotfEdit_Section_DrawingTools extends React.PureComponent {
    
    render(){
	return (
	    <WgBoxie className="drawingTools" name="Tools" boxieStyle={"small"} >

	      <WgMutexActionLink
		 name="Draw:"
		 className="drawOneMany"
		 initalEnabledArray={[false, false]}
		 actions={[
		     {
			 name: "one"
		     },{
			 name: "many"
		     }
		 ]}
		 />

	      drawingTools

	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_DrawingTools;
