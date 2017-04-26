var export_pat = {

    init: function(){


	// 1. tab selection handler
	$("#cpanel-main-tabs #ui-id-9").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.ColourPotArray, null, 2)
	    );
	});

	// 2. import JSON to colour pot
	$("#json-load-cpot").click(function(){
	    DM.ColourPotArray = JSON.parse($("#json-text").val());
	});


	// 3. Show CPOT json
	$("#export-buttons .button#cpot").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.ColourPotArray, null, 2)
	    );
	});

	// 4. Show Grids json
	$("#export-buttons .button#grid").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.GridsArray, null, 2)
	    );
	});

	// 5. Show Plots json
	$("#export-buttons .button#plot").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.PlotsArray, null, 2)
	    );
	});

	// 6. Show Motifs json
	$("#export-buttons .button#moti").click(function(){
	    $("#json-text").val(
//		JSON.stringify(DM.MotifsArray, null, 2)
		JSON.stringify(DM.MotifDummy, null, 2)
	    );
	});


	
    }

};
