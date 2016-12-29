var widgets = {

    table_cell_edit: function(input_elem, enable){

	var $El = $(input_elem);
	var int_val = parseInt($El.val());
	var validate_int = $El.data("unit") != undefined;

	if(enable){

	    if(validate_int){
		// 1. when enabling, catch old (validated) int_val, in case an invalid one is added.
		$El.data({value_on_freeze: int_val});

		// 2. (if numeric) change content to value without units...
		$El.val(int_val);
		$El.attr('type', 'number');
	    }

	    // 3. Change display class and readonly attribute
	    $El.attr('readonly', false).addClass("ui-enabled");

	    // 4. Prevent a focusout event for a few ms
	    $El.data({disable_focusout: true});	    
	    setTimeout(
		function(){
		    $El.data({disable_focusout: false});
		},
		20
	    );

	}else{

	    if(!$El.data("disable_focusout")){

		// 1. Change display class and readonly attribute - do first because units are text...
		$El.attr('readonly', true).removeClass("ui-enabled").attr('type', 'text');

		if(validate_int){
		    // 2. test for invalid data - this won't happen, because the "numeric" type doesn't allow it
		    if(isNaN(int_val)){
			int_val = $El.data("value_on_freeze");
		    }
		    // 3. set value to include the units string.
		    var unit = $El.data("unit");
		    $El.val(int_val+unit);
		}

	    }
	}
    }
};
