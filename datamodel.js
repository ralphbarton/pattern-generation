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
		    value: "#E3DD8A"
		},
		{
		    prob: 15,
		    type: "solid",
		    value: "#78531F"
		},
		{
		    prob: 5,
		    type: "solid",
		    value: "#E38ABC"
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
		    value: ["#A9CF89","#79901A"]
		},
		{
		    prob: 5,
		    type: "range",
		    value: ["#0B17E6","#66A781"]
		},
		{
		    prob: 10,
		    type: "solid",
		    value: "#CF7713"
		}
	    ]
	},
	{
	    index: 2,
	    description: "Chequer",
	    contents: [
		{
		    prob: 21,
		    type: "solid",
		    value: "yellow"
		},
		{
		    prob: 21,
		    type: "solid",
		    value: "orange"
		},
		{
		    prob: 21,
		    type: "solid",
		    value: "green"
		},
		{
		    prob: 21,
		    type: "solid",
		    value: "purple"
		},
		{
		    prob: 16,
		    type: "solid",
		    value: "black"
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
    }
    
};
