var motifs_view = {

    selected_row_i: 0,
    init: function(){

	// 1. Add handlers for the buttons underneath the table...

	// 1.1 - Delete
	$("#motifs-view .table-buttons #delete").click(function(){
	    if(motifs_view.selected_row_i !== undefined){
		DM.deleteRow_motif(motifs_view.selected_row_i); // Mutate
		motifs_view.regenerate_table(); // Visual update
	    }
	});

	// 1.2 - Add
	$("#motifs-view .table-buttons #add").click(function(){
	    DM.addRow_motif(); // Mutate
	    motifs_view.regenerate_table(); // Visual update
	});

	// 1.3 - Duplicate
	$("#motifs-view .table-buttons #duplicate").click(function(){
	    if(motifs_view.selected_row_i !== undefined){
		DM.duplicateRow_motif(motifs_view.selected_row_i); // Mutate
		motifs_view.regenerate_table(); // Visual update
	    }
	});


	// 1.4 - Edit
	$("#motifs-view .table-buttons #edit").click(function(){
	    if(motifs_view.selected_row_i !== undefined){
		motifs_edit.show(motifs_view.selected_row_i);
	    }
	});

	this.regenerate_table();

    },


    regenerate_table: function(){

	//wipe the entire table of rows...
	$("#motifs-view tbody").html("");
	
	DM.MotifsArray.forEach(function(motif_obj, i){

    	    $("#motifs-view tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>')
			    	.addClass("blue-cell")//for css styling
				.SmartInput({
				underlying_obj: DM.MotifsArray[i],
				underlying_key: "Name",
				data_class: "text",
				text_length: 8,//max name length 8 char
				click_filter: function(){return motifs_view.selected_row_i == i;}
			    })
			),
			$('<td/>').addClass("col-3").text("2D"),
			$('<td/>').addClass("col-4").append(
			    motifs_view.CreateMotifSVG(DM.MotifsArray[i], 45)
			)
		    ).on("click",function(){ //click on the row
			if(motifs_view != $(this).data("index")){ // selecting this row is a CHANGE. 

			    // 1. manage row selection witin the table itself
			    motifs_view.selected_row_i = $(this).data("index");
			    $("#motifs-view tr.selected").removeClass("selected");
			    $(this).addClass("selected");

			    var Motif = DM.MotifsArray[i];

			    // 2. Detach (bin) any existing SVG and add one for the selected item.
			    var $pic_box = $("#Tab-motf .preview .pic-box");
			    var dim = parseInt($pic_box.css("height"));
			    $("#Tab-motf .preview .pic-box").html("").append(
				motifs_view.CreateMotifSVG(Motif, dim)
			    );
    			    $("#motifs-view .preview .title").text(Motif.Name);
			    
			}
		    })
	    );
	});
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
