//data model...
var DM = {
    
    ColourPotArray: [
	{
	    description: "Banana Pie",
	    contents: [
		{
		    prob: 80,
		    type: "solid",
		    solid: "#E3DD8A"
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
	    contents: [
		{
		    prob: 40,
		    type: "solid",
		    solid: "#02a7eb"
		},
		{
		    prob: 25,
		    type: "range",
		    solid: "#6ab523",
		    range: [
			"#49fc0f",
			"#617233"
		    ]
		},
		{
		    prob: 16,
		    type: "solid",
		    solid: "#525261",
		    range: [
			"#5c479f",
			"#404040"
		    ]
		},
		{
		    prob: 16,
		    type: "range",
		    solid: "#362a50",
		    range: [
			"#5c228b",
			"#232324"
		    ]
		},
		{
		    prob: 3,
		    type: "range",
		    solid: "#af6e14",
		    range: [
			"#f6ca00",
			"#6c3d24"
		    ]
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

    duplicate_ColourPot: function(index_dupl){
	/* Deep copy
	   var newObject = jQuery.extend(true, {}, oldObject);
	*/
	var new_pot = jQuery.extend(true, {}, this.ColourPotArray[index_dupl]);
	new_pot.description += " - copy";
	this.ColourPotArray.splice(index_dupl+1, 0, new_pot);
    },

    delete_ColourPot: function(index){
	this.ColourPotArray.splice(index, 1);
	return index == this.ColourPotArray.length;//true if "index" now refers to a row that doesn't exist 
    },

    editing_ColourPot: undefined,
    edit_ColourPot: function(index){
	this.editing_ColourPot = jQuery.extend(true, {}, this.ColourPotArray[index]);
    },

    save_editing_ColourPot: function(replace_me_index){
	this.ColourPotArray[replace_me_index] = this.editing_ColourPot;
	this.editing_ColourPot = null;
    },


    // The three functions below are for manipulating the probabilities list

    sumProbs_editing_ColourPot: function(){
	var items = this.editing_ColourPot.contents;	
	var accumulator = 0;

	for (var i=0; i < items.length; i++){
	    accumulator += items[i].prob;
	}
	return accumulator;
    },

    sum100_editing_ColourPot: function(){
	var items = this.editing_ColourPot.contents;	
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

    allEqualProbs_editing_ColourPot: function(){
	var items = this.editing_ColourPot.contents;	
	for (var i=0; i < items.length; i++){
	    items[i].prob = 3;//an arbitrary number
	}
    },

    deleteRow_editing_ColourPot: function(index){
	this.editing_ColourPot.contents.splice(index, 1);
    },

    newRow_editing_ColourPot: function(row_col){
	this.editing_ColourPot.contents.push(
	    {
		prob: 15,
		type: "solid",
		solid: (row_col || "#FF0000")
	    }
	);
	return this.editing_ColourPot.contents.length;
    },












    
    GridsArray: [
	{
	    type: "std",
	    description: "my first grid",
	    n_dimentions: 2,
	    line_sets:[
		{// set 1
		    spacing: 75,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 15
		},
		{// set 2
		    spacing: 64,
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
		    shift: 0.3,
		    angle: 45
		},
		{// set 2
		    spacing: 12.5,
		    spacing_unit: 'quantity',
		    shift: 0.5,
		    angle: 55
		}
	    ]
	}
    ],

    deleteRow_grid: function(index){
	this.GridsArray.splice(index, 1);
    },
    
    duplicate_grid: function(index_dupl){
	//deep object copy via jquery
	var new_grid = jQuery.extend(true, {}, this.GridsArray[index_dupl]);
	new_grid.description += " - copy";
	this.GridsArray.splice(index_dupl+1, 0, new_grid);
    },









    PlotsArray: [
	{
	    formula: "i*exp(3*z^3)*(z+1.2)^3",
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
	    },
	},
	{
	    formula: "z^7",
	    section: {}
	},
	{
	    formula: "x+y",
	    section: {}
	}

    ],

    deleteRow_plot: function(index){
	this.PlotsArray.splice(index, 1);
    },
    
    addRow_plot: function(){
	this.PlotsArray.push({//default data
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

    
};
