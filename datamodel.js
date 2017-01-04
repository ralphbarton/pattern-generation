//data model...
var DM = {
    
    ColourPotArray: [
	{
	    index: 0,
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
	    index: 1,
	    description: "Lush Woods",
	    contents: [
		{
		    prob: 85,
		    type: "range",
		    range: ["#A9CF89","#79901A"]
		},
		{
		    prob: 5,
		    type: "range",
		    range: ["#0B17E6","#66A781"]
		},
		{
		    prob: 10,
		    type: "solid",
		    solid: "#CF7713"
		}
	    ]
	},
	{
	    index: 2,
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
	    index: 3,
	    description: "Primary dotters",
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

	//also shuffle up indeces
	for (var i= index_dupl+1; i < this.ColourPotArray.length; i++){
	    this.ColourPotArray[i].index = i;
	}
    },

    delete_ColourPot: function(index){
	this.ColourPotArray.splice(index, 1);
	//also shuffle down indeces
	for (var i= index; i < this.ColourPotArray.length; i++){
	    this.ColourPotArray[i].index = i;
	}
	return index == this.ColourPotArray.length;//true if "index" now refers to a row that doesn't exist 

    },

    editing_ColourPot: undefined,
    edit_ColourPot: function(index){
	this.editing_ColourPot = jQuery.extend(true, {}, this.ColourPotArray[index]);
    },

    save_editing_ColourPot: function(){
	var save_index = this.editing_ColourPot.index;
	this.ColourPotArray[save_index] = this.editing_ColourPot;
	this.editing_ColourPot = null;
	return save_index;
    },


    // The three functions below are for manipulating the probabilities list

    validProbs_editing_ColourPot: function(){
	var items = this.editing_ColourPot.contents;	
	var accumulator = 0;

	for (var i=0; i < items.length; i++){
	    accumulator += items[i].prob;
	}
	return accumulator == 100;
    },

    sum100_editing_ColourPot: function(){
	var items = this.editing_ColourPot.contents;	
	var accumulator = 0;

	//1. sum
	for (var i=0; i < items.length; i++){
	    accumulator += items[i].prob;
	}

	//2. rescale (with rounding and guarenteed sum=100)
	var r_acc = 0;
	for (var i=0; i < items.length; i++){
	    var rounded = +((items[i].prob * (100/accumulator)).toFixed(0));
	    var remainder = +((100-r_acc).toFixed(0));
	    items[i].prob = (i == items.length-1 ? remainder : rounded);
	    r_acc += rounded;
	}

    },

    allEqualProbs_editing_ColourPot: function(){
	var items = this.editing_ColourPot.contents;	
	for (var i=0; i < items.length; i++){
	    items[i].prob = 3;//an arbitrary number
	}
    }

    
};
