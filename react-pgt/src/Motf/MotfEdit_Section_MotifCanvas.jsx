import React from 'react';

import {fabric}  from 'fabric';
var _ = require('lodash');

//should I divide up this file into separate categories of function (better modularisation)
import Motf_util from './plain-js/Motf_util';
import MotfEdit_Section_MotifCanvas_BG from './MotfEdit_Section_MotifCanvas_BG';
import MotfEdit_Section_MotifCanvas_GD from './MotfEdit_Section_MotifCanvas_GD';


class MotfEdit_Section_MotifCanvas extends React.PureComponent {


    fabricCanvasRegen(){

	// 1. 'destroy' any pre-existing Fabric initialisation of the canvas
	if(this.canvas){
	    this.canvas.dispose();
	}

	// 2. (re-)initialisate as a blank Fabric canvas
	this.canvas = new fabric.Canvas(this.fabricCanvasElement);
	
	// 3. add all the objects
	const canvas = this.canvas;
	_.forEach(this.props.Motf.Elements, function(Properties, index) { // (value, key)
	    Motf_util.Fabric_AddShape(canvas, Properties);        // Add to Fabric Canvas
	});
    }

    shouldComponentUpdate(nextProps, nextState){
	// there is no point comparing whole objects:  nextProps !== this.props
	// {} !== {} evalutes true! So it will trigger re-render when there is no change.

	//detect change in 'CC_UI', excluding mouse based change...
	const c1 = nextProps.CC_UI !== this.props.CC_UI;// change in CC_UI object
	const c2 = nextProps.CC_UI.mouseCoords === this.props.CC_UI.mouseCoords; // test for NO CHANGE 
	const c3 = nextProps.CC_UI.mouseOverCanvas === this.props.CC_UI.mouseOverCanvas; // test for NO CHANGE 

	//Positively select props in which change will trigger rerender.
	return nextProps.Motf !== this.props.Motf || (c1 && c2 && c3);
    }
    
    
    componentDidUpdate(){
	this.fabricCanvasRegen();
    }

    componentDidMount(){
	this.fabricCanvasRegen();
    }
    
    render(){
	return (
	    <div className="MotfEdit_Section_MotifCanvas"
		 onMouseEnter={this.props.hofHandleUIchange_CC("mouseOverCanvas", true)}
		 onMouseLeave={this.props.hofHandleUIchange_CC("mouseOverCanvas", false)}

		 //this seems to break the contained Fabric Canvas...
		 onMouseMove={(e)=>{
		     const canvBoundingBox = e.target.getBoundingClientRect();
		     const canvX = e.pageX - canvBoundingBox.left - 200;
		     const canvY = e.pageY - canvBoundingBox.top - 200;

		     this.props.handleMotfUIStateChange({
			 canvasControls: {mouseCoords: {
			     x: {$set: canvX},
			     y: {$set: canvY}
			 }}
		     });

	      }}
	      >
	      <MotfEdit_Section_MotifCanvas_BG CC_UI={this.props.CC_UI}/>
	      <MotfEdit_Section_MotifCanvas_GD CC_UI={this.props.CC_UI}/>

	      <canvas
		 width="399"
		 height="399"
		 ref={ (el) => {this.fabricCanvasElement = el;}}
		/>
	    </div>
	);
    }
}

export default MotfEdit_Section_MotifCanvas;
