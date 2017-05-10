var patterns = {

    
    init: function(){

	// Add button
	$("#Tab-patt .button#add").click(function(){
	    patterns.selected_row_i = DM.patt_Add();
	    patterns.regenerate_table(); // Visual update
	});

	// Delete button
	$("#Tab-patt .button#delete").click(function(){
	    var index = patterns.selected_row_i;
	    if(index !== undefined){
		var lowest_row = DM.patt_Delete(index);
		patterns.selected_row_i = index - (lowest_row?1:0);
		patterns.regenerate_table();
	    }
	});


	// Pattern Drive: Grid dropdown - refresh contents from DM (event triggered by hover)
	$("#Tab-patt .dropdown.pdrive.grid").on("mouseenter", function(){
	    $(this).find(".dropdown-content")
		.html("")
		.append(
		    DM.gridArray.map(function(grid, i){
			return $("<a/>")
			    .attr("href","#")
		    	    .attr("id","grid-uid-" + grid.uid)
			    .text(grid.description);
		    })
		);
	    show_intens = false;
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt .pdrive-preview-box").show();
	});

	function str_lim(txt, len){return txt.slice(0, len) + (txt.length > len ? "..." : "");};
	function unDrop($El){
	    $El.css("display", "none");
	    setTimeout(function(){
		$El.css("display", "");
	    }, 300);//300 ms to guarentee the vanish is captured...
	};
	
	// Pattern Drive: Density dropdown - refresh contents from DM (event triggered by hover)
	$("#Tab-patt .dropdown.pdrive.density").on("mouseenter", function(){
	    $(this).find(".dropdown-content .dynamic")
		.html("")
		.append(
		    $("<div/>").text("Plots"),
		    DM.plotArray.map(function(plot, i){
			return $("<a/>")
			    .attr("href","#")
		    	    .attr("id","plot-uid-" + plot.uid)
			    .text(str_lim(plot.formula, 28));//limit to 28 char
		    }),
		    $("<div/>").text("Paintings"),
		    // map any density paintings into the list (feature not yet made...)
		    $("<a/>").attr("href","#").text("none")
		);
	    show_intens = false;
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt .pdrive-preview-box").show();
	});

	//apply to both dropdowns...
	$("#Tab-patt .dropdown.pdrive").on("mouseleave", function(){
	    if(!show_intens){
		$("#Tab-patt .r-space").hide();
		$("#Tab-patt #motif-linking").show();
	    }
	});


	// Click any Pattern-Drive dropdown Element (Grid / Density)
	$("#Tab-patt .pdrive .dropdown-content").click(function(ev){
	    var $target = $(ev.target);
	    if( $target.is('a') ){
		unDrop($(this));//since we have selected, the menu disappears...
		if(!$target.attr("id")){return;}// this will be the case for Paintings until inplemented (TODO!)
		var uid = parseInt( $target.attr("id").replace(/[^0-9]/g,'') );

		var isGrid = $target.attr("id").includes("grid");
		var type_str = isGrid ? "grid" : "plot";

		var Obj = $.grep(DM[type_str+"Array"], function(e){ return e.uid == uid; })[0];

		var Obj_Name = str_lim(Obj[isGrid?"description":"formula"], isGrid ? 12 : 8);
		$("#pattern-drive table td.col-2").text((isGrid?"Grid":"Density")+": " + Obj_Name);
		DM.dummyPattern.type = type_str;
		DM.dummyPattern.pdrive_uid = uid;
	    }
	});

	var show_intens = false;
	$("#pattern-drive .pdrive.density .dropdown-content button").click(function(){
	    show_intens = true;
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt .placement-intensity").show();
	});


	$("#Tab-patt .action-link#hide-pl-intens").click(function(){
	    show_intens = false;
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt #motif-linking").show();
	});



	// Temporary stuff relating to demonstrating
	
	var W = $(window).width();
	var H = $(window).height();	
	$("#patterns-bg-svg").css("width", W).css("height", H);



	$(".button#make-grid-pattern").click(function(){
	    var M_index = $("#motif-index").val();
	    var G_index = $("#grid-index").val();
	    patterns.Display_grid_driven_pattern(M_index, G_index);

	});



	$(".button#calc-dens-pattern").click(function(){

	    //squaring function: squaring probability seems better visually
	    density_render.Create_density_CDF($("#plot-canv"), function(x){return x**2});

	});



	$(".button#make-dens-pattern").click(function(){
	    var pattern_svg = d3.select("#patterns-bg-svg");
	    density_render.Draw_points_from_CDF(pattern_svg, 1000);
	    
	});


	this.regenerate_table();
	this.regenerate_IM_table();

    },

    selected_row_i: undefined,
    regenerate_table: function(){

	//wipe the entire table of rows...

	// the following 50-odd lines of code are very much copy-pasted on many tabs.
	// can it be made a jQuery widget???
	
	$("#patterns-table tbody").html("");
	
	DM.pattArray.forEach(function(pattern_obj, i){

    	    $("#patterns-table tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>')
			    	.addClass("blue-cell")//for css styling
				.SmartInput({
				    underlying_obj: DM.pattArray[i],
				    underlying_key: "Name",
				    data_class: "text",
				    text_length: 20,//max name length 10 char
				    click_filter: function(){return patterns.selected_row_i == i;}
				})
			)
		    ).on("click",function(){ //click on the row
			if(patterns.selected_row_i != $(this).data("index")){ // selecting this row is a CHANGE. 

			    // 1. manage row selection witin the table itself
			    patterns.selected_row_i = $(this).data("index");
			    $("#patterns-table tr.selected").removeClass("selected");
			    $(this).addClass("selected");

			    var Pattern = DM.pattArray[i];

			    // 2. Re-prep screen...
			    //var $something

			    /*
			      Potentially, a lot goes here...
			     */
			    
			}
		    })
	    );
	});

	// use click handler to achieve re-selection
	if(this.selected_row_i != undefined){
	    var click_me_i = this.selected_row_i;
	    this.selected_row_i = undefined;//necessary for this dummy click to cause an action.
	    $($("#patterns-table tbody tr")[click_me_i]).click();
	}
	
    },


    regenerate_IM_table: function(){

	$("#include-motifs table tbody").html("");

	DM.dummyPattern.incl_Motif_uids.forEach(function(M_uid, i){
    	    $("#include-motifs table tbody").append(
		$('<tr/>').append(
		    $('<td/>')
			.text("uid = " + M_uid)
		)
	    );
	});


		
    },    
    

    Display_grid_driven_pattern: function(M_index, G_index){

	var motif_definitions = d3.select("#patterns-bg-svg").append("defs");
	var pattern_svg = d3.select("#patterns-bg-svg");
	
	
	var mID = "my-motif-id-" + M_index;
	var Motif = DM.motfArray[M_index];

	//clear the old defn.
	motif_definitions.select("g#"+ mID).remove();
	var d3_selector = motif_definitions.append("g").attr("id", mID);	    

	motifs_view.CreateMotifSVG(Motif, {d3_selection: d3_selector});

	myIntersectionPoints = grids.calc_grid_intersection_points(G_index);

/*
  DEMONSTRATES RANDOM TRANSFORMS...
	var W = $(window).width();
	var H = $(window).height();

	var r1 = Math.random() * W;
	var r2 = Math.random() * H;
	var r3 = Math.random();
	var r4 = -30 + Math.random()*60;
	.attr("transform", "translate("+r1+" "+r2+") rotate("+r4+") scale("+r3+")");
*/

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
	
    }

    
};
