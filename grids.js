var grids = {

    showing_preview: false,
    init: function(){

	this.table_update();

	// Handler for -DUPLICATE-
	$("#grids-buttons #duplicate").click(function(){
	    //mutate the data structure
	    if(grids.selected_row_i != undefined){
		DM.duplicate_grid(grids.selected_row_i);
		//select the row just created...
		grids.selected_row_i += 1;
		//refresh view
		grids.table_update();
	    }
	});

	// Handler for -DELETE-
	$("#grids-buttons #delete").click(function(){
	    if(grids.selected_row_i != undefined){
		//mutate the data structure
		DM.deleteRow_grid(grids.selected_row_i);
		//select the row just created...
		grids.selected_row_i = Math.min(grids.selected_row_i, DM.GridsArray.length-1);
		//refresh view
		grids.table_update();
	    }
	});

	// Handler for -Show- preview
	$("#grid-preview-visibility #show").click(function(){
	    var my_i = grids.selected_row_i;
	    if((my_i != undefined) && (!$(this).hasClass("ui-disabled"))){
		grids.screen_grid(DM.GridsArray[my_i]);
		$(this).addClass("ui-disabled");
	    }
	});

	// add logic to the action links
	widgets.actionLink_init("#preset-grid.act-mutex",[
	    function(){
		//callback 1
		console.log("Isometric commanded");
	    },
	    function(){
		//callback 2
		console.log("Square commanded");
	    },
	    function(){
		//callback 3
		console.log("Diamond commanded");
	    }]
			       );
	//put them all "set" (in fact, this command will be needed every time a manual mutation is done)
	widgets.actionLink_unset("#preset-grid.act-mutex", null);


	//add logic for input boxes:

	// handle a change in one of the <input> boxes for the grid array
	var GA_mod = function(obj, ls, key){
	    // 'obj' - input elem
	    // 'ls' - line set (0,1)
	    // 'key' - angle / spacing / shift
	    var my_i = grids.selected_row_i;
	    if(my_i != undefined){
		//parse int logic probably needed here
		var my_val = $(obj).val();
		DM.GridsArray[my_i].line_sets[ls][key] = my_val;
		if(key=="angle"){grids.update_preview_svg_angle(ls, my_val);}
		
		//animated grid change...
		grids.screen_grid(DM.GridsArray[my_i]);
	    }
	};

	// change grid array units...
	var GAu_mod = function(ls, u){
	    var my_i = grids.selected_row_i;
	    if(my_i != undefined){
		DM.GridsArray[my_i].line_sets[ls]["spacing_unit"] = u;
		// also take action here to convert the spacing value,
		// such that it is equivalent with new units...
	    }
	};

	//callbacks for all input boxes.....
	$("#line-set-1 .k-ang  input").on("change", function(){GA_mod(this, 0, "angle")});
	$("#line-set-1 .k-inte input").on("focusout", function(){GA_mod(this, 0, "spacing")});
	$("#line-set-1 .k-shif input").on("focusout", function(){GA_mod(this, 0, "shift")});
	$("#line-set-2 .k-ang  input").on("change", function(){GA_mod(this, 1, "angle")});
	$("#line-set-2 .k-inte input").on("focusout", function(){GA_mod(this, 1, "spacing")});
	$("#line-set-2 .k-shif input").on("focusout", function(){GA_mod(this, 1, "shift")});


	// add logic to the action links
	widgets.actionLink_init("#line-set-1 .px-pc-qty.act-mutex",[
	    function(){GAu_mod(0,'px');},
	    function(){GAu_mod(0,'pc');},
	    function(){GAu_mod(0,'qty');},
	]
			       );

	//performs a 'move' within the DOM
	$("#svg-angle-1").appendTo("#line-set-1 .k-pix");
	$("#svg-angle-2").appendTo("#line-set-2 .k-pix");


    },

    selected_row_i: undefined,
    table_update: function(){

	//wipe the entire table of rows...
	$("#grids-table tbody").html("");

	DM.GridsArray.forEach(function(grid_obj, i){

    	    $("#grids-table tbody").append(
		$('<tr/>')
		    .data({index:i})
		    .append(
			$('<td/>').addClass("col-1").text(i+1),
			$('<td/>').addClass("col-2").append(
			    $('<input/>')
				.val(grid_obj.description)
				.attr('type', 'text')
				.addClass("blue-cell")
				.attr('readonly', true)
				.on("focusout", function(){
				    //update underlying data here...
				    DM.GridsArray[i].description = $(this).val();
				    widgets.table_cell_edit(this,false);
				})
				.click(function(){ //click on the input element
				    var jquery_tr_index = $(this).parent().parent().data("index");
				    if(grids.selected_row_i == jquery_tr_index){
					widgets.table_cell_edit(this,true);
				    }
				})
			)
		    ).on("click",function(){ //click on the row

			// 1. manage row selection witin the table itself
			$("#grids-table tr.selected").removeClass("selected");
			$(this).addClass("selected");
			grids.selected_row_i = $(this).data("index");

			// 2. populate the right section of screen using data from that specific grid

			//k-ang=angle, k-inte=spacing
			var Gx = DM.GridsArray[i].line_sets;
			$("#line-set-1 .k-ang input").val(Gx[0]["angle"]);
			grids.update_preview_svg_angle(0, Gx[0]["angle"]);//update the SVG
			$("#line-set-1 .k-inte input").val(Gx[0]["spacing"]);
			$("#line-set-1 .k-shif input").val(Gx[0]["shift"]);
			$("#line-set-2 .k-ang input").val(Gx[1]["angle"]);
			grids.update_preview_svg_angle(1, Gx[1]["angle"]);//update the SVG
			$("#line-set-2 .k-inte input").val(Gx[1]["spacing"]);
			$("#line-set-2 .k-shif input").val(Gx[1]["shift"]);



		    })
	    );





	    //edit_cp.table_row(element, i);
	});

	// use click handler to achieve re-selection
/*
	if(this.selected_row_i != undefined){
	    var tr_selected = $("#c-pot-edit-table tbody tr")[this.selected_row_i];
	    this.selected_row_i = undefined;//reset selection - necessary for effect of next line
	    tr_selected.click();
	}
*/
	
    },

    update_preview_svg_angle: function (ls, angle){
	var dy = ls ? 8 : 62;
	var svg_id = "#svg-angle-" + (ls+1);
	var angle = ls ? angle : -angle;

	d3.select(svg_id + " #my_arrow")
	    .transition()
	    .duration(500)
	    .attr("transform", "translate(8 "+dy+") rotate("+angle+")");
    },

    previous: {line_sets:[]},
    screen_grid: function (grid_obj){
	var winW = $(window).width();
	var winH = $(window).height();

	$("#svg-bg-fullscreen").css("width", winW).css("height", winH);

	this.screen_update_line_set(grid_obj.line_sets[0], this.previous.line_sets[0], winW, winH, 0);
	this.screen_update_line_set(grid_obj.line_sets[1], this.previous.line_sets[1], winW, winH, 1);

	this.previous = grid_obj;

    },

    screen_update_line_set: function (LineSet, prev_LineSet, W, H, i){

	var Dia = Math.sqrt(W*W + H*H);
	var origX = W/2;
	var origY = H/2;
	var Radius = Dia/2;
	var first = prev_LineSet == undefined;
	var neg_ang = (i==0 ? -1 : 1);

	//assuming data in pixels here...
	var inte_target = LineSet.spacing;
	var angle_target = LineSet.angle * neg_ang;
	var inte_starting = first ? inte_target : prev_LineSet.spacing;
	var angle_starting = first ? angle_target : (prev_LineSet.angle * neg_ang);

	var N1 = Math.ceil((Dia/2) / inte_target);//N1 is the number of lines in just the upper half
	
	var lines_class = "lines-"+(i+1);

	//this is an array to apply D3 to and generate one line set...
	var lines1_genData = [];
	for (var i = 0; i < N1; i++){
	    lines1_genData.push(i);
	    if(i != 0){
		lines1_genData.push(-i);
	    }
	}

	//select the set of lines
	var selection = d3.select("#svg-bg-fullscreen")
	    .selectAll("."+lines_class).data(lines1_genData);

	// first pass - change the set to contain the correct number of lines
	selection.enter()
	    .append("line").attr("class", lines_class)
	    .attr("x1", -Radius)
	    .attr("x2", +Radius)
	    .attr("y1", function(d){return d*inte_starting;})
	    .attr("y2", function(d){return d*inte_starting;})
	    .attr("transform", "translate("+origX+" "+origY+") rotate("+angle_starting+")")
	    .attr("stroke","black")
	    .attr("stroke-width","1");

	selection.exit()
	    .transition()
	    .delay(500)
	    .duration(1300)
	    .attr("stroke", "rgba(0,0,0,0)")
	    .remove();

	//second pass. Animate
	if(!first){
	    var selection = d3.select("#svg-bg-fullscreen")
		.selectAll("."+lines_class).data(lines1_genData)
		.transition()
		.delay(function(d, i) {
		    return (i / N1) * 250; // max of (i/N2) = 2
		})
		.duration(500)
		.attr("y1", function(d){return d*inte_target;})
		.attr("y2", function(d){return d*inte_target;})
		.attr("transform", "translate("+origX+" "+origY+") rotate("+angle_target+")");
	}
    },

};
