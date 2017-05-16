var patterns = {

    InputsValues: {},
    
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

	var AelemInfo = function(ev, cb){
	    var $target = $(ev.target);
	    if( $target.is('a') ){
		if(!$target.attr("id")){return;}// this will be the case for Paintings until inplemented (TODO!)

		// get uid of the pattern drive...
		var pd_uid = parseInt( $target.attr("id").replace(/[^0-9]/g,'') );
		var isGrid = $target.attr("id").includes("grid");
		var type = isGrid ? "grid" : "plot";
		cb(pd_uid, type);
	    }
	};

	// Click any Pattern-Drive dropdown Element (Grid / Density)
	$("#Tab-patt .pdrive .dropdown-content").click(function(ev){

	    unDrop($(this));//since we have selected, the menu disappears...

	    AelemInfo(ev, function(pd_uid, type){
		var Pattern_i = DM.pattArray[patterns.selected_row_i];
		Pattern_i.type = type;
		Pattern_i.pdrive_uid = pd_uid;

		//this references the DM data, so call last...
		patterns.UIsetPatternDriveName();
	    });
	});

	// mouseover is in this case preferred to mouseenter. Need to retrigger for different child elems!
	$("#Tab-patt .pdrive .dropdown-content").on("mouseover", function(ev){
	    AelemInfo(ev, function(pd_uid, type){

		if(type == "plot"){

		    var $PreviewDiv = $("#Tab-patt .pdrive-preview-box");
		    var $PreviewPlot = $PreviewDiv.find("canvas");

		    var $MainPlot = $("#backgrounds canvas#plot-" + pd_uid);
		    
		    //container dimentions
		    var pW = $PreviewDiv.width();
		    var pH = $PreviewDiv.height();

		    //original (large) plot dimentions
		    var mW = $MainPlot.width();
		    var mH = $MainPlot.height();

		    // portrait in this case means canvas will be vertically skinny within its div container
		    var isP = (mH/mW) > (pH/pW);
		
		    var pv_W = isP ? (pH * mW/mH) : pW;
		    var pv_H = isP ? pH : (pW * mH/mW);
		
		    $PreviewPlot
			.attr("width", pv_W)
			.attr("height", pv_H)

		    $PreviewPlot[0].getContext("2d").drawImage( $MainPlot[0], 0,0, pv_W, pv_H);

		}else{
		    //handling for previewing a grid...
		console.log(pd_uid, type);
		}
	    });
	});
	
	

	// "Placement Intensity" pane - 'show' button within the dropdown
	var show_intens = false;
	$("#pattern-drive .pdrive.density .dropdown-content button").click(function(){
	    show_intens = true;
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt .placement-intensity").show();
	});
	
	
	// "Motif Alternate" - hide
	$("#Tab-patt .action-link#hide-motif-alternate").click(function(){
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt #motif-linking").show();
	});

	// "Motif Alternate" - show
	$("#Tab-patt #include-motifs .button#alternate").click(function(){
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt .motif-alternate").show();
	});
	

	// Motifs selection list
	$("#Tab-patt .dropdown.load").on("mouseenter", function(){

	    var Pattern_i = DM.pattArray[patterns.selected_row_i];

	    if (!Pattern_i){return;}
	    
	    var patt_M_set = Pattern_i.Motif_set;// motif set of this pattern

	    var a_count = 0;
	    $(this).find(".dropdown-content")
		.html("")
		.append(
		    DM.motfArray.map(function(Motif, i){
			//if motif already in this Pattern, don't put in selection list...
			if ( DM.GetByKey_( patt_M_set, "uid", Motif.uid) !== undefined ){return;}
			a_count ++;
			return $("<a/>")
			    .attr("href","#")
		    	    .attr("id","motif-uid-" + Motif.uid)
			    .append(
				motifs_view.CreateMotifSVG(Motif, {dim: 45} ),
				$("<div/>").addClass("title").text(Motif.Name)
			    )
		    }),
		    a_count > 0 ? null : $("<div/>").addClass("comment").text("(Empty List)")
		)
	    // This toast may get annoying...
	    // TODO: mechanism to identify toasts (hash the message string?) and limit freqency / occurance.
	    if(a_count > 3){
		global.toast("Mouse scroll-wheel can be used on this list");
	    }
	});


	// Selecting a motif from the available motifs list (triggers deletion from this list...)
	$("#Tab-patt .load .dropdown-content").click(function(ev){

	    var Pattern_i = DM.pattArray[patterns.selected_row_i];
	    
	    //we may need to get closest <a> element, if target itself is not <a>
	    var $target_clos_a = $(ev.target).closest("a");

	    if( !$target_clos_a.attr("id") ){return;}// I don't think this is watertight...
	    var uid = parseInt( $target_clos_a.attr("id").replace(/[^0-9]/g,'') );

	    // Motif already in the table (no need to add it => return)...
	    if ( DM.GetByKey_( Pattern_i.Motif_set, "uid", Motif.uid) !== undefined ){return;}

	    $target_clos_a.slideUp();
	    DM.EDIT_patt_pushMotif(Pattern_i, uid);
	    patterns.regenerate_IM_table();	    
	});

	
	$("#include-motifs table").click(function(ev){
	    var $target = $(ev.target);
	    if (!$target.hasClass("dustbin")){return;}
	    
	    var uid = $target.closest("td").data("uid");

	    var Pattern_i = DM.pattArray[patterns.selected_row_i];
	    var patt_M_set = Pattern_i.Motif_set;// motif set of this pattern

	    // remove matching object from array (turn into reusable function?)
	    var index = -1;
	    $.each(patt_M_set, function( i, Object ) {
		if(Object["uid"] == uid){index = i;}
	    });	    
	    if (index > -1) {
		patt_M_set.splice(index, 1);
	    }

	    
	    patterns.regenerate_IM_table();
	});








	// Motifs Static Properties (just Scale, Angle, Opacity)
	var M_Props = undefined;
	$("#include-motifs .dropdown.props").on("mouseenter", function(){
	    var M_uid = $("#include-motifs table").find("tr.selected td").data("uid");
	    if (M_uid == undefined){return;}

	    var Motif = DM.GetByKey_( DM.motfArray, "uid", M_uid);
	    
	    $(this).find(".dynamic")
		.html("")
		.append(
		    $("<div/>").addClass("title").text(Motif.Name),
		    $("<div/>").addClass("m-box") // container for svg
		);

	    var d3_svg = d3.select("#include-motifs .dropdown.props .m-box")
		.append("svg")
		.attr("width", 200)
		.attr("height", 200);

	    var d3_motif_definition = d3_svg.append("defs").append("g").attr("id", "M-defn");
	    motifs_view.CreateMotifSVG(Motif, {d3_selection: d3_motif_definition});


	    var Pattern_i = DM.pattArray[patterns.selected_row_i];
	    var patt_M_set = Pattern_i.Motif_set;// motif set of this pattern

	    //Properties of THIS motif in the context of THIS pattern...
	    M_Props = DM.GetByKey_( patt_M_set, "uid", M_uid);
	    
	    d3_svg
		.append("use")
		.attr("xlink:href", "#M-defn");

	    ApplyDropdownTransform(M_Props);

	    //set sliders to the relevant percentages!
	    var scale_PC = 25 * ( Math.log2(M_Props.scale) + 3);
	    $("#include-motifs .props .scale .slider").slider({value: scale_PC});
	    var angle_PC = (50/180) * ( M_Props.angle + 180);
	    $("#include-motifs .props .angle .slider").slider({value: angle_PC});
	    var opacity_PC = M_Props.opacity * 100;
	    $("#include-motifs .props .opacity .slider").slider({value: opacity_PC});

	    //set smart inputs. We cannot assign entire new object.
	    // (note about SCALE): this is a different percentage to the slider, whose value is log...
	    patterns.InputsValues.scale = M_Props.scale * 100;
	    patterns.InputsValues.angle = M_Props.angle
	    patterns.InputsValues.opacity = M_Props.opacity * 100;

	    $("#include-motifs .props .opacity input").SmartInput("update", {data_change: true});
	    
	});


	var ApplyDropdownTransform = function(mp){
	    d3.select("#include-motifs .dropdown.props .m-box")
		.select("use")// the single 'use' element is the Motif
		.attr("transform", "translate(100 100) rotate(" + mp.angle + ") scale(" + mp.scale + ")")
		.attr("opacity", mp.opacity);
	};

	//TODO: condense these 3 into a single statement.
	
	//Slider: SCALE
	$("#include-motifs .props .scale .slider").slider({
	    slide: function(event, ui) {
		M_Props.scale = 2 ** (( ui.value / 25 ) - 3);// ui.value ranges 0 to 100
		ApplyDropdownTransform(M_Props);
	    }
	});
	

	//Slider: ANGLE
	$("#include-motifs .props .angle .slider").slider({
	    slide: function(event, ui) {
		M_Props.angle = (ui.value - 50) * (180/50);
		ApplyDropdownTransform(M_Props);
	    }
	});


	//Slider: OPACITY
	$("#include-motifs .props .opacity .slider").slider({
	    //callback function
	    slide: function(event, ui) {
		M_Props.opacity = ui.value / 100;
		ApplyDropdownTransform(M_Props);
		patterns.InputsValues.opacity = ui.value;
		$("#include-motifs .props .opacity input").SmartInput("update", {data_change: true});
	    }
	});

	
	//Smart Inputs....
	$("#include-motifs .props .opacity input").SmartInput({
	    underlying_obj: patterns.InputsValues,
	    underlying_key: "opacity",
	    data_class: "percent",
	    data_class_override: {steps:[10, 1]},//change the order....
	    cb_change: function(){
		var inp_val = patterns.InputsValues.opacity;
		M_Props.opacity = inp_val / 100;
		$("#include-motifs .props .opacity .slider").slider({value: inp_val});
		ApplyDropdownTransform(M_Props);
	    }//all the graphical change...
	});









	//
	// Placement Intensity Pane...
	//


	// "Placement Intensity" pane - 'hide' button within the pane itself
	$("#Tab-patt .action-link#hide-pl-intens").click(function(){
	    show_intens = false;
	    $("#Tab-patt .r-space").hide();
	    $("#Tab-patt #motif-linking").show();
	});


	//Smart Inputs....
	$(".placement-intensity .qty-points input").SmartInput({
	    underlying_key: "plot_qty",
	    data_class: "dimentionless",
	    data_class_override: {steps:[1, 10, 100, 1000], min: 0, max: 20000},
	    cb_change: function(){

	    }//all the graphical change...
	});

	$(".placement-intensity .prom-factor input").SmartInput({
	    underlying_key: "prom_factor",
	    data_class: "dimentionless",
	    data_class_override: {min: 1, max:8, steps:[0.1, 0.5, 1]},
	    cb_focusout: function(){
	    }
	});

	

	$(".placement-intensity .button").click(function(){
	    var positive = $(this).hasClass("plus");
	    var qty_pnts = parseInt( $(this).parent().attr("class").replace(/[^0-9]/g,'') );

	    var Pattern_i = DM.pattArray[patterns.selected_row_i];

	    function bound(lo,hi,x){return Math.min(Math.max(x,lo),hi);}
	    
	    Pattern_i.plot_qty += (positive ? 1 : -1) * qty_pnts;
	    Pattern_i.plot_qty = bound(0, 20000, Pattern_i.plot_qty);

	    $(".placement-intensity .qty-points input").SmartInput("update", {
		data_change: true
	    });




	    
	    //this is ALL copy-pasted...
	    var patt_M_set = Pattern_i.Motif_set;
	    var motif_props = patt_M_set[0];

	    


	    var Prom_function = density_util.get_Pfun(Pattern_i.prom_factor);
	    density_util.Create_density_CDF(Pattern_i.pdrive_uid, Prom_function);

	    //clear old point-set...
	    var myPoints = density_util.Calc_pointCloud_using_CDF(Pattern_i.plot_qty);
	    patterns.Display_grid_driven_pattern(Pattern_i.uid, motif_props, myPoints);

	    
	});







	



	$(".button#generate").click(function(){
	    var Pattern_i = DM.pattArray[patterns.selected_row_i];

	    if (Pattern_i === undefined){
		global.toast("No pattern selected for rendering");//TODO... will this be unreachable?
		return;
	    }
	    
	    var patt_M_set = Pattern_i.Motif_set;

	    if (patt_M_set.length < 1){
		global.toast("Select Motif(s) to pattern");
		return;
	    }

	    var motif_props = patt_M_set[0];
	    
	    if(Pattern_i.type == "grid"){

		// draw the grid driven pattern...
		var myPoints = grids.calc_grid_intersection_points(true, Pattern_i.pdrive_uid);
		patterns.Display_grid_driven_pattern(Pattern_i.uid, motif_props, myPoints);
		

	    }else if(Pattern_i.type == "plot"){

		Pattern_i.prom_factor = Pattern_i.prom_factor || 4;
		var Prom_function = density_util.get_Pfun(Pattern_i.prom_factor);
		density_util.Create_density_CDF(Pattern_i.pdrive_uid, Prom_function);

		//clear old point-set...
		density_util.pointSet = [];
		Pattern_i.plot_qty = Pattern_i.plot_qty || 100;
		var myPoints = density_util.Calc_pointCloud_using_CDF(Pattern_i.plot_qty);
		patterns.Display_grid_driven_pattern(Pattern_i.uid, motif_props, myPoints);

	    }

	});

	

	$("#Tab-patt .action-link#pattern-clear").click(function(){

	    var Pattern_i = DM.pattArray[patterns.selected_row_i];

	    if (Pattern_i === undefined){
		global.toast("No pattern to clear selected");
		return;
	    }

	    // clear content for pattern identified by the uid...
	    patterns.clear_pattern(Pattern_i.uid);
	    
	});
	
	this.regenerate_table();

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

			    // 2. Rerender screen for this row...
			    patterns.UIsetPatternDriveName();
			    patterns.regenerate_IM_table();

			    //un disable on row click...
			    $("#pattern-drive .dropdown.pdrive").removeClass("disabled");

			    $(".placement-intensity .qty-points input").SmartInput("update", {underlying_obj: Pattern});
			    $(".placement-intensity .prom-factor input").SmartInput("update", {underlying_obj: Pattern});
			}
		    })
	    );
	});

	//on table Creation, no row is selected (keeps things relatively simple)-> Disable 'props' button
	$("#pattern-drive .dropdown.pdrive").addClass("disabled");
	
	// use click handler to achieve re-selection
	if(this.selected_row_i != undefined){
	    var click_me_i = this.selected_row_i;
	    this.selected_row_i = undefined;//necessary for this dummy click to cause an action.
	    $($("#patterns-table tbody tr")[click_me_i]).click();
	}

	
	
    },


    UIsetPatternDriveName: function(){

	var Pattern_i = DM.pattArray[patterns.selected_row_i];
	if( Pattern_i.pdrive_uid === undefined){//no pattern drive set
	    $("#pattern-drive table td.col-2 .title").text("");
	    $("#pattern-drive table td.col-2 .none").show();
	    return;
	}

	function str_lim(txt, len){return txt.slice(0, len) + (txt.length > len ? "..." : "");};
	var isGrid = Pattern_i.type == "grid";

	var Obj = DM.GetByKey_( DM[Pattern_i.type+"Array"], "uid", Pattern_i.pdrive_uid);
	var Obj_Name = str_lim(Obj[isGrid?"description":"formula"], isGrid ? 12 : 8);
	$("#pattern-drive table td.col-2 .none").hide();
	$("#pattern-drive table td.col-2 .title").text((isGrid?"Grid":"Density")+": " + Obj_Name);
    },


    
    regenerate_IM_table: function(){
	var Pattern_i = DM.pattArray[patterns.selected_row_i];
	var patt_M_set = Pattern_i.Motif_set;// motif set of this pattern

	$("#include-motifs table tbody").html("");
	
	patt_M_set.forEach(function(M_Props, i){
	    var Motif = DM.GetByKey_( DM.motfArray, "uid", M_Props.uid);

	    $("#include-motifs table tbody").append(
		$('<tr/>').append(
		    $('<td/>')
		    	.append(
			    motifs_view.CreateMotifSVG(Motif, {dim: 45} ),
			    $("<div/>").addClass("title").text(Motif.Name),
			    $("<img/>").addClass("dustbin").attr("src", "icons/dustbin-100.png")
			)
			.data({uid: M_Props.uid})
		).on("click",function(){ //click on the row
		    $("#include-motifs table tr.selected").removeClass("selected");
		    $(this).addClass("selected");
		    $("#include-motifs .dropdown.props").removeClass("disabled");
		})
	    );
	});

	//on table Creation, no row is selected (keeps things relatively simple)-> Disable 'props' button
	$("#include-motifs .dropdown.props").addClass("disabled");

    },    
    

    Display_grid_driven_pattern: function(pattern_uid, motif_props, PointSet){

	//remove any old pattern that may exist...
	this.clear_pattern(pattern_uid);
	
	var Motif = DM.GetByKey_( DM.motfArray, "uid", motif_props.uid);

	var mID = "my-motif-id-" + motif_props.uid;
	var pID = "patt-" + pattern_uid;

	var W = $(window).width();
	var H = $(window).height();
	
	var d3_svg = d3.select("#patterns-bg-svg")
	    .attr("width", W)
	    .attr("height", H);
	
	// Create a new definition element relating to this pattern
	var d3_defs = d3_svg.append("defs").attr("class", pID);

	// add a single Motif into this definition...
	motifs_view.CreateMotifSVG(Motif, {
	    d3_selection: d3_defs.append("g").attr("id", mID)
	});

	//Add all data afresh...
	d3_svg.append("g").attr("class", pID)
	    .selectAll("use") //there will, however, be none
	    .data(PointSet)
	    .enter()
	    .append("use")
	    .attr("class","live")
	    .attr("xlink:href", "#"+mID)
	    .attr("transform", function(d){
		return "translate("+d.x+" "+d.y+") rotate(" + motif_props.angle + ") scale(" + motif_props.scale + ")";
	    })
	    .attr("opacity", motif_props.opacity);
    },

    
    clear_pattern: function(pattern_uid){
	var d3_svg = d3.select("#patterns-bg-svg");
	var pID = "patt-" + pattern_uid;

	//clear any old defn for this pattern
	d3_svg.select("defs." + pID).remove();

	//clear any old content for this pattern
	d3_svg.select("g." + pID).remove();
    }
    
};
