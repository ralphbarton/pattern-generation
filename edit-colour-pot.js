var edit_cp = {

    not_yet_initialised: true,

    init: function(){

	//initiate tabs...
	$("#cp-edit-tabs").tabs();

	//add action for cancel button
	$("#cp-edit-buttons #cancel").click(function(){edit_cp.hide()});
	$("#cp-edit-buttons #done").click(function(){edit_cp.hide()});

	this.not_yet_initialised = false;
    },

    show: function(){

	if(this.not_yet_initialised){
	    this.init();
	}

	//Response to clicking Edit
	$("#cpanel-main").removeClass("cpanel-main-size1").addClass("cpanel-main-size2");
	$("#colour-pots-view").hide();
	$("#colour-pots-edit").show();
	$("#cpanel-main-tabs").tabs("option", "disabled", true);

    },

    hide: function(){
	//Response to closing Edit
	$("#cpanel-main").removeClass("cpanel-main-size2").addClass("cpanel-main-size1");
	$("#colour-pots-view").show();
	$("#colour-pots-edit").hide();
	$("#cpanel-main-tabs").tabs("option", "disabled", false);

    }

};
