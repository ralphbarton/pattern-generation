import React from 'react';

import {fabric}  from 'fabric';
var _ = require('lodash');

//should I divide up this file into separate categories of function (better modularisation)
import Motf_util from './plain-js/Motf_util';


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

    componentDidUpdate(){
	    this.fabricCanvasRegen();
    }

    componentDidMount(){
	this.fabricCanvasRegen();
    }
    
    render(){
	return (
	    <div className="canvas400"
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
