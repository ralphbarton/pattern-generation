import React from 'react';

import {select} from "d3-selection";
import "d3-selection-multi";

import Motf_util from './plain-js/Motf_util';
var _ = require('lodash');

class MotfEdit_Section_MotifCanvas_DTO extends React.PureComponent {

    constructor() {
	super();

	this.state = {
	    mouseDownX: null,
	    mouseDownY: null,
	    left: 0,
	    top: 0,
	    width: 0,
	    height: 0,
	    CTRLkey: false
	};

	this.handleMouseDown = this.handleMouseDown.bind(this);
	this.handleMouseUp   = this.handleMouseUp.bind(this);
	this.handleMouseMove = this.handleMouseMove.bind(this);
	this.handleKeyDown   = this.handleKeyDown.bind(this);
	this.handleKeyUp     = this.handleKeyUp.bind(this);
	
    }

    handleMouseDown(e){
	this.setState({
	    mouseDownX: e.pageX,
	    mouseDownY: e.pageY
	});
    }
    
    handleMouseUp(){

	if(this.props.MS_UI.mouseOverCanvas){
	    // 1. Save new shape to underlying Motif Data structure...
	    const boundingBox = _.pick(this.state, ["left", "top", "width", "height"]);
	    this.props.handleEditingMotfChange({Elements: {
		$push: [Motf_util.DatH_NewShape(boundingBox, this.props.DT_UI, this.props.Motf.Elements)]
	    }});

	    
	    // 2. Switch off Draw Tool (if necessary).
	    if(this.props.DT_UI.drawMany === false){
		this.props.handleMotfUIStateChange({
		    drawingTools: {shape: {$set: null}}
		});
		return; // don't bother setting state if just turned off..
	    }
	}

	this.setState({
	    mouseDownX: null,
	    mouseDownY: null,
	    width: 0,
	    height: 0
	});


    }

    handleMouseMove(e){
	if(this.state.mouseDownX === null){return;}

	const BB = this.props.MS_UI.canvBoundingBoxCoords;
	this.setState({
	    left: Math.min(e.pageX, this.state.mouseDownX) - BB.left,
	    top:  Math.min(e.pageY, this.state.mouseDownY) - BB.top,
	    width: Math.abs(e.pageX - this.state.mouseDownX),
	    height: Math.abs(e.pageY - this.state.mouseDownY)
	});
    }

    handleKeyDown(e){
	if(e.keyCode === 17){//control key
	    this.setState({CTRLkey: true});
	}
    }

    handleKeyUp(e){
	if(e.keyCode === 17){//control key
	    this.setState({CTRLkey: false});
	}
    }
    
    componentDidMount(){
	document.addEventListener('mousedown', this.handleMouseDown);
	document.addEventListener('mouseup',   this.handleMouseUp);
	document.addEventListener('mousemove', this.handleMouseMove);
	document.addEventListener("keydown",   this.handleKeyDown);
	document.addEventListener("keyup",     this.handleKeyUp);

	//add the rect to the SVG
	select(this.svgRef).append("rect");
    }

    componentWillUnmount() {
	document.removeEventListener('mousedown', this.handleMouseDown);
	document.removeEventListener('mouseup',   this.handleMouseUp);
	document.removeEventListener('mousemove', this.handleMouseMove);
	document.removeEventListener("keydown",   this.handleKeyDown);
	document.removeEventListener("keyup",     this.handleKeyUp);
    }


    componentDidUpdate(){
	
	// If mouse is not down hide the rectangle...
	if(this.state.mouseDownX === null){
	    select(this.svgRef).select("rect").attrs({display: "none"});
	    return;
	}

	const S = this.state;
	select(this.svgRef).select("rect").attrs({
	    display: "inline",
	    x: S.left - 0.5,
	    y: S.top - 0.5,
	    width: S.width,
	    height: S.height
	});

    }
    
    render(){
	
	return (
	    <svg
	       className="drawingToolOverlay"
	       width="399"
	       height="399"
	       ref={ (el) => {this.svgRef = el;}}
	       />
	);
    }
}

export default MotfEdit_Section_MotifCanvas_DTO;
