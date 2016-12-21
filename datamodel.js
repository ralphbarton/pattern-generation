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
	    description: "Apricot",
	    contents: [
		{
		    prob: 100,
		    type: "solid",
		    value: "#FF00FF"
		},
	    ]
	}
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
