import {fabric}  from 'fabric';
var _ = require('lodash');

import Motf_util from './Motf_util';
import Motf_lists from './Motf_lists'; // used only for grid sizes

var Motf_FabricHandlers = {

    /* Functions are:
       - Show a Toast for single select & multi-select
       - 
    */

    prevUidArr: [],
    handle_ObjectSelected: function(options) {

	
	//get UIDs list of the items selected.
	const S = options.target;
	const multiple = S._objects !== undefined;
	const uidArr = multiple ? _.map( S._objects, 'PGTuid') : [S.PGTuid];

	// if selection is unchanged, do none of the effects of this handler.
	if( _.isEqual(uidArr, this.prevUidArr) ){
	    return;	    
	}
	
	if(multiple){
	    if(this.prevUidArr.length < 2){
		this.onToastMsg({
		    title: "Multiple elements selected",
		    text: "(note: the software doesn't yet handle multiple object selections...)",
		    type: "guidance",
		    diplayDuration: 1.5,
		    minPeriod: 15,
		    maxShows: 5
		});
	    }
	}else{
	    this.onToastMsg({
		title: "Element selected",
		text: "Use CTRL+click to add further objects to selection.",
		type: "guidance",
		diplayDuration: 1.5,
		minPeriod: 15,
		maxShows: 5
	    });
	}


	this.handleMotfUIStateChange(
	    {fabricSelection: {selectedMElemsUIDArr: {$set: uidArr}}}
	);

	// retain a reference to what will now be the 'previous' selection, to test for difference.
	this.prevUidArr = uidArr;
    },


    /* Functions are:
       - clear UI state relating to selected item<
       - 
    */
    handle_SelectionCleared: function(options) {
//	console.log("selection cleared event. 'this.canvasIsUpdating'=", this.canvasIsUpdating);
	if(this.canvasIsUpdating){return;}// ignore 'selection cleared' events that occur whilst canvas is updating
	this.handleMotfUIStateChange(
	    {fabricSelection: {selectedMElemsUIDArr: {$set: []}}}
	);
	this.prevUidArr = [];// this is necessary to ensure change if same object is reselected, that is detected...
    },
    
    
    /* Functions are:
       - Re-serialise entire motif & save
       - 
    */
    handle_ObjectModified: function(options) {

	/*
	  perhaps an improvement here would be to target the update at only the Modified Element??
	  is the PGTuid of this available via options?

	  "canvas.deactivateAll()":  Clear the selection. This is necessary so that "canvas.getObjects()" doesn't return
	  coordinates subject to grouping (in the case of group-selection-modify). However, this selection-clear is
	  temporary, as selection will be regenerated on the re-render that will result from modification.
	*/

	this.canvas.deactivateAll();

	// 'serialise' entire canvas contents...
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
	
	// 2. Add Handler: Object:Selected & selection:created
	/*
	  one event catches creation of any Group selection; the other seems to catch only
	  single item selection and conversion from single to group
	  using both means same event will sometimes be handled twice, but the handler is robust to this.
	 */
	canvas.on('object:selected', this.handle_ObjectSelected.bind(this));
	canvas.on('selection:created', this.handle_ObjectSelected.bind(this));

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
    
    canvasIsUpdating: false,
    UpdateCanvas: function(Motf, selectedMElemsUIDArr){
	const canvas = this.canvas;
	
	// 1. wipe all objects from the canvas
	// Important to ignore 'selection cleared' events that occur whilst canvas is updating
	this.canvasIsUpdating = true;
	canvas.clear();
	this.canvasIsUpdating = false;
	
	// 2. (re-)add all the objects
	_.forEach(Motf.Elements, function(Properties, index) { // (value, key)
	    Motf_util.Fabric_AddShape(canvas, Properties);        // Add to Fabric Canvas
	});

	// 3. set the correct canvas selection	
	if(!selectedMElemsUIDArr){return;}// nothing selected -> skip step 3...

	if(selectedMElemsUIDArr.length === 1){//single selection
	    const selected_fObj = _.find(canvas.getObjects(), {PGTuid: selectedMElemsUIDArr[0]});
	    canvas.setActiveObject(selected_fObj);

	}else if(selectedMElemsUIDArr.length >= 1){//multi-selection
	    const items = canvas.getObjects();
	    const group = new fabric.Group();
	    group.canvas = canvas;
	    items.forEach((object) => {
		if( ! _.includes(selectedMElemsUIDArr, object.PGTuid) ){return;}
		group.addWithUpdate(object);
	    });
	    canvas.setActiveGroup(group.setCoords()).renderAll();

	}
	
    },

    CC_UI: undefined,
    RecieveUpdate: function(CC_UI){
	this.CC_UI = CC_UI;
    }

};

export default Motf_FabricHandlers;
