var patterns = {


    
    init: function(){



	var W = $(window).width();
	var H = $(window).height();	
	$("#patterns-bg-svg").css("width", W).css("height", H);


	
	var motif_definitions = d3.select("#patterns-bg-svg").append("defs");
	var pattern_svg = d3.select("#patterns-bg-svg");

	$(".button#make-grid-pattern").click(function(){
	    var M_index = $("#motif-index").val();
	    var G_index = $("#grid-index").val();

	    var mID = "my-motif-id-" + M_index;
	    var Motif = DM.MotifsArray[M_index];

	    //clear the old defn.
	    motif_definitions.select("g#"+ mID).remove();
	    var d3_selector = motif_definitions.append("g").attr("id", mID);	    

	    motifs_view.CreateMotifSVG(Motif, {d3_selection: d3_selector});

	    myIntersectionPoints = grids.calc_grid_intersection_points(G_index);
	    
	    var r1 = Math.random() * W;
	    var r2 = Math.random() * H;
	    var r3 = Math.random();
	    var r4 = -30 + Math.random()*60;
	    //	    	.attr("transform", "translate("+r1+" "+r2+") rotate("+r4+") scale("+r3+")");

	    //The items in the transform list are separated by whitespace and/or commas, and are applied from right to left
	    // "translate(<x> [<y>]) rotate(<a> [<x> <y>]) scale(<x> [<y>])"
	    var my_join = pattern_svg.selectAll(".live").data(myIntersectionPoints);

	    //update
	    my_join.attr("transform", function(d){return "translate("+d.x+" "+d.y+") scale(0.2)";});

	    //add new
	    my_join.enter()
		.append("use")
		.attr("class","live")
		.attr("xlink:href", "#"+mID)
	    	.attr("transform", function(d){return "translate("+d.x+" "+d.y+") scale(0.2)";});

	    //clear
	    my_join.exit().remove();

	});



	var plot_cumulation = undefined;
	var W = undefined;
	var H = undefined;

	$(".button#calc-dens-pattern").click(function(){
	    console.log("Dens: generating array");
	    var $c = $("#plot-canv");
	    W = $c.width();
	    H = $c.height();
	    var ctx = $c[0].getContext('2d');

	    var Arr = ctx.getImageData(0,0, W, H).data;

	    console.log("wp2", Arr.length);


	    plot_cumulation = [];
	    var acc = 0;
	    //there are 4 array elements for every 1 pixel
	    for (var i = 0; i < Arr.length; i+=4){

		var relative_prob = (Arr[i]/255)**2;

		acc += relative_prob;
		plot_cumulation.push(acc);
	    }
	    console.log("wp3", plot_cumulation.length);
	    console.log(plot_cumulation);	    
	    
	});

	
	// plot 100 points....
	var pointSet = [];
	$(".button#make-dens-pattern").click(function(){

	    var i_max = plot_cumulation.length - 1;
	    var v_max = plot_cumulation[i_max];

	    var st = new Date();
	    for (var i = 0; i < 1000; i++){

		var rVal = Math.random() * v_max;

		var random_pixel_index = BinarySearch(0, i_max, rVal);

		//i'm assuming scanning left-to-right in horizontal lines starting from top
		var myPoint = {
		    x: (random_pixel_index % W),
		    y: Math.floor(random_pixel_index / W)

		};

		pointSet.push(myPoint);
		
	    }


	    //now plot it all...
	    
	    var my_join = pattern_svg.selectAll(".dot").data(pointSet);

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


	    console.log("1000 points plotted and generated (ms):", (new Date()) - st);
	    
	    
	});
	
	//this returns the index in the array...
	var BinarySearch = function(i_min, i_max, val){

	    if(i_min == i_max){return i_min;}
	    var i_ave = Math.ceil((i_min + i_max)/2);
	    var njgt = plot_cumulation[i_ave -1] > val;
	    var   gt = plot_cumulation[i_ave   ] > val;

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
	
    },

    
    regenerate_table: function(){

    }

};
