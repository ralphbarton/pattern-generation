var density_render = {

    density_CDF_Array: undefined,
    Create_density_CDF: function($D_canvas, fn_prob_rescale){

	var W = $(window).width();
	var H = $(window).height();	

	W = $D_canvas.width();
	H = $D_canvas.height();
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


    pointSet: [],
    Draw_points_from_CDF: function(d3_svg, n_points){

	var i_max = this.density_CDF_Array.length - 1;
	var v_max = this.density_CDF_Array[i_max];

	var W = $(window).width();
	
	for (var i = 0; i < n_points; i++){
	    var rVal = Math.random() * v_max;
	    var random_pixel_index = this.BinarySearch(0, i_max, rVal);

	    //i'm assuming scanning left-to-right in horizontal lines starting from top
	    var myPoint = {
		x: (random_pixel_index % W),
		y: Math.floor(random_pixel_index / W)

	    };
	    this.pointSet.push(myPoint);
	}

	//now plot it all...
	var my_join = d3_svg.selectAll(".dot").data(this.pointSet);

	//update
	my_join
	    .attr("cx", function(d){return d.x;})
	    .attr("cy", function(d){return d.y;});

	//add new
	my_join.enter()
	    .append("circle").attr("class","dot")
	    .attr("cx", function(d){return d.x;})
	    .attr("cy", function(d){return d.y;})
	    .attr("r", 5)
	    .attr("fill", "yellow")
	    .attr("stroke","black")
	    .attr("stroke-width","1");

	//clear
	my_join.exit().remove();

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
