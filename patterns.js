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
	    var d3_selector = motif_definitions.append("g").attr("id", mID);
	    var Motif = DM.MotifsArray[M_index];
	    
	    motifs_view.CreateMotifSVG(Motif, {d3_selection: d3_selector});

	    var r1 = Math.random()* W;
	    var r2 = Math.random()* H;
	    var r3 = Math.random();
	    
	    pattern_svg.append("use")
		.attr("xlink:href", "#"+mID)
	    	.attr("x", r1)
	    	.attr("y", r2)
	    	.attr("transform", "scale("+r3+")");

	    
	});

    },

    
    regenerate_table: function(){

    }

};
