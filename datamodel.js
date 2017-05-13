//data model...
var DM = {

    // Pass this function an Array of Objects (dictionaries).
    // It will return first object which contains a key value pair matching that supplied
    GetByKey_: function(Array, key, value){

	// the jQuery grep function which searches array for elements that match a filter function
	// note how grep returns an ARRAY of the matched elements, so I must select the actual element using [0]
	return $.grep(Array, function(e){ return e[key] == value; })[0];
    },
    
    uid: {
	//these values are based on the size of the dummy data lower down in this file...
	counters: {
	    "cpot": 4,
	    "grid": 2,
	    "plot": 4,
	    "motf": 2,
	    "patt": 1,
	},

	createNew: function(Object_Type){
	    return this.counters[Object_Type]++;
	}
    },
    
    
    cpotArray: [
	{
	    description: "Banana Pie",
	    uid: 0,
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
	    description: "Puddle sky",
	    uid: 1,
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
	    uid: 2,
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
	    uid: 3,
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
	new_pot.uid = this.uid.createNew("cpot");
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
	    description: "my first grid",
	    uid: 0,
	    type: "std",
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
	    description: "A square grid",
	    uid: 1,
	    type: "std",
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
	new_grid.uid = this.uid.createNew("grid");
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
	    description: "New Grid ("+qty_new+")",
	    uid: this.uid.createNew("grid"),
	    type: "std",
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
	    uid: 0,

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
	    uid: 1,
	    
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	},
	{
	    formula: "x+y",
	    uid: 2,
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	},
	{
	    formula: "z*log( (z-0.7)*(z+0.7*i)*(z+0.2*(i+1.3)) )^4",
	    uid: 3,
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
	    uid: this.uid.createNew("plot"),
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

















    motfArray: [
	{// 1st dummy motif...
	    Name: "Molecule",
	    uid: 0,
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
	    Name: "Tetris went home",
	    uid: 1,
	    Params: {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    Elements: [
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
	},
	{
	    "Name": "New Mtf 1",
	    "uid": 2,
	    "Elements": [
		{
		    "shape": "obj-ellipse",
		    "left": 0,
		    "top": 0,
		    "fill": "#91637c",
		    "stroke": null,
		    "PGTuid": 0,
		    "rx": 200,
		    "ry": 200
		}
	    ]
	},
	{
	    "Name": "New Mtf 3",
	    "uid": 3,
	    "Elements": [
		{
		    "shape": "obj-ellipse",
		    "left": 0,
		    "top": 0,
		    "fill": "#3f3684",
		    "stroke": null,
		    "PGTuid": 0,
		    "rx": 200,
		    "ry": 200
		}
	    ]
	},
	{
	    "Name": "New Mtf 4",
	    "uid": 4,
	    "Elements": [
		{
		    "shape": "obj-ellipse",
		    "left": 0,
		    "top": 0,
		    "fill": "#797344",
		    "stroke": null,
		    "PGTuid": 0,
		    "rx": 200,
		    "ry": 200
		}
	    ]
	},
	{
	    "Name": "New Mtf 4",
	    "uid": 5,
	    "Elements": [
		{
		    "shape": "obj-ellipse",
		    "left": 0,
		    "top": 0,
		    "fill": "#99286d",
		    "stroke": null,
		    "PGTuid": 0,
		    "rx": 200,
		    "ry": 200
		}
	    ]
	},
	{
	    "Name": "Square Leaf",
	    "uid": 6,
	    "Elements": [
		{
		    "shape": "obj-rectangle",
		    "left": 50,
		    "top": 50,
		    "fill": "#a3d583",
		    "stroke": null,
		    "PGTuid": 0,
		    "width": 300,
		    "height": 300
		}
	    ]
	},
	{
	    "Name": "Atom",
	    "uid": 7,
	    "Params": {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    "Elements": [
		{
		    "left": 24,
		    "top": 163,
		    "shape": "obj-ellipse",
		    "fill": "hsla(182, 69.55%, 46%, 0.38)",
		    "stroke": "rgba(195, 3, 54, 1.00)",
		    "strokeWidth": 5,
		    "rx": 172,
		    "ry": 25,
		    "PGTuid": 1
		},
		{
		    "left": 73.8,
		    "top": 318.6,
		    "shape": "obj-ellipse",
		    "fill": "hsla(108, 69.55%, 46%, 0.46)",
		    "stroke": "rgba(195, 3, 54, 1.00)",
		    "strokeWidth": 5,
		    "rx": 178,
		    "ry": 27,
		    "PGTuid": 2,
		    "angle": 306.8
		},
		{
		    "left": 142.2,
		    "top": 30.8,
		    "shape": "obj-ellipse",
		    "fill": "rgba(37, 206, 122, 0.46)",
		    "stroke": "rgba(195, 3, 54, 1.00)",
		    "strokeWidth": 5,
		    "rx": 173,
		    "ry": 27.5,
		    "PGTuid": 3,
		    "angle": 60.2
		}
	    ]
	}
    ],


    // These functions deal with entire Motif objects.
    motf_Delete: function(index){
	this.motfArray.splice(index, 1);
    },
    
    motf_Add: function(){
	var qty_new = $.grep(this.motfArray, function(e){ return e.Name.includes("New Mtf"); }).length + 1;

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
	
	this.motfArray.push({
	    Name: "New Mtf "+qty_new,
	    uid: this.uid.createNew("motf"),
	    Params: {
		"links": [],
		"random": [],
		"CP_picks": []
	    },
	    Elements: [Motif_Element_One]
	});
	return this.motfArray.length - 1;//return index of newly added element
    },
    

    motf_Duplicate: function(index_dupl){
	var new_motif = jQuery.extend(true, {}, this.motfArray[index_dupl]);
	new_motif.Name += " - copy";
	new_motif.uid = this.uid.createNew("motf");
	this.motfArray.splice(index_dupl+1, 0, new_motif);
    },


    EDITINGmotf: undefined,
    PGTuid_counter: 0,
    EDmotf_LoadFrom: function(index){
	this.EDITINGmotf = jQuery.extend(true, {}, this.motfArray[index]);

	//upon "load", set the PGTuid counter to one greater than the largest UID present.
	var max_PGTuid = 0;
	$.each( DM.EDITINGmotf.Elements, function( index, element ) {
	    max_PGTuid = Math.max(element.PGTuid, max_PGTuid);
	});
	this.PGTuid_counter = max_PGTuid + 1;
	
    },

    
    EDmotf_Save: function(replace_me_index){
	this.motfArray[replace_me_index] = this.EDITINGmotf;
	this.EDITINGmotf = null;
    },
    

    // These functions deal deal with "Motif Elements" of the "EDITINGmotf"
    EDmotf_NewElement: function(PropsObj){
	var new_uid = this.PGTuid_counter;
	this.PGTuid_counter++
	PropsObj.PGTuid = new_uid;

	this.EDITINGmotf.Elements.push(PropsObj);
	return new_uid;
    },

    
    EDmotf_DeleteElement: function(PGTuid){
	var new_uid = this.PGTuid_counter;
	var El_index = DM.EDITINGmotf.Elements.findIndex(function(El){return El.PGTuid == PGTuid;});
	DM.EDITINGmotf.Elements.splice(El_index, 1);
    },


    EDmotf_UpdateElement: function(PGTuid, PropsObj){
	var Updating_Element = DM.GetByKey_( DM.EDITINGmotf.Elements, "PGTuid", PGTuid);
	
	//use jQuery to iterate over elements of 'PropsObj'
	$.each( PropsObj, function( key, value ) {
	    Updating_Element[key] = value;
	});

    },








    pattArray: [
	{
	    Name: "Pattern 1",
	    uid: 0,
	    Motif_set: [{
		uid: 1,
		scale: 0.5,
		angle: 0,
		opacity: 1
	    }],
	    type: "grid",
	    pdrive_uid: 0
	},
	{
	    Name: "Frog Goat",
	    uid: 1,
	    Motif_set: [],
	    type: undefined,
	    pdrive_uid: undefined
	}
    ],
    
    patt_Delete: function(index){
	this.pattArray.splice(index, 1);
	return index == this.pattArray.length;//true if "index" now refers to a row that doesn't exist 
    },
    

    patt_Add: function(){
	var qty_new = $.grep(this.pattArray, function(e){ return e.Name.includes("New Pattern"); }).length + 1;
	this.pattArray.push({//default data
	    Name: "New Pattern ("+qty_new+")",
	    uid: this.uid.createNew("patt"),
	    Motif_set: [],
	    grid_uid: undefined,
	    plot_uid: undefined,
	    paint_uid: undefined
	});

	return this.pattArray.length - 1;//return index of newly added element
    },
    

    EDIT_patt_pushMotif: function(Pattern, motif_uid){
	Pattern.Motif_set.push({
	    uid: motif_uid,
	    scale: 0.5,
	    angle: 0,
	    opacity: 1
	});
    }

};
