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

	return spacing_new;
    }

}



export {Grid_util as default};
