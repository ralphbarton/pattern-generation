var motifs_edit = {

    Fabric_Canvas: undefined,

    active: false,
    show: function(){
	$(".cpanel#main").removeClass("cpanel-main-size1").addClass("cpanel-main-size3");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", true); // Disable main tab set
	$("#motifs-view").hide();
	$("#motifs-edit").show();
	this.active = true;

	// 1. Load Selected Motif (A side effect in the datamodel)
	DM.edit_Motif(motifs_view.selected_row_i);

	// 2. Update Title SmartInput
	$("#motifs-edit .motif-title input#motif-name").SmartInput("update", {
	    underlying_obj: DM.editing_Motif,
	    data_change: true
	});
	
	// 3. Load all new elements (canvas & HTML)
	$.each(DM.editing_Motif.Elements, function(index, Properties) {
	    var uid = Properties.PGTuid;
	    motifs_props.Fabric_AddShape(uid, Properties);        // Add to Fabric Canvas
	    motifs_props.AddMotifElem_itemHTML(uid, Properties);  // Add to HTML	    
	});
	
    },


    hide: function(options){
	options = options || {};
	$(".cpanel#main").removeClass("cpanel-main-size3").addClass("cpanel-main-size1");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", false); // Enable main tab set
	$("#motifs-view").show();
	$("#motifs-edit").hide();
	this.active = false;
	
	// Clear old data in motifs edit: canvas objects & HTML

	// (A) remove canvas elements
	var canvas = this.Fabric_Canvas;
	// this includes clearing any selections on canvas, and associated events
	// (which I think is not correctly achieved when cycling canvas._objects and removing)

	// this method fires both "before:selection:cleared" and "selection:cleared" events.
	canvas.deactivateAllWithDispatch();

	//defer the action by 8ms, allowing callbacks on selection clear (i.e. save transforms) to complete.
	setTimeout(function(){
	    canvas.clear();
	    if(options.save){
		//these functions would normally be part of the button click handler...
		// i.e. cb atached to #motifs-edit .main-buttons #done
		DM.save_editing_Motif(motifs_view.selected_row_i);
		motifs_view.regenerate_table(); // Visual update
	    }
	}, 8);


	// (B) remove old motif element properties table HTML
	$(".m-elem").each(function(index, $Elem) {
	    if($(this).attr("id") == "m-elem-template"){
		return;
	    }
	    $(this).remove();
	});

    },

    keyStrokeHandler: function(myKeycode, keyPressed, keyEvent){
	
	var canvas = this.Fabric_Canvas;

	if(keyEvent == "keydown"){
	    
	    //Delete key pressed...
	    if(myKeycode == 46){
		this.ActUponFabricSelection(function(fObj, uid){
		    motifs_edit.deleteMotifElement(uid);
		}, {
		    groupDiscard: true
		});
	    }

	    //an ARROW key pressed...
	    else if((myKeycode >= 37)&&(myKeycode <= 40)){

		// determine the 1px MOVE, as a "change" object of properties...
		this.ActUponFabricSelection(function(fObj, uid){

		    /*
		      left arrow 37
		      up arrow 38
		      right arrow 39
		      down arrow 40 
		    */
		    var cng = {};
		    if(myKeycode == 37){
			cng.left = fObj.left - 1;
		    }else if(myKeycode == 38){
			cng.top = fObj.top - 1;
		    }else if(myKeycode == 39){
			cng.left = fObj.left + 1;
		    }else if(myKeycode == 40){
			cng.top = fObj.top + 1;
		    }


		    motifs_edit.updateMotifElement(uid, cng);
		});
	    }

	    // CTRL key pressed...
	    else if(myKeycode == 17){
		//Lock aspect ratios.
		canvas.uniScaleTransform = false;
	    }

	}else if(keyEvent == "keyup"){

	    // CTRL key released...
	    if(myKeycode == 17){
		//no lock on aspect ratios during transform
		canvas.uniScaleTransform = true;
	    }

	}
	
    },
	


    ActUponFabricSelection: function(CB_per_object, options){
	options = options || {}; // in case of no options object provided...

	var canvas = this.Fabric_Canvas;
	var activeObject = canvas.getActiveObject();
	var activeGroup = canvas.getActiveGroup();

	// 1. a single object selected
	if (activeObject) {
	    CB_per_object(activeObject, activeObject.PGTuid);

	}
	// 2. a group selected
	else if (activeGroup) {
	    if(options.groupDiscard){
		canvas.discardActiveGroup();
	    }

	    var objectsInGroup = activeGroup.getObjects();
	    objectsInGroup.forEach(function(object) {
		CB_per_object(object, object.PGTuid);
	    });
	}

    },

    // Function acts upon 1. Fabric;  2. DM;  3. HTML
    deleteMotifElement: function(uid){
	
	// get Fabric object via its PGTuid
	var canvas = this.Fabric_Canvas;
	var Fabric_Object = $.grep(motifs_edit.Fabric_Canvas._objects, function(fObj){return fObj.PGTuid == uid;})[0];

	canvas.remove(Fabric_Object);   // 1. remove from canvas
	DM.Motif_deleteElement_data(uid);   // 2. remove from DM structure
	motifs_props.DeleteMotifElem_itemHTML(uid);// 3. remove from HTML

    },

    
    // Function acts upon 1. Fabric;  2. DM;  3. HTML
    updateMotifElement: function(uid, propsCng){
	
	// get Fabric object via its PGTuid
	var canvas = this.Fabric_Canvas;
	var Fabric_Object = $.grep(motifs_edit.Fabric_Canvas._objects, function(fObj){return fObj.PGTuid == uid;})[0];

	// 1. update in canvas
	Fabric_Object.set(propsCng);
	Fabric_Object.setCoords(); // to recalculate Fabric's click detection for the object.
	canvas.renderAll(); // n.b. setCoords() doesn't negate the need for this!

	DM.Motif_updateElement_data(uid, propsCng);   // 2. update in DM structure
	motifs_props.UpdateMotifElem_itemHTML(uid, propsCng);// 3. update in HTML

    }

};
