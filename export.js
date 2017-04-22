var export_pat = {

    init: function(){
	
	$("#cpanel-main-tabs #ui-id-9").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.ColourPotArray, null, 2)
	    );
	});

	$("#json-load").click(function(){
	    DM.ColourPotArray = JSON.parse($("#json-text").val());
	});

    }

};
