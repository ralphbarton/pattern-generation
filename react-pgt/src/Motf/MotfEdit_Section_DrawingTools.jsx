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


class TogglingButton extends React.PureComponent {

    componentDidUpdate(prevProps, prevState){
	const isSelected =  this.props.buttonID     === this.props.toolSelected;
	const wasSelected = prevProps.buttonID === prevProps.toolSelected;

	if( !wasSelected && isSelected){
	    this.props.onToastMsg({
		title: toastStrings[this.props.buttonID][0],
		text: toastStrings[this.props.buttonID][1]
		// (further options...)
	    });
	}
    }
    
    render(){
	const isSelected = this.props.buttonID === this.props.toolSelected;
	return (
	    <WgSpecialButton
	       className={"mediumSquare" + (isSelected ? " selected" : "")}
	       img={this.props.img}
	       onClick={this.props.setUI("toolSelected", isSelected ? null : this.props.buttonID)}
	       />
	);
    }
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
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconRect} buttonID={"rectangle"}
				  toolSelected={toolSelected}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconTriangle} buttonID={"triangle"}
				  toolSelected={toolSelected}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconHexagon} buttonID={"hexagon"}
				  toolSelected={toolSelected}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconLine} buttonID={"line"}
				  toolSelected={toolSelected}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>
		  
		</div>


		
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_DrawingTools;
