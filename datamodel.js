//data model...
var DM = {
    
    cpotArray: [
	{
	    description: "Banana Pie",
	    contents: [
		{
		    prob: 80,
		    type: "range",//"solid",
		    range: {
			"h": 56,
			"s": 0.6137931034482758,
			"l": 0.7156862745098038,
			"a": 0.8,
			"dh": 15,
			"ds": 0.3,
			"dl": 0.1,
			"da": 0.2
		    }
//		    solid: "#E3DD8A"
		},
		{
		    prob: 15,
		    type: "solid",
		    solid: "#78531F"
		},
		{
		    prob: 5,
		    type: "solid",
		    solid: "#E38ABC"
		}
	    ]
	},
	{
	    "description": "Puddle sky",
	    "contents": [
		{
		    prob: 50,
		    type: "range",
		    solid: "#02a7eb",
		    range: {
			h: 205.05494505494508,
			s: 0.75,
			l: 0.5450980392156863,
			a: 0.7,
			dh: 2,
			ds: 0.25,
			dl: 0.15,
			da: 0.25
		    }
		},
		{
		    prob: 22,
		    type: "solid",
		    solid: "rgb(122, 225, 20)"
		},
		{
		    prob: 10,
		    type: "solid",
		    solid: "#525261"
		},
		{
		    prob: 6,
		    type: "range",
		    range: {
			h: 35,
			s: 0.95,
			l: 0.5,
			a: 0.85,
			dh: 20,
			ds: 0.05,
			dl: 0.07,
			da: 0.15
		    }
		},
		{
		    prob: 12,
		    type: "range",
		    range: {
			h: 10,
			s: 0.4,
			l: 0.280,
			a: 0.9,
			dh: 30,
			ds: 0.4,
			dl: 0.1,
			da: 0.1
		    }
		}
	    ]
	},	
	{
	    description: "Electric paints",
	    contents: [
		{
		    prob: 21,
		    type: "solid",
		    solid: "#FFFF00"
		},
		{
		    prob: 21,
		    type: "solid",
		    solid: "#FFA500"
		},
		{
		    prob: 21,
		    type: "solid",
		    solid: "#008000"
		},
		{
		    prob: 21,
		    type: "solid",
		    solid: "#800080"
		},
		{
		    prob: 16,
		    type: "solid",
		    solid: "#000000"
		}
	    ]
	},
	{
	    description: "Cookie decoration",
	    contents: [
		{
		    prob: 33.3,
		    type: "solid",
		    solid: "#FCEE59"
		},
		{
		    prob: 33.4,
		    type: "solid",
		    solid: "#458EFA"
		},
		{
		    prob: 33.3,
		    type: "solid",
		    solid: "#FF5B2E"//red
		}
	    ]
	},
    ],

    cpot_Duplicate: function(index_dupl){
	/* Deep copy
	   var newObject = jQuery.extend(true, {}, oldObject);
	*/
	var new_pot = jQuery.extend(true, {}, this.cpotArray[index_dupl]);
	new_pot.description += " - copy";
	this.cpotArray.splice(index_dupl+1, 0, new_pot);
    },

    cpot_Delete: function(index){
	this.cpotArray.splice(index, 1);
	return index == this.cpotArray.length;//true if "index" now refers to a row that doesn't exist 
    },

    EDITINGcpot: undefined,
    EDcpot_LoadFrom: function(index){
	this.EDITINGcpot = jQuery.extend(true, {}, this.cpotArray[index]);
    },

    EDcpot_Save: function(replace_me_index){
	this.cpotArray[replace_me_index] = this.EDITINGcpot;
	this.EDITINGcpot = null;
    },


    // The three functions below are for manipulating the probabilities list

    EDcpot_SumProbs: function(){
	var items = this.EDITINGcpot.contents;	
	var accumulator = 0;

	for (var i=0; i < items.length; i++){
	    accumulator += items[i].prob;
	}
	return accumulator;
    },

    EDcpot_sum100: function(){
	var items = this.EDITINGcpot.contents;	
	var accumulator = 0;

	//1. sum
	for (var i=0; i < items.length; i++){
	    accumulator += Number(items[i].prob);
	}

	//2. rescale (with rounding and guarenteed sum=100)
	var r_acc = 0;
	for (var i=0; i < items.length; i++){
	    var rounded = +((items[i].prob * (100/accumulator)).toFixed(1));
	    var remainder = +((100-r_acc).toFixed(1));//we assume the %'s have 1.d.p.
	    items[i].prob = (i == items.length-1 ? remainder : rounded);
	    r_acc += rounded;
	}

    },

    EDcpot_AllEqualProbs: function(){
	var items = this.EDITINGcpot.contents;	
	for (var i=0; i < items.length; i++){
	    items[i].prob = 3;//an arbitrary number
	}
    },

    EDcpot_DeleteRow: function(index){
	this.EDITINGcpot.contents.splice(index, 1);
    },

    EDcpot_NewRow: function(row_col){
	this.EDITINGcpot.contents.push(
	    {
		prob: 15,
		type: "solid",
		solid: (row_col || "#FF0000")
	    }
	);
	return this.EDITINGcpot.contents.length;
    },












    
    gridArray: [
	{
	    type: "std",
	    description: "my first grid",
	    n_dimentions: 2,
	    line_sets:[
		{// set 1
		    spacing: 250,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 10
		},
		{// set 2
		    spacing: 50,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 35
		}
	    ]
	},{
	    type: "std",
	    description: "A square grid",
	    n_dimentions: 2,
	    line_sets:[
		{// set 1
		    spacing: 5,
		    spacing_unit: 'percent',
		    shift: 30,
		    angle: 45
		},
		{// set 2
		    spacing: 12.5,
		    spacing_unit: 'quantity',
		    shift: 50,
		    angle: 55
		}
	    ]
	}
    ],

    
    grid_Delete: function(index){
	this.gridArray.splice(index, 1);
    },

    // This function is not called anywhere.
    // seems not to be much point in duplicating grids...
    grid_Duplicate: function(index_dupl){
	//deep object copy via jquery
	var new_grid = jQuery.extend(true, {}, this.gridArray[index_dupl]);
	new_grid.description += " - copy";
	this.gridArray.splice(index_dupl+1, 0, new_grid);
    },

    grid_Add: function(){
	var qty_new = $.grep(this.gridArray, function(e){ return e.description.includes("New Grid"); }).length + 1;

	//we will create a new grid with random parameters...
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	//50% channce of square, otherwise a long rectangle...
	var square_side = Math.random() > 0.5 ? getRandomInt(40, 120) : undefined;
	var cell_W = square_side || getRandomInt(120, 240);
	var cell_H = square_side || getRandomInt(20,  80);

	this.gridArray.push({
	    type: "std",
	    description: "New Grid ("+qty_new+")",
	    n_dimentions: 2,
	    line_sets:[
		{// set 1
		    spacing: cell_H,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 0
		},
		{// set 2
		    spacing: cell_W,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 90
		}
	    ]
	});
	return this.gridArray.length - 1;//return index of newly added element
    },









    plotArray: [
	{
	    formula: "i*exp(3*z^3)*(z+1.2)^3",
	    

	    section: {
		rotation: 0,
		x_zoom: 1,
		y_zoom: 1
	    },
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    },
	    cache: {
		values_data: {},
		canvas: {},
		preview_canvas: {}
	    },
	},
	{
	    formula: "z^7",
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	},
	{
	    formula: "x+y",
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	},
	{
	    formula: "z*log( (z-0.7)*(z+0.7*i)*(z+0.2*(i+1.3)) )^4",
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	}

    ],

    plot_Delete: function(index){
	this.plotArray.splice(index, 1);
    },
    
    plot_Add: function(){
	this.plotArray.push({//default data
	    formula: "abcdef",
	    section: {
		rotation: 0,
		x_zoom: 1,
		y_zoom: 1
	    },
	    histogram: {
		val_min: 0,
		val_max: 0,
		val_mid: 0,
		brightness: 0,
		contrast: 0
	    },
	    cache: {
		values_data: {},
		canvas: {},
		preview_canvas: {}
	    }
	});//default data
    },

















    motiArray: [
	{// 1st dummy motif...
	    Name: "Molecule",
	    Params: {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    Elements: [
		{
		    "shape": "obj-ellipse",
		    "left": 100,
		    "top": 100,
		    "fill": "rgba(48, 162, 7, 0.86)",
		    "stroke": null,
		    "rx": 100,
		    "ry": 100,
		    "PGTuid": 0
		},
		{
		    "shape": "obj-ellipse",
		    "left": 83,
		    "top": 83,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": null,
		    "rx": 45,
		    "ry": 41,
		    "PGTuid": 3
		},
		{
		    "shape": "obj-ellipse",
		    "left": 218,
		    "top": 212,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": null,
		    "rx": 48,
		    "ry": 51.5,
		    "PGTuid": 4
		}
	    ]
	},
	{// 2nd dummy motif...
	    "Name": "Tetris went home",
	    "Params": {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    "Elements": [
		{
		    "shape": "obj-rectangle",
		    "left": 125,
		    "top": 125,
		    "width": 75,
		    "height": 75,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 5
		},
		{
		    "shape": "obj-rectangle",
		    "left": 200,
		    "top": 150,
		    "width": 50,
		    "height": 50,
		    "fill": "rgba(24, 244, 31, 0.69)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 6
		},
		{
		    "shape": "obj-rectangle",
		    "left": 200,
		    "top": 200,
		    "width": 75,
		    "height": 75,
		    "fill": "rgba(244, 24, 105, 0.50)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 7
		},
		{
		    "shape": "obj-rectangle",
		    "left": 150,
		    "top": 200,
		    "width": 50,
		    "height": 50,
		    "fill": "rgba(24, 83, 244, 0.50)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 8
		},
		{
		    "shape": "obj-rectangle",
		    "left": 250,
		    "top": 125,
		    "width": 25,
		    "height": 75,
		    "fill": "rgba(24, 83, 244, 0.04)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    strokeWidth: 6,
		    "PGTuid": 9
		}
	    ]
	}
    ],


    // These functions deal with entire Motif objects.
    moti_Delete: function(index){
	this.motiArray.splice(index, 1);
    },
    
    moti_Add: function(){
	var qty_new = $.grep(this.motiArray, function(e){ return e.Name.includes("New Mtf"); }).length + 1;

	//it will be 50% a circle, 50% a rectangle...
	var isCircle = Math.random() > 0.5;
	var Motif_Element_One = {
	    "shape": isCircle ? "obj-ellipse" : "obj-rectangle",
	    "left": isCircle ? 0 : 50,
	    "top": isCircle ? 0 : 50,
	    "fill": tinycolor.random().toHexString(),
	    "stroke": null,
	    "PGTuid": 0
	};
	
	if(isCircle){
	    Motif_Element_One["rx"] = 200;
	    Motif_Element_One["ry"] = 200;	    
	}else{
	    Motif_Element_One["width"]  = 300;
	    Motif_Element_One["height"] = 300;	    
	}
	
	this.motiArray.push({
	    Name: "New Mtf "+qty_new,
	    Params: {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    Elements: [Motif_Element_One]
	});
	return this.motiArray.length - 1;//return index of newly added element
    },
    

    moti_Duplicate: function(index_dupl){
	var new_motif = jQuery.extend(true, {}, this.motiArray[index_dupl]);
	new_motif.Name += " - copy";
	this.motiArray.splice(index_dupl+1, 0, new_motif);
    },


    EDITINGmoti: undefined,
    PGTuid_counter: 0,
    EDmoti_LoadFrom: function(index){
	this.EDITINGmoti = jQuery.extend(true, {}, this.motiArray[index]);

	//upon "load", set the PGTuid counter to one greater than the largest UID present.
	var max_PGTuid = 0;
	$.each( DM.EDITINGmoti.Elements, function( index, element ) {
	    max_PGTuid = Math.max(element.PGTuid, max_PGTuid);
	});
	this.PGTuid_counter = max_PGTuid + 1;
	
    },

    
    EDmoti_Save: function(replace_me_index){
	this.motiArray[replace_me_index] = this.EDITINGmoti;
	this.EDITINGmoti = null;
    },
    

    // These functions deal deal with "Motif Elements" of the "EDITINGmoti"
    EDmoti_NewElement: function(PropsObj){
	var new_uid = this.PGTuid_counter;
	this.PGTuid_counter++
	PropsObj.PGTuid = new_uid;

	this.EDITINGmoti.Elements.push(PropsObj);
	return new_uid;
    },

    
    EDmoti_DeleteElement: function(PGTuid){
	var new_uid = this.PGTuid_counter;
	var El_index = DM.EDITINGmoti.Elements.findIndex(function(El){return El.PGTuid == PGTuid;});
	DM.EDITINGmoti.Elements.splice(El_index, 1);
    },


    EDmoti_UpdateElement: function(PGTuid, PropsObj){

	// the jQuery grep function which searches array for elements that match a filter function
	// note how grep returns an ARRAY of the matched elements, so I must select the actual element using [0]
	var Updating_Element = $.grep(DM.EDITINGmoti.Elements, function(El){return El.PGTuid == PGTuid;})[0];

	//use jQuery to iterate over elements of 'PropsObj'
	$.each( PropsObj, function( key, value ) {
	    Updating_Element[key] = value;
	});

    }


    
};
