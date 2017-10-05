import React from 'react';

import {select} from "d3-selection";
import "d3-selection-multi";

import Motf_util from './plain-js/Motf_util';
var _ = require('lodash');

import Motf_FabricHandlers from './plain-js/Motf_FabricHandlers'; // messy, as per <MainTab_MotfEdit>. Snap handlers in here...

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
	if(this.props.MS_UI.mouseOverCanvas){

	    const BB = this.props.MS_UI.canvBoundingBoxCoords;
	    
	    const isSnap = this.props.CC_UI.snapToGrid;
	    const roundToGrid = isSnap ? Motf_FabricHandlers.snapCoord.bind(Motf_FabricHandlers): x=>{return x;};

	    this.setState({
		mouseDownX: roundToGrid(e.pageX - BB.left),
		mouseDownY: roundToGrid(e.pageY - BB.top)
	    });
	}
    }
    
    handleMouseUp(){

	if(this.state.mouseDownX === null){return;}


	// 1. Save new shape to underlying Motif Data structure...
	const boundingBox = _.pick(this.state, ["left", "top", "width", "height"]);
	const isSignificantSize = boundingBox.width > 2 && boundingBox.height > 2;
	
	if(isSignificantSize){
	    const newMotifElement = Motf_util.DatH_NewShape(boundingBox, this.props.DT_UI, this.props.Motf.Elements);
	    this.props.handleEditingMotfChange({Elements: {
		$push: [newMotifElement]
	    }});

	    // 1.1 change the selection to the shape just drawn...
	    const cnt = this.props.FS_UI.notFabric_cngOrigin_count + 1;
	    this.props.handleMotfUIStateChange({
		fabricSelection: {
		    selectedMElemsUIDArr: {$set: [newMotifElement.PGTuid]},
		    notFabric_cngOrigin_count: {$set: cnt}
		}
	    });
	}
	
	// 2. Switch off Draw Tool (if necessary). Drawing shape of insignificant size (or just clicking) has this effect
	if(this.props.DT_UI.drawMany === false || !isSignificantSize){
	    this.props.handleMotfUIStateChange({
		drawingTools: {shape: {$set: null}}
	    });
	    return; // don't bother setting state if just turned off..
	}

	this.setState({
	    mouseDownX: null,
	    mouseDownY: null,
	    width: 0,
	    height: 0
	});


    }

    handleMouseMove(e){

	const BB = this.props.MS_UI.canvBoundingBoxCoords;
	const isSnap = this.props.CC_UI.snapToGrid;
	const roundToGrid = isSnap ? Motf_FabricHandlers.snapCoord.bind(Motf_FabricHandlers): x=>{return x;};
	
	const mouseMoveX = roundToGrid(e.pageX - BB.left);
	const mouseMoveY = roundToGrid(e.pageY - BB.top);
	
	// 1. mouse not down: just set current mouse coordinates
	if(this.state.mouseDownX === null){
	    
	    this.setState({
		left: mouseMoveX,
		top:  mouseMoveY
	    });
	    return;
	}

	// 2. mouse is down: calculate box coordinate details...
	const w = Math.abs(mouseMoveX - this.state.mouseDownX);
	const h = Math.abs(mouseMoveY - this.state.mouseDownY);
	const dim = (w+h)/2;

	const CTRL = this.props.kb.KeyHoldState.CTRL;
	const ww = CTRL ? dim : w;
	const hh = CTRL ? dim : h;
	
	this.setState({
	    left: this.state.mouseDownX + (mouseMoveX > this.state.mouseDownX ? 0 : -ww),
	    top:  this.state.mouseDownY + (mouseMoveY > this.state.mouseDownY ? 0 : -hh),
	    width: ww,
	    height: hh
	});
    }

    
    componentDidMount(){
	document.addEventListener('mousedown', this.handleMouseDown);
	document.addEventListener('mouseup',   this.handleMouseUp);
	document.addEventListener('mousemove', this.handleMouseMove);

	//add a rect & ellipse to the SVG. These will be modified a lot to show them...
	select(this.svgRef).append("rect");
	select(this.svgRef).append("ellipse");

	select(this.svgRef).append("circle").attr("r", 2); // this 'dot' will indicate start point snap
    }

    componentWillUnmount() {
	document.removeEventListener('mousedown', this.handleMouseDown);
	document.removeEventListener('mouseup',   this.handleMouseUp);
	document.removeEventListener('mousemove', this.handleMouseMove);
    }


    componentDidUpdate(){

	const S = this.state;
	
	// 1. If mouse is not down...
	if(this.state.mouseDownX === null){

	    // 1.1. hide rectangle & ellipse...
	    select(this.svgRef).select("rect").attrs({display: "none"});
	    select(this.svgRef).select("ellipse").attrs({display: "none"});

	    // 1.2. if snap-to-grid is active, show the snapping of the shape start-point with a dot...
	    if(this.props.CC_UI.snapToGrid){

		//show the dot snapped into place...
		select(this.svgRef).select("circle").attrs({
		    display: "inline",
		    cx: S.left,
		    cy: S.top
		});

	    }else{
		//hide the dot
		select(this.svgRef).select("circle").attrs({display: "none"});
	    }
	    
	    
	    return;
	}

	// 2. Otherwise, unconditionally put the rectangle at its correct place. This shape will always be shown...
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
	    fill: this.props.DT_UI.fill,
	    stroke: this.props.DT_UI.stroke,
	    "stroke-width": this.props.DT_UI.strokeWidth,
	    "stroke-dasharray": "none"
	};
	
	// 3. If its actually a rectangle being drawn, change its style accordingly
	if(this.props.DT_UI.shape === "obj-rectangle"){
	    d3_rect.styles(forgroundShapeStyle);
	    
	}else if(this.props.DT_UI.shape === "obj-ellipse"){

	    // keep a faint rect in the background...
	    d3_rect.styles( {
		"fill": undefined,
		"stroke": undefined,
		"stroke-width": undefined,
		"stroke-dasharray": undefined // undefined is to ensure the css style-sheet style is used
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


import withKeyboardEvents from './../withKeyboardEvents';
export default withKeyboardEvents(MotfEdit_Section_MotifCanvas_DTO, {withKeysHeldProp: true});
