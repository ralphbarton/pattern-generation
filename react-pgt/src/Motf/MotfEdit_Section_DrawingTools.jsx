import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import {WgMut2WayActionLink} from '../Wg/WgMutexActionLink';

class MotfEdit_Section_DrawingTools extends React.PureComponent {
    
    render(){
	return (
	    <WgBoxie className="drawingTools" name="Tools" boxieStyle={"small"} >

	      <WgMut2WayActionLink
		 name="Draw:"
		 variableName="drawMany"
		 actionNames={["one", "many"]}
		 value={null}
		 hofCB={  ()=>{return null;}    }/>
	      
	      drawingTools

	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_DrawingTools;
