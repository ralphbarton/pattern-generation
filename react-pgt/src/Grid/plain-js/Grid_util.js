var Grid_util = {

    convertSpacingUnit: function(LineSet, units_new){
	var winW = window.innerWidth;
	var winH = window.innerHeight;
	var phi_rad = LineSet.angle * 2 * Math.PI / 360;
	var theta_rad = Math.atan(winH/winW);
	var L_eff = Math.sqrt(winW*winW + winH*winH) * Math.sin(Math.abs(phi_rad + theta_rad));

	//whatever units are, restore them as px
	var spacing_px = LineSet.spacing;
	if(LineSet.spacing_unit === 'percent'){
	    spacing_px = winW * LineSet.spacing/100; //convert percent into px
	}else if(LineSet.spacing_unit === 'quantity'){
	    spacing_px = L_eff / LineSet.spacing; //convert qty into px
	}

	var spacing_new = spacing_px;
	if(units_new === 'percent'){
	    spacing_new = (spacing_px/winW) * 100;
	}else if(units_new === 'quantity'){
	    spacing_new = L_eff / spacing_px;
	}

	return Math.max(spacing_new, 1);// 1px may convert to 0% - Nono!
    },


    GeneratePresetTypeFromGrid: function(oldGrid, toType, lockAngles){
	var LS = oldGrid.line_sets;
	var $LSupd = {0:{}, 1:{}};
	var changedLockAngles = undefined;
	
	// (1.) Manage angles...
	if(toType === "iso"){
	    //where necessary, rotating back by 60 keeps within range...
	    const newLS0_angle = LS[0].angle > 60 ? (LS[0].angle - 60) : LS[0].angle;
	    $LSupd[0].angle = {$set: newLS0_angle};//may be same as before...
	    $LSupd[1].angle = {$set: (60 - newLS0_angle)};
	    
	    changedLockAngles = false; // command a mutation (reset) of lock
	}
	if(toType === "squ"){
	    $LSupd[1].angle = {$set: (90 - LS[0].angle)};
	    changedLockAngles = false; // command a mutation (reset) of lock
	}
	if(toType === "dia"){

	    var isRect = ((LS[0].angle === 0) && (LS[1].angle === 90)) || ((LS[0].angle === 90) && (LS[1].angle === 0));

	    if(lockAngles || isRect){
		var ave_angle = (LS[0].angle + LS[1].angle)/2;
		$LSupd[0].angle = {$set: ave_angle};
		$LSupd[1].angle = {$set: ave_angle};
	    }else{
		if(LS[0].angle !== 0){
		    $LSupd[1].angle = {$set: LS[0].angle};
		}
	    }
	}


	// (2.) Manage spacings. All options involve setting them to equal.
	var LS0_spacing = LS[0].spacing;
	var LS1_spacing = LS[1].spacing;

	// we cannot possibly use spacing units of quantity.
	// So unless both dimentions are in units of percent, set them both to pixels:
	if((LS[0].spacing_unit !== "percent") || (LS[1].spacing_unit !== "percent")){

	    LS0_spacing = this.convertSpacingUnit(LS[0], 'pixels')
	    LS1_spacing = this.convertSpacingUnit(LS[1], 'pixels')

	    // set spacing units equal (if necessary)
	    $LSupd[0].spacing_unit = {$set: 'pixels'};
	    $LSupd[1].spacing_unit = {$set: 'pixels'};
	}
	// set spacings equal
	var av_spacing = Math.round((LS0_spacing + LS1_spacing) / 2);

	$LSupd[0].spacing = {$set: av_spacing};
	$LSupd[1].spacing = {$set: av_spacing};

	//get rid of non-zero shifts? (leave it for now...)
	return {
	    $LSupd: $LSupd,
	    changedLockAngles: changedLockAngles
	};
	
    },

    newRandomRectGrid: function(number){

	//we will create a new grid with random parameters...
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	//50% channce of square, otherwise a long rectangle...
	var square_side = Math.random() > 0.5 ? getRandomInt(40, 120) : undefined;
	var cell_W = square_side || getRandomInt(120, 240);
	var cell_H = square_side || getRandomInt(20,  80);

	return{
	    name: "New Grid ("+number+")",
	    /*uid:  (added later)  */
	    type: "std",
	    n_dimentions: 2,
	    line_sets:[
		{// set 1
		    spacing: cell_H,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 0
		},
		{// set 2
		    spacing: cell_W,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 90
		}
	    ]
	};
    }
}



export {Grid_util as default};
