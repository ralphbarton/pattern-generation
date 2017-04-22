var motifs_edit = {

    Fabric_Canvas: undefined,

    active: false,
    show: function(){
	$(".cpanel#main").removeClass("cpanel-main-size1").addClass("cpanel-main-size3");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", true); // Disable main tab set
	$("#motifs-view").hide();
	$("#motifs-edit").show();
	this.active = true;
    },


    hide: function(){
	$(".cpanel#main").removeClass("cpanel-main-size3").addClass("cpanel-main-size1");//change window size
	$("#cpanel-main-tabs").tabs("option", "disabled", false); // Enable main tab set
	$("#motifs-view").show();
	$("#motifs-edit").hide();
	this.active = false;
    },

    keyStrokeHandler: function(myKeycode, keyPressed){
	
	var canvas = this.Fabric_Canvas;

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

    },

    regenerateMotifPropsList: function(){

	//this function will become relevant once I actually start to utilise multiple motifs.

	//this will need to do something like calling " motifs_props.AddMotifElem_itemHTML() " for each motif element

    }

};
