import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import {WgMut2WayActionLink} from '../Wg/WgMutexActionLink';
import WgSpecialButton from '../Wg/WgSpecialButton';

// import image-icon assets...
import iconEllipse from './asset/shape-icon-ellipse.png';
import iconRect from './asset/shape-icon-rectangle.png';
import iconTriangle from './asset/shape-icon-triangle.png';
import iconHexagon from './asset/shape-icon-hexagon.png';
import iconLine from './asset/shape-icon-line.png';


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

		<div className="basicShapes">

		  <WgSpecialButton
		     className="mediumSquare"
		     img={iconEllipse}
		     onClick={null}
		     />

		  <WgSpecialButton
		     className="mediumSquare"
		     img={iconRect}
		     onClick={null}
		     />

		  <WgSpecialButton
		     className="mediumSquare"
		     img={iconTriangle}
		     onClick={null}
		     />

		  <WgSpecialButton
		     className="mediumSquare"
		     img={iconHexagon}
		     onClick={null}
		     />

		  <WgSpecialButton
		     className="mediumSquare"
		     img={iconLine}
		     onClick={null}
		     />

		</div>


		
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_DrawingTools;
