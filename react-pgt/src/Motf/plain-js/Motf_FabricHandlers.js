import {fabric}  from 'fabric';
var _ = require('lodash');

import Motf_util from './Motf_util';
import Motf_lists from './Motf_lists'; // used only for grid sizes

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
	    onToastMsg({
		title: "Multiple elements selected",
		text: "(note: the software doesn't yet handle multiple object selections...)",
		type: "guidance",
		diplayDuration: 1.5,
		minPeriod: 15,
		maxShows: 5
	    });
	}else{
	    if(selectionChg){
		onToastMsg({
		    title: "Element selected",
		    text: "Use CTRL+click to add further objects to selection.",
		    type: "guidance",
		    diplayDuration: 1.5,
		    minPeriod: 15,
		    maxShows: 5
		});
	    }
	}

	//store UID of selection...
	const S = options.target;
	const uidArr = multiple ? _.map( S._objects, 'PGTuid') : [S.PGTuid];
	this.handleMotfUIStateChange(
	    {fabricSelection: {selectionUID: {$set: uidArr}}}
	);
    },

    
    /* Functions are:
       - Re-serialise entire motif & save
       - 
    */
    handle_ObjectModified: function(options) {

	/*
	  perhaps an improvement here would be to target the update at only the Modified Element??
	  is the PGTuid of this available via options?
	 */
	
	// "serialise" the entire Canvas contents...
	const DatH_Elements = this.canvas.getObjects().map(Motf_util.fObj_to_DatH);

	// now save the updated contents...
	this.handleEditingMotfChange({Elements: {$set: DatH_Elements}});
	
    },

    
    
    /* Functions are:
       - snapping position to grid
       - 
    */

    snapCoord: function(u_raw, strokeWidth) {
	const UI = this.CC_UI;
	const gridSizePx = Motf_lists.GridSizes.Cartesian.Dict[UI.gridSize];//this assumes x- and y- grids have same spacing

	let u_snapped = Math.round(u_raw / gridSizePx) * gridSizePx;
	if(UI.shapeSnapOrigin === "TL2"){u_snapped -= (strokeWidth || 0)/2;}// to 'ignore outline'
	return u_snapped;
    },
    
    handle_ObjectMoving: function(options) {
	const UI = this.CC_UI;
	const fObj = options.target;
	if(UI.snapToGrid){
	    if(UI.snapAxes.includes('x')){ fObj.setLeft( this.snapCoord(options.target.left, fObj.strokeWidth) ); }
	    if(UI.snapAxes.includes('y')){ fObj.setTop(  this.snapCoord(options.target.top,  fObj.strokeWidth) ); }
	}
    },

    /* Functions are:
       - clear UI state relating to selected item<
       - 
    */
    handle_SelectionCleared: function(options) {
	this.handleMotfUIStateChange(
	    {fabricSelection: {selectionUID: {$set: []}}}
	);
    },


    /* This HOF is exclusively for setting:
       "this.canvas.uniScaleTransform" in response to the CTRL key...
    */
    hofHandle_keyEvent_CTRL: function(isDown){
	return function(e){
	    if(e.keyCode === 17){ this.canvas.uniScaleTransform = !isDown; }
	};
    },
    

    //store copies of callback functions passed at Mount-time...
    onToastMsg: undefined,
    handleEditingMotfChange: undefined,    
    handleMotfUIStateChange: undefined,
    MountCanvas: function(options){

	// 1. Initialisate a blank Fabric canvas
	const canvas = new fabric.Canvas(options.fabricCanvasElement);
	this.canvas = canvas;
	this.onToastMsg = options.onToastMsg;
	this.handleEditingMotfChange = options.handleEditingMotfChange;
	this.handleMotfUIStateChange = options.handleMotfUIStateChange;
	
	// 2. Add Handler: Object:Selected
	canvas.on('object:selected', this.handle_ObjectSelected.bind(this));

	// 3. Add Handler: Object:Modified
	canvas.on('object:modified', this.handle_ObjectModified.bind(this));

	// 4. Add Handler: Object:Moving
	canvas.on('object:moving', this.handle_ObjectMoving.bind(this));

	// 5. Add Handler: Selection:Cleared
	canvas.on('selection:cleared', this.handle_SelectionCleared.bind(this));
	
	// 6. having Mounted, add all objects for the first time...
	this.UpdateCanvas(options.Motf);

	// 7. No aspect ratio locking by default
	// ('true' is required to DISABLE the locked aspect ratio scaling when dragging corner-points)
	this.canvas.uniScaleTransform = true;

	this.handle_keyDown_CTRL = this.hofHandle_keyEvent_CTRL(true).bind(this);
	this.handle_keyUp_CTRL   = this.hofHandle_keyEvent_CTRL(false).bind(this);
	document.addEventListener("keydown",   this.handle_keyDown_CTRL);
	document.addEventListener("keyup",     this.handle_keyUp_CTRL);

	// 8. changes "selection key from Shift (default) to CTRL
	// (note: I also modified the Fabric Library to achieve this (7-Aug-17). Does this achieve the same effect)
	canvas.selectionKey = "ctrlKey";
	
    },

    UnmountCanvas: function(){
	const canvas = this.canvas;
	canvas.dispose();

	//remove listeners for CTRL key
	document.removeEventListener("keydown",   this.handle_keyDown_CTRL);
	document.removeEventListener("keyup",     this.handle_keyUp_CTRL);
    },
    
    UpdateCanvas: function(Motf, selectionUID){
	const canvas = this.canvas;

	console.log("UpdateCanvas - occured");
	
	// 1. wipe all objects from the canvas
	canvas.clear();
	
	// 2. (re-)add all the objects
	_.forEach(Motf.Elements, function(Properties, index) { // (value, key)
	    Motf_util.Fabric_AddShape(canvas, Properties);        // Add to Fabric Canvas
	});

	// 3. set the correct canvas selection	
	if(!selectionUID){return;}// nothing selected -> skip step 3...

	if(selectionUID.length === 1){//single selection
	    const selected_fObj = _.find(canvas.getObjects(), {PGTuid: selectionUID[0]});
	    canvas.setActiveObject(selected_fObj);

	}else if(selectionUID.length >= 1){//multi-selection
	    const items = canvas.getObjects();
	    const group = new fabric.Group();
	    group.canvas = canvas;
	    items.forEach((object) => {
		const testSelection = _.find(selectionUID, object.PGTuid);
		if(testSelection === undefined){return;}
		group.addWithUpdate(object);
	    });
	    canvas.setActiveGroup(group.setCoords());

	}


	
    },

    CC_UI: undefined,
    RecieveUpdate: function(CC_UI){
	this.CC_UI = CC_UI;
    }

};

export default Motf_FabricHandlers;
