var _ = require('lodash');

import Grid_d3draw from '../../Grid/plain-js/Grid_d3draw';

var Pointset_calculate = {

    Grid_points: function(Grid){

	// 1. Calculate the Basis vectors
	const S1 = Grid_d3draw.lsToPx( Grid.line_sets[0] );
	const S2 = Grid_d3draw.lsToPx( Grid.line_sets[1] );
	
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
	const validPointSet = _.filter( PointSet,   v => {return v !== false});
	const PointList =     _.map( validPointSet, v => {return v});

	return PointList;	
    },

    
    IntegrateDensity: function(ImageData, prominence_factor){

	const prominence_function = x => {return x ** prominence_factor};

	var density_CDF_Array = [];
	var acc = 0;

	const ImageArr = ImageData.data;

	for (var i = 0; i < ImageArr.length; i+=4){
	    //apply rescaling function to value between 0 and 1.
	    var relative_prob = prominence_function( ImageArr[i]/255 );
	    acc += relative_prob;
	    density_CDF_Array.push(acc);
	}

	return density_CDF_Array;
    },


    Density_points: function(ImageData, prominence_factor, n_points){
	
	const density_CDF_Array = this.IntegrateDensity(ImageData, prominence_factor);
	
	//this returns the index in the array...
	const BinarySearch = function(i_min, i_max, val){

	    if(i_min === i_max){return i_min;}
	    var i_ave = Math.ceil((i_min + i_max)/2);
	    var njgt = density_CDF_Array[i_ave -1] > val;
	    var   gt = density_CDF_Array[i_ave   ] > val;

	    if(!gt){
		// Drill into upper part of range
		return BinarySearch(i_ave, i_max, val);
	    }else{
		if(njgt){
		    // Drill into lower part of range
		    return BinarySearch(i_min, i_ave - 1, val);
		}else{
		    // we hit it!
		    return i_ave;
		}
	    }
	};


	var i_max = density_CDF_Array.length - 1;
	var v_max = density_CDF_Array[i_max];

	const W = window.innerWidth;

	return _.times(n_points, ()=>{
	    var rVal = Math.random() * v_max;
	    var random_pixel_index = BinarySearch(0, i_max, rVal);

	    return { // I'm assuming scanning left-to-right in horizontal lines starting from top
		x: (random_pixel_index % W),
		y: Math.floor(random_pixel_index / W)

	    };
	});

	
	/* there is some code here which will to Add or Remove points from an existing set...
	   // this is motivated by the visual benefit of not rerandomising unnecessarily

	var old_len = this.pointSet.length;
	var q_needed = n_points - old_len;

	//now, either add or remove points. This avoids rerandomising
	if(q_needed <= 0){
	    //there are too many points!
	    this.pointSet.splice(n_points, -q_needed);
	    
	}else{
	    
	    for (var i = 0; i < q_needed; i++){
		var rVal = Math.random() * v_max;
		var random_pixel_index = BinarySearch(0, i_max, rVal);

		//i'm assuming scanning left-to-right in horizontal lines starting from top
		var myPoint = {
		    x: (random_pixel_index % W),
		    y: Math.floor(random_pixel_index / W)

		};
		this.pointSet.push(myPoint);
	    }
	}

	return this.pointSet;
	*/
    }    

    
};


export {Pointset_calculate as default};
