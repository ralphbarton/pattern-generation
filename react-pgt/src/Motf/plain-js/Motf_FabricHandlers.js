import {fabric}  from 'fabric';
var _ = require('lodash');

import Motf_util from './Motf_util';

var Motf_FabricHandlers = {

    /* Functions are:
       - Show a Toast for single select & multi-select
       - 
    */
    handle_ObjectSelected: function(options) {

	const multiple = options.target._objects !== undefined;
	const onToastMsg = this.onToastMsg;
	
	if(multiple){
	    onToastMsg("Group selection...");
	}else{
	    onToastMsg("Use CTRL key to select additional objects.");
	}
    },

    
    /* Functions are:
       - Re-serialise entire motif & save
       - 
    */
    handle_ObjectModified: function(options) {

	const typeInterpret = function(type_str){
	    switch (type_str) {		
	    case "ellipse": return "obj-ellipse";
	    case "rect": return "obj-rectangle";
	    default: return "obj-unknown";
	    }
	};
	
	// "serialise" the entire Canvas contents...
	const DatH_Elements = this.canvas.getObjects().map(function(obj){
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
	this.handleEditingMotfChange({Elements: {$set: DatH_Elements}});
	
    },

    
    
    /* Functions are:
       - snapping position to grid
       - 
    */
    handle_ObjectMoving: function(options) {
	const UI = this.CC_UI;
	const gridSizePx = ({"small":10, "medium":25, "large":50})[UI.gridSize];
	const fObj = options.target;
	if(UI.snapToGrid){
	    if(UI.snapAxes.includes('x')){
		let snap = Math.round(options.target.left / gridSizePx) * gridSizePx;
		if(UI.shapeSnapOrigin === "TL2"){snap -= (fObj.strokeWidth || 0)/2;}// to 'ignore outline'
		fObj.setLeft(snap);
	    }
	    if(UI.snapAxes.includes('y')){
		let snap = Math.round(options.target.top / gridSizePx) * gridSizePx;
		if(UI.shapeSnapOrigin === "TL2"){snap -= (fObj.strokeWidth || 0)/2;}// to 'ignore outline'
		fObj.setTop(snap);
	    }
	}
    },

    //store copies of callback functions passed at Mount-time...
    onToastMsg: undefined,
    handleEditingMotfChange: undefined,    
    MountCanvas: function(fabricCanvasElement, Motf, ctxProps){

	// 1. Initialisate a blank Fabric canvas
	const canvas = new fabric.Canvas(fabricCanvasElement);
	this.canvas = canvas;
	this.onToastMsg = ctxProps.onToastMsg;
	this.handleEditingMotfChange = ctxProps.handleEditingMotfChange;
	
	// 2. Add Handler: Object:Selected
	canvas.on('object:selected', this.handle_ObjectSelected.bind(this));

	// 3. Add Handler: Object:Modified
	canvas.on('object:modified', this.handle_ObjectModified.bind(this));

	// 4. Add Handler: Object:Moving
	canvas.on('object:moving', this.handle_ObjectMoving.bind(this));
	
	// 5. having Mounted, add all objects for the first time...
	this.UpdateCanvas(Motf);
    },

    UpdateCanvas: function(Motf){
	const canvas = this.canvas;

	// 1. wipe all objects from the canvas
	canvas.clear();
	
	// 2. (re-)add all the objects
	_.forEach(Motf.Elements, function(Properties, index) { // (value, key)
	    Motf_util.Fabric_AddShape(canvas, Properties);        // Add to Fabric Canvas
	});
    },

    CC_UI: undefined,
    RecieveUpdate: function(CC_UI){
	this.CC_UI = CC_UI;
    }

};

export default Motf_FabricHandlers;
