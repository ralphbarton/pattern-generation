import React from 'react';

import {fabric}  from 'fabric';
var _ = require('lodash');

//should I divide up this file into separate categories of function (better modularisation)
import Motf_util from './plain-js/Motf_util';
import MotfEdit_Section_MotifCanvas_BG from './MotfEdit_Section_MotifCanvas_BG';
import MotfEdit_Section_MotifCanvas_GD from './MotfEdit_Section_MotifCanvas_GD';


class MotfEdit_Section_MotifCanvas extends React.PureComponent {

    fabricCanvasMount(){

	// 1. Initialisate a blank Fabric canvas
	this.canvas = new fabric.Canvas(this.fabricCanvasElement);
	const canvas = this.canvas;

	// 2. Add a bunch of handlers...
	const onToastMsg = this.props.onToastMsg;
	canvas.on('object:selected', function(options) {

	    const multiple = options.target._objects !== undefined;

	    if(multiple){
		onToastMsg("Group selection...");
	    }else{
		onToastMsg("Use CTRL key to select additional objects.");
	    }
	});


	const typeInterpret = function(type_str){
	    switch (type_str) {		
	    case "ellipse": return "obj-ellipse";
	    case "rect": return "obj-rectangle";
	    default: return "obj-unknown";
	    }
	};

	const handleEditingMotfChange = this.props.handleEditingMotfChange;
	canvas.on('object:modified', function(options) {

	    // "serialise" the entire Canvas contents...
	    const DatH_Elements = canvas.getObjects().map(function(obj){
		return {
		    shape: typeInterpret(obj.type),
		    left: obj.left,
		    top: obj.top,
		    fill: obj.fill,
		    stroke: obj.stroke,
		    width: obj.width, //rect specific
		    height: obj.height, //rect specific
		    rx: obj.rx, // ellipse only
		    ry: obj.ry, // ellipse only

		    angle: obj.angle, // sometimes
		    strokeWidth: obj.strokeWidth, // sometimes

		    

		    PGTuid: obj.PGTuid
		    
		    // can this whole thing be a bit more programatic
		    // (e.g. a list of properties to copy, defined somewhere else and reused??)
		};		
	    });

	    // now save the updated contents...
//	    console.log("DatH_Elements", DatH_Elements);
	    handleEditingMotfChange({Elements: {$set: DatH_Elements}});
	    
	});
	
	// 3. having Mounted, add all objects for the first time...
	this.fabricCanvasUpdate();
    }

    fabricCanvasUpdate(){

	const canvas = this.canvas;

	// 1. wipe all objects from the canvas
	canvas.clear();

	// 2. (re-)add all the objects
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
	this.fabricCanvasUpdate();
    }

    componentDidMount(){
	this.fabricCanvasMount();
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
