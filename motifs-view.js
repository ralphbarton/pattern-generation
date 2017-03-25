var motifs_view = {


    init: function(){

	// 1. Add handlers for the buttons underneath the table...

	// 1.1 - Edit
	$("#motifs-view .table-buttons #edit").click(function(){
	    var index = 0;//TODO (index will not always be zero!
	    if(index !== undefined){
		motifs_edit.show(index);
	    }
	});

    },


    selected_row_i: undefined,
    regenerate_table: function(select_index){

    }

};
