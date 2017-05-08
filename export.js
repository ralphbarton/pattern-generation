var export_pat = {

    init: function(){


	// 1. tab selection handler
	$("#cpanel-main-tabs #ui-id-9").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.cpotArray, null, 2)
	    );
	});

	// 2. import JSON to colour pot
	$("#json-load-cpot").click(function(){
	    DM.cpotArray = JSON.parse($("#json-text").val());
	});


	// 3. Show CPOT json
	$("#export-buttons .button#cpot").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.cpotArray, null, 2)
	    );
	});

	// 4. Show Grids json
	$("#export-buttons .button#grid").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.gridArray, null, 2)
	    );
	});

	// 5. Show Plots json
	$("#export-buttons .button#plot").click(function(){
	    $("#json-text").val(
		JSON.stringify(DM.plotArray, null, 2)
	    );
	});

	// 6. Show Motifs json
	$("#export-buttons .button#moti").click(function(){
	    $("#json-text").val(
//		JSON.stringify(DM.motiArray, null, 2)
		JSON.stringify(DM.EDITINGmoti, null, 2)
	    );
	});


	
    }

};
