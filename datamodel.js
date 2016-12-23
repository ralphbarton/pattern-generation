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
		    prob: 50,
		    type: "solid",
		    value: "cyan"
		},
		{
		    prob: 50,
		    type: "solid",
		    value: "red"
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
    }
};
