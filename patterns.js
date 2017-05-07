var patterns = {


    
    init: function(){



	var W = $(window).width();
	var H = $(window).height();	
	$("#patterns-bg-svg").css("width", W).css("height", H);


	
	var motif_definitions = d3.select("#patterns-bg-svg").append("defs");
	var pattern_svg = d3.select("#patterns-bg-svg");

	$(".button#make-pattern").click(function(){
	    var M_index = $("#motif-index").val();
	    var G_index = $("#grid-index").val();

	    console.log("hello. M="+M_index+" G="+G_index);

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

    },

    
    regenerate_table: function(){

    }

};
