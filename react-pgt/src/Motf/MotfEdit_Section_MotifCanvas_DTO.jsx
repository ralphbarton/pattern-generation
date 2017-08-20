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
	    const isSignificantSize = boundingBox.width > 2 && boundingBox.height > 2;
	    
	    if(isSignificantSize){
		this.props.handleEditingMotfChange({Elements: {
		    $push: [Motf_util.DatH_NewShape(boundingBox, this.props.DT_UI, this.props.Motf.Elements)]
		}});
	    }
	    
	    // 2. Switch off Draw Tool (if necessary). Drawing shape of insignificant size (or just clicking) has this effect
	    if(this.props.DT_UI.drawMany === false || !isSignificantSize){
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
	const CTRL = this.props.kb.KeyHoldState.CTRL;
	const w = Math.abs(e.pageX - this.state.mouseDownX);
	const h = Math.abs(e.pageY - this.state.mouseDownY);
	      
	this.setState({
	    left: Math.min(e.pageX, this.state.mouseDownX) - BB.left,
	    top:  Math.min(e.pageY, this.state.mouseDownY) - BB.top,
	    width: CTRL ? (w+h)/2 : w,
	    height: CTRL ? (w+h)/2 : h
	});
    }

    
    componentDidMount(){
	document.addEventListener('mousedown', this.handleMouseDown);
	document.addEventListener('mouseup',   this.handleMouseUp);
	document.addEventListener('mousemove', this.handleMouseMove);

	//add a rect & ellipse to the SVG. These will be modified a lot to show them...
	select(this.svgRef).append("rect");
	select(this.svgRef).append("ellipse");
    }

    componentWillUnmount() {
	document.removeEventListener('mousedown', this.handleMouseDown);
	document.removeEventListener('mouseup',   this.handleMouseUp);
	document.removeEventListener('mousemove', this.handleMouseMove);
    }


    componentDidUpdate(){
	
	// 1. If mouse is not down, hide rectangle & ellipse...
	if(this.state.mouseDownX === null){
	    select(this.svgRef).select("rect").attrs({display: "none"});
	    select(this.svgRef).select("ellipse").attrs({display: "none"});
	    return;
	}

	// 2. Otherwise, unconditionally put the rectangle at its correct place. This shape will always be shown...
	const S = this.state;
	const d3_rect = select(this.svgRef).select("rect");
	d3_rect.attrs({
	    display: "inline",
	    x: S.left - 0.5,
	    y: S.top - 0.5,
	    width: S.width,
	    height: S.height
	});


	// _.pick(E, ["fill", "stroke", "stroke-width"])// extract props programatically...
	const forgroundShapeStyle = {
	    fill: "yellow",
	    stroke: "red",
	    "stroke-width": 1,
	    "stroke-dasharray": [1]
	};
	
	// 3. If its actually a rectangle being drawn, change its style accordingly
	if(this.props.DT_UI.shape === "obj-rectangle"){
	    d3_rect.styles(forgroundShapeStyle);
	    
	}else if(this.props.DT_UI.shape === "obj-ellipse"){

	    // keep a faint rect in the background...
	    d3_rect.styles( {
		"fill": undefined,
		"stroke": undefined,
		"stroke-width": undefined
	    } );

	    // preview via the ellipse...
	    select(this.svgRef).select("ellipse").attrs({
		display: "inline",
		cx: (S.left + S.width/2),
		cy: (S.top + S.height/2),
		rx: (S.width/2),
		ry: (S.height/2)
	    }).styles(forgroundShapeStyle);

	}
	    

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


import withKeyHold from './../withKeyHold';
export default withKeyHold(MotfEdit_Section_MotifCanvas_DTO);
