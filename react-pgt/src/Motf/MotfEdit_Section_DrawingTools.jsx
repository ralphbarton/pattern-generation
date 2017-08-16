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


function TogglingButton(props){
    const isSelected = props.buttonID === props.toolSelected;
    return (
	<WgSpecialButton
	   className={"mediumSquare" + (isSelected ? " selected" : "")}
	   img={props.img}
	   onClick={props.setUI("toolSelected", isSelected ? null : props.buttonID)}
	   />
    );
}


class MotfEdit_Section_DrawingTools extends React.PureComponent {
    
    render(){
	const toolSelected = this.props.DT_UI.toolSelected;
	const setUI = this.props.hofHandleUIchange_DT;

	return (
	    <WgBoxie className="drawingTools" name="Tools" boxieStyle={"small"} >

	      <WgMut2WayActionLink
		 name="Draw:"
		 variableName="drawMany"
		 actionNames={["one", "many"]}
		 value={null}
		 hofCB={  ()=>{return null;}    }/>

		<div className="basicShapes">

		  <TogglingButton setUI={setUI} img={iconEllipse}  buttonID={"ellipse"}   toolSelected={toolSelected} />
		  <TogglingButton setUI={setUI} img={iconRect}     buttonID={"rectangle"} toolSelected={toolSelected} />
		  <TogglingButton setUI={setUI} img={iconTriangle} buttonID={"triangle"}  toolSelected={toolSelected} />
		  <TogglingButton setUI={setUI} img={iconHexagon}  buttonID={"hexagon"}   toolSelected={toolSelected} />
		  <TogglingButton setUI={setUI} img={iconLine}     buttonID={"line"}      toolSelected={toolSelected} />

		</div>


		
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_DrawingTools;
