var export_pat = {

    init: function(){
	
	$("#cpanel-main-tabs #ui-id-8").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.ColourPotArray, null, 2)
	    );
	});
    }

};
