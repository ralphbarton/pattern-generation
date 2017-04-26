var motifs_view = {


    init: function(){

	// 1. Add handlers for the buttons underneath the table...

	// 1.1 - Edit
	$("#motifs-view .table-buttons #edit").click(function(){
	    var index = 0;//TODO (index will not always be zero!
	    if(index !== undefined){
		motifs_edit.show(index);
	    }
	});


	var $pic_box = $("#Tab-motf .preview .pic-box");
	var dim = parseInt($pic_box.css("height"));

	$("#Tab-motf .preview .pic-box").append(
	    this.CreateMotifSVG(DM.MotifsArray[1], dim)
	);

	

    },


    selected_row_i: undefined,
    regenerate_table: function(select_index){

    },


    CreateMotifSVG: function(Motif, dim){

	var $svg_container = $("<div/>")
	var d3_svg = d3.select($svg_container[0]).append("svg")
	    .attr("width", dim)
	    .attr("height", dim)
	    .attr("viewBox", "0 0 400 400");
	

	$.each( Motif.Elements, function(i, E) {//E is element properties object

	    //	    console.log(i, JSON.stringify(E, null, 2));
	    
	    //Create an Ellipse
	    if(E.shape == "obj-ellipse"){
		
		d3_svg.append("ellipse").attr("class","some-obj")
		    .attr("cx", E.left + E.rx)
		    .attr("cy", E.top + E.ry)
		    .attr("rx", E.rx)
		    .attr("ry", E.ry)
		    .style("fill", E.fill)
		    .style("stroke", E.stroke);

	    }else if(E.shape == "obj-rectangle"){

		//Create a Rectangle
		d3_svg.append("rect").attr("class","some-obj")
		    .attr("x", E.left)
		    .attr("y", E.top)
		    .attr("width", E.width)
		    .attr("height", E.height)
		    .style("fill", E.fill)
		    .style("stroke", E.stroke);

	    }


	});
	
	return $svg_container;

    }

};
