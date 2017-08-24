import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import {WgMut2WayActionLink} from '../Wg/WgMutexActionLink';
import WgSpecialButton from '../Wg/WgSpecialButton';
import WgMiniColourPicker from '../Wg/WgMiniColourPicker';

// import image-icon assets...
import iconEllipse from './asset/shape-icon-ellipse.png';
import iconRect from './asset/shape-icon-rectangle.png';
import iconTriangle from './asset/shape-icon-triangle.png';
import iconHexagon from './asset/shape-icon-hexagon.png';
import iconLine from './asset/shape-icon-line.png';


const toastStrings = {
    "obj-ellipse":   ["Ellipse Tool",   "Hold CTRL to draw circle"],
    "obj-rectangle": ["Rectangle Tool", "Hold CTRL to draw square"],
    "obj-triangle":  ["Triangle Tool",  "Hold CTRL to draw equilateral triangle"],
    "obj-hexagon":   ["Hexagon Tool",   ""],
    "obj-line":      ["Line Tool",      ""]
};


class TogglingButton extends React.PureComponent {

    componentDidUpdate(prevProps, prevState){
	const isSelected =  this.props.buttonID     === this.props.selShape;
	const wasSelected = prevProps.buttonID === prevProps.selShape;

	if( !wasSelected && isSelected){
	    this.props.onToastMsg({
		title: toastStrings[this.props.buttonID][0],
		text: toastStrings[this.props.buttonID][1]
		// (further options...)
	    });
	}
    }
    
    render(){
	const isSelected = this.props.buttonID === this.props.selShape;
	return (
	    <WgSpecialButton
	       className={"mediumSquare" + (isSelected ? " selected" : "")}
	       img={this.props.img}
	       onClick={this.props.setUI("shape", isSelected ? null : this.props.buttonID)}
	       />
	);
    }
}


class MotfEdit_Section_DrawingTools extends React.PureComponent {

    // constructor is temporary
    constructor() {
	super();
	this.state = {};
    }
    
    render(){
	const UI = this.props.DT_UI;
	const selShape = this.props.DT_UI.shape;
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

		  <TogglingButton img={iconEllipse} buttonID={"obj-ellipse"}
				  selShape={selShape}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconRect} buttonID={"obj-rectangle"}
				  selShape={selShape}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconTriangle} buttonID={"obj-triangle"}
				  selShape={selShape}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconHexagon} buttonID={"obj-hexagon"}
				  selShape={selShape}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>

		  <TogglingButton img={iconLine} buttonID={"obj-line"}
				  selShape={selShape}
				  setUI={setUI}
				  onToastMsg={this.props.onToastMsg}/>
		  
		</div>

		<div className="colourPickers" style={{background: this.state.bg}}>
		  <WgMiniColourPicker className="fill" color="cyan"/>
		  <WgMiniColourPicker className="outl" color="blue" onMove={ x=>{this.setState({bg: x});}}/>
		</div>
		  
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_DrawingTools;
