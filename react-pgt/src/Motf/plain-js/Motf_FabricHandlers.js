import {fabric}  from 'fabric';
var _ = require('lodash');

import Motf_util from './Motf_util';
import Motf_lists from './Motf_lists';

var Motf_FabricHandlers = {

    /* Functions are:
       - Show a Toast for single select & multi-select
       - 
    */
    plainState: {},
    
    handle_ObjectSelected: function(options) {

	const selectionChg = options.target.PGTuid !== this.plainState.prevSelectionID;
	this.plainState.prevSelectionID = options.target.PGTuid;
	
	const multiple = options.target._objects !== undefined;
	const onToastMsg = this.onToastMsg;
	
	if(multiple){
	    onToastMsg("Multiple Motif Elements selected...");
	}else{
	    if(selectionChg){ onToastMsg("Motif element selected. Use CTRL+click to add further objects to selection"); }

	    //store UID of selection...
	    this.handleMotfUIStateChange(
		{fabricSelection: {selectionUID: {$set: options.target.PGTuid}}}
	    );
	}
    },

    
    /* Functions are:
       - Re-serialise entire motif & save
       - 
    */
    handle_ObjectModified: function(options) {

	const Rnd = function (x){return _.round(x, 1);};
	
	// "serialise" the entire Canvas contents...
	const DatH_Elements = this.canvas.getObjects().map(function(obj){

	    // convert Fabrif JS type name into DatH type name.
	    const ShapeDetails = _.find(Motf_lists.ObjectTypes, {fabricObjType: obj.type} );
	    const absorb = ShapeDetails.scaleAbsorb;
	    
	    if(obj.scaleX !== 1){
		obj[absorb.scaleX] *= obj.scaleX;
	    }
	    if(obj.scaleY !== 1){
		obj[absorb.scaleY] *= obj.scaleY;
	    }
	    
	    return {
		shape:  ShapeDetails.DatH_name,
		left:   Rnd(obj.left),
		top:    Rnd(obj.top),
		fill:   obj.fill,
		stroke: obj.stroke,
		width:  Rnd(obj.width), //rect specific
		height: Rnd(obj.height), //rect specific
		rx:     Rnd(obj.rx), // ellipse only
		ry:     Rnd(obj.ry), // ellipse only

		angle:  Rnd(obj.angle), // sometimes
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

    /* Functions are:
       - clear UI state relating to selected item<
       - 
    */
    handle_SelectionCleared: function(options) {
	this.handleMotfUIStateChange(
	    {fabricSelection: {selectionUID: {$set: undefined}}}
	);
    },
    
    //store copies of callback functions passed at Mount-time...
    onToastMsg: undefined,
    handleEditingMotfChange: undefined,    
    handleMotfUIStateChange: undefined,
    MountCanvas: function(fabricCanvasElement, Motf, ctxProps){

	// 1. Initialisate a blank Fabric canvas
	const canvas = new fabric.Canvas(fabricCanvasElement);
	this.canvas = canvas;
	this.onToastMsg = ctxProps.onToastMsg;
	this.handleEditingMotfChange = ctxProps.handleEditingMotfChange;
	this.handleMotfUIStateChange = ctxProps.handleMotfUIStateChange;
	
	// 2. Add Handler: Object:Selected
	canvas.on('object:selected', this.handle_ObjectSelected.bind(this));

	// 3. Add Handler: Object:Modified
	canvas.on('object:modified', this.handle_ObjectModified.bind(this));

	// 4. Add Handler: Object:Moving
	canvas.on('object:moving', this.handle_ObjectMoving.bind(this));

	// 5. Add Handler: Selection:Cleared
	canvas.on('selection:cleared', this.handle_SelectionCleared.bind(this));
	
	// 6. having Mounted, add all objects for the first time...
	this.UpdateCanvas(Motf);
    },

    UnmountCanvas: function(){
	const canvas = this.canvas;
	canvas.dispose()
    },
    
    UpdateCanvas: function(Motf, selectionUID){
	const canvas = this.canvas;

	// 1. wipe all objects from the canvas
	canvas.clear();
	
	// 2. (re-)add all the objects
	_.forEach(Motf.Elements, function(Properties, index) { // (value, key)
	    Motf_util.Fabric_AddShape(canvas, Properties);        // Add to Fabric Canvas
	});

	const selected_fObj = _.find(canvas.getObjects(), function(o) { return o.PGTuid === selectionUID;});
	if(selected_fObj){canvas.setActiveObject(selected_fObj);}
	
    },

    CC_UI: undefined,
    RecieveUpdate: function(CC_UI){
	this.CC_UI = CC_UI;
    }

};

export default Motf_FabricHandlers;
