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


const toastStrings = {
    ellipse:   ["Ellipse Tool",   "Hold CTRL to draw circle"],
    rectangle: ["Rectangle Tool", "Hold CTRL to draw square"],
    triangle:  ["Triangle Tool",  "Hold CTRL to draw equilateral triangle"],
    hexagon:   ["Hexagon Tool",   ""],
    line:      ["Line Tool",      ""]
};

function TogglingButton(props){
    const isSelected = props.buttonID === props.toolSelected;

    const handleClick = function (){
	
	// 1. show toast
	props.onToastMsg(
	    {
		title: toastStrings[props.buttonID][0],
		text: toastStrings[props.buttonID][1]
		//		    type: "guidance"
		// (further options...)
	    }
	);

	// 2. State modify
	props.handleMotfUIStateChange({
	    drawingTools: {
		toolSelected: {$set: isSelected ? null : props.buttonID}
	    }
	});
    };
    
    return (
	<WgSpecialButton
	   className={"mediumSquare" + (isSelected ? " selected" : "")}
	   img={props.img}
	   onClick={handleClick}
	   />
    );
}


class MotfEdit_Section_DrawingTools extends React.PureComponent {
    
    render(){
	const UI = this.props.DT_UI;
	const toolSelected = this.props.DT_UI.toolSelected;
	const setUI = this.props.hofHandleUIchange_DT;
	
	return (
	    <WgBoxie className="drawingTools" name="Tools" boxieStyle={"small"} >

	      <WgMut2WayActionLink
		 name="Draw:"
		 variableName="drawMany"
		 actionNames={["one", "many"]}
		 value={UI.drawMany}
		 hofCB={setUI}/>

		<div className="basicShapes">

		  <TogglingButton img={iconEllipse} buttonID={"ellipse"}
				  toolSelected={toolSelected}
				  handleMotfUIStateChange={this.props.handleMotfUIStateChange}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconRect} buttonID={"rectangle"}
				  toolSelected={toolSelected}
				  handleMotfUIStateChange={this.props.handleMotfUIStateChange}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconTriangle} buttonID={"triangle"}
				  toolSelected={toolSelected}
				  handleMotfUIStateChange={this.props.handleMotfUIStateChange}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconHexagon} buttonID={"hexagon"}
				  toolSelected={toolSelected}
				  handleMotfUIStateChange={this.props.handleMotfUIStateChange}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconLine} buttonID={"line"}
				  toolSelected={toolSelected}
				  handleMotfUIStateChange={this.props.handleMotfUIStateChange}
				  onToastMsg={this.props.onToastMsg}/>
		  
		</div>


		
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_DrawingTools;
