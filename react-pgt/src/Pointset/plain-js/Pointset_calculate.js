var _ = require('lodash');

var Pointset_calculate = {

    Grid_points: function(Grid){

	
	// 1. Calculate the Basis vectors

	/*
	// "spacing_unit_objectUpdater()" - function that can get px value for lineset spacing...

	var S1 = this.spacing_unit_objectUpdater(Grid.line_sets[0], "pixels", true);
	var S2 = this.spacing_unit_objectUpdater(Grid.line_sets[1], "pixels", true);
	*/

	// this is Highly Dodge...
	// In these two lines, we assume units are "px" for both line sets, as opposed to converting function above...
	const S1 = Grid.line_sets[0];
	const S2 = Grid.line_sets[1];

	
	var ang1 = S1.angle * 2 * Math.PI / 360;
	var ang2 = S2.angle * 2 * Math.PI / 360;
	var inte1 = S1.shift * 0.01;
	var inte2 = S2.shift * 0.01;
	
	//vector parallel to a LS 1 lines
	var q = S2.spacing / Math.sin(ang1 + ang2);
	var Q_x = q * Math.cos(ang1);
	var Q_y = - q * Math.sin(ang1);

	//vector parallel to a LS 2 lines
	var p = S1.spacing / Math.sin(ang1 + ang2);
	var P_x = p * Math.cos(ang2);
	var P_y = p * Math.sin(ang2);


	// 2. Define a variety of helper functions for handling the data...
	var PointSet = {};

 	var set = function(Pi,Qi,A){
	    PointSet[Pi+'^'+Qi] = A;
	};
 	var get = function(Pi,Qi){
	    return PointSet[Pi+'^'+Qi];
	};


	const winW = window.innerWidth;
	const winH = window.innerHeight;
	var origX = winW/2;
	var origY = winH/2;

 	var convert = function(Pi,Qi){
	    Pi += inte1;
	    Qi -= inte2;
	    return {x: (origX + P_x*Pi + Q_x*Qi), y: (origY + P_y*Pi + Q_y*Qi)};
	};

	// 3. Define and call once the main flood-fill function
	var rGen = function(Pi,Qi){

	    //the point tested may be:
	    // undefined - never yet visited
	    // true - visited already, and found to be in the set
	    // false - visited already, not in the set
	    var Here = get(Pi,Qi);

	    if(Here === undefined){
		// Is this point (passed by P-index and Q-index) inside the window? 
		var pnt = convert(Pi,Qi);
		var p_inside = (pnt.x >= 0) && (pnt.x < winW) && (pnt.y >= 0) && (pnt.y < winH);
		
		set(Pi, Qi, p_inside ? pnt : false);

		if(p_inside === true){
		    //4 recursive calls...
		    rGen(Pi+1, Qi);
		    rGen(Pi-1, Qi);
		    rGen(Pi, Qi+1);
		    rGen(Pi, Qi-1);
		}
	    }
	};

	//trigger the recursive call: execute floodfill, starting in the center.
	rGen(0,0);

	// 4. Convert the generated dictionary into a list (Array). Lose those double-index keys...
	var PointList = [];
	_.each( PointSet, function( key, value ) {
	    //some entries will represent points found to be outside boundary.
	    if (value === false){return;}
	    PointList.push(value);
	});

	return PointList;	
    }
    
};


export {Pointset_calculate as default};
