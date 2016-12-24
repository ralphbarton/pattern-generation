var edit_cp = {

    not_yet_initialised: true,

    init: function(){

	//initiate tabs...
	$("#cp-edit-tabs").tabs();

	//add action for cancel button
	$("#cp-edit-buttons #cancel").click(function(){edit_cp.hide()});
	$("#cp-edit-buttons #done").click(function(){edit_cp.hide()});

	//$("#cp-edit-slider").slider();

	this.not_yet_initialised = false;
    },

    show: function(index){

	if(this.not_yet_initialised){
	    this.init();
	}

	//Response to clicking Edit
	$("#cpanel-main").removeClass("cpanel-main-size1").addClass("cpanel-main-size2");
	$("#colour-pots-view").hide();
	$("#colour-pots-edit").show();
	$("#cpanel-main-tabs").tabs("option", "disabled", true);

	//create backup in data model - to be done before accessing the copy created...
	DM.edit_ColourPot(index);
	var POT = DM.editing_ColourPot;

	//set up the window visuals...
	$("#colour-pots-edit .TL-2").text(POT.index+1+". ");
	$("#colour-pots-edit .TL-3").val(POT.description);

	POT.contents.forEach(function(element,i){
	    edit_cp.table_row(element,i);
	})

    },

    table_row: function(row_data, i){
    	$("#cpanel-table-colour-pot-contents tbody").append(
	    $('<tr/>').data({index: i})
		.append(
		    $('<td/>').text(i+1),
		    $('<td/>').append(
			$('<input/>').addClass("prob-cell")
		    ),
		    $('<td/>').text("fancy content...")
		)
	);
    },

    hide: function(){
	//Response to closing Edit
	$("#cpanel-main").removeClass("cpanel-main-size2").addClass("cpanel-main-size1");
	$("#colour-pots-view").show();
	$("#colour-pots-edit").hide();
	$("#cpanel-main-tabs").tabs("option", "disabled", false);

    }

};
