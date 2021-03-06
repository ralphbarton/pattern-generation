var density_util = {

    
    get_Pfun: function(power){
	return function(x){return x ** power};
    },
    
    density_CDF_Array: undefined,
    Create_density_CDF: function(uid, fn_prob_rescale){

	//at this point, we are assuming the density is of a Ploy (and not a painting; todo)
	var $D_canvas = $("#backgrounds canvas#plot-" + uid);
	
	var W = $D_canvas.width();
	var H = $D_canvas.height();
	var ctx = $D_canvas[0].getContext('2d');

	var Arr = ctx.getImageData(0,0, W, H).data;


	this.density_CDF_Array = [];
	var acc = 0;
	//there are 4 array elements for every 1 pixel
	for (var i = 0; i < Arr.length; i+=4){
	    //apply rescaling function to value between 0 and 1.
	    var relative_prob = fn_prob_rescale( Arr[i]/255 );
	    acc += relative_prob;
	    this.density_CDF_Array.push(acc);
	}
    },


    Calc_pointCloud_using_CDF: function(n_points){
	var i_max = this.density_CDF_Array.length - 1;
	var v_max = this.density_CDF_Array[i_max];
	var W = $(window).width();

	var old_len = this.pointSet.length;
	var q_needed = n_points - old_len;
	
	//now, either add or remove points. This avoids rerandomising
	if(q_needed <= 0){
	    //there are too many points!
	    this.pointSet.splice(n_points, -q_needed);
	    
	}else{
	    
	    for (var i = 0; i < q_needed; i++){
		var rVal = Math.random() * v_max;
		var random_pixel_index = this.BinarySearch(0, i_max, rVal);

		//i'm assuming scanning left-to-right in horizontal lines starting from top
		var myPoint = {
		    x: (random_pixel_index % W),
		    y: Math.floor(random_pixel_index / W)

		};
		this.pointSet.push(myPoint);
	    }
	}

	return this.pointSet;
    },


    pointSet: [],
    Draw_many_using_CDF: function(n_points, options){
	if(!this.density_CDF_Array){return;}
	options = options || {};

	//do not attempt to animate a large number of points
	// (is this logic necessary - doesn't d3 already gracefully degrade animation??)
	var AN = n_points < 200 && this.pointSet.length < 200;

	var W = $(window).width();
	var H = $(window).height();
	
	var d3_svg = undefined;
	if(options.dotAsMotif){
	    d3_svg = d3.select("#patterns-bg-svg")
		.attr("width", W)
		.attr("height", H);
	}
	
	if(options.clearAllExisting){

	    if(AN){
		d3_svg.selectAll(".dot")
		    .attr("class","vanishing")
		    .transition()
		    .duration(500)
		    .attr("r", 0)
		    .remove();
	    }
	    else{
		d3_svg.selectAll(".dot")
		    .remove();
	    }
		
	    this.pointSet = [];
	}

	this.Calc_pointCloud_using_CDF(n_points);

	//now plot it all...
	var my_join = d3_svg.selectAll(".dot").data(this.pointSet);


	//add new
	var my_enter = my_join.enter()
	    .append("circle").attr("class","dot")
	    .attr("cx", function(d){return d.x;})
	    .attr("cy", function(d){return d.y;})
	    .attr("r", (AN?0:3))
	    .attr("fill", "red")
	    .attr("stroke","black")
	    .attr("stroke-width","1");

	if(AN){
	    my_enter
	    	.transition()
		.duration(500)
		.attr("r", 3);
	}
	
	// this is only relevant specifically to a case where n-points is reduced without clearing existing...
	//clear
	if(AN){
	    my_join.exit()
		.transition()
		.duration(500)
		.attr("r", 0)
		.remove();
	}else{
	    my_join.exit().remove();
	}
    },

    
    //this returns the index in the array...
    BinarySearch: function(i_min, i_max, val){

	if(i_min == i_max){return i_min;}
	var i_ave = Math.ceil((i_min + i_max)/2);
	var njgt = this.density_CDF_Array[i_ave -1] > val;
	var   gt = this.density_CDF_Array[i_ave   ] > val;

	if(!gt){
	    // Drill into upper part of range
	    return this.BinarySearch(i_ave, i_max, val);
	}else{
	    if(njgt){
		// Drill into lower part of range
		return this.BinarySearch(i_min, i_ave - 1, val);
	    }else{
		// we hit it!
		return i_ave;
	    }
	}
    }


};
