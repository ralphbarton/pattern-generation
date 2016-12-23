var view_cp = {

    init: function(){
		
	//add initial data for colour pot rows...
	this.refresh_colour_pot_table();

	//initial scroll table - needs data in rows to work...
	global.scrolling_table_init();

	//add many cells into main preview
	$("#colour-pots-sample-container").append(
	    global.$div_array(169, "preview-cell-big")
	);
    },

    refresh_colour_pot_table: function(){
	$("#cpanel-table-colour-pots-list tbody").empty();//clear content
	var List = DM.ColourPotArray;
	for (var i=0; i < List.length; i++){
	    this.add_colour_pot_row(List[i]);  
	}
    },

    add_colour_pot_row: function(ColourPot){
	$("#cpanel-table-colour-pots-list tbody").append(
	    $('<tr/>').data({index: ColourPot.index})
		.append(
		$('<td/>').text(ColourPot.index+1),//I prefer 1-index values for the user...
		$('<td/>').text(ColourPot.description).click(function(){// clicked on DESCRIPTION cell
		    console.log("description clicked");
		    //replace cell contents with an INPUT element
		}),

		//Create the Pr cell...
		$('<td/>').addClass("preview-column").append(
		    $('<div/>').addClass("preview-container").append(global.$div_array(16, "preview-cell", ColourPot))
		),

		//Create the EDIT-DELETE-DUPLICATE cell...
		$('<td/>').addClass("action-column").append(
		    $('<span/>').addClass("action edit").text("Edit").show().click(function(){edit_cp.show();}),
		    $('<span/>').addClass("action dupl").text("Duplic.").hide().click(function(){
			var index = $(this).parent().parent().data("index");
			DM.duplicate_ColourPot(index);
			view_cp.refresh_colour_pot_table();
		    }),
		    $('<span/>').addClass("action dele").text("Delete").hide().click(function(){
			console.log("Delete button click");
		    }),
		    $('<img/>').attr("src","/icons/sort.svg")
			.attr("class","img-recycle")
			.data({cycler:1})
			.click(function(){//code to implement the swap-contents functionality...
			    var x = $(this).data("cycler");//read
			    x++;
			    if (x>3){x=1;}
			    var $edit = $(this).parent().find(".edit");
			    var $dupl = $(this).parent().find(".dupl");
			    var $dele = $(this).parent().find(".dele");
			    if(x==1){$edit.show(); $dupl.hide(); $dele.hide();}
			    if(x==2){$edit.hide(); $dupl.show(); $dele.hide();}
			    if(x==3){$edit.hide(); $dupl.hide(); $dele.show();}
			    $(this).data({cycler:x});
			})
		)

	    ).click(function(){ // this is the callback for clicking on the whole ROW
		$("#cpanel-table-colour-pots-list tr").removeClass("selected");
		$(this).addClass("selected");
		var pot_index = $(this).data("index");
		var ColourPot = DM.ColourPotArray[pot_index];
		$("#colour-pots-sample-container").children().each(function(){
		    $(this).css("background",logic.DrawFromColourPot(ColourPot))
		});
	    })
	)
    }

};
