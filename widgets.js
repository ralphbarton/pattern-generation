var widgets = {

    /*options list:
      - styling (class)
      - type (text vs number)
      - units
      - precision
      - step sizes
      - (tie up all the above in value-type class)
      - underlying data reference
      - focus-condition
      - additional custom callbacks for focus-out (i.e. specific validation)
    */
    input_init: function(elem, Ops){
	var $El = $(elem);

	//this code executes to initialise the element
	$El.attr('type', 'text')// subsume this into an if statement...
	    .addClass(Ops.style_class)
	    .val(Ops.underlying_obj[Ops.underlying_key])
	    .attr('readonly', true);

	//now we add the generic listeners...
	$El
	    .on("focusout", function(){
		Ops.underlying_obj[Ops.underlying_key] = $(elem).val();
		widgets.table_cell_edit(elem,false);})
	    .on("click", function(){
		if((Ops.click_filter === undefined)||(Ops.click_filter())){
		    widgets.table_cell_edit(elem,true);
		}
	    })
    },

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
    },

    //this assumes an array of 2 functions as second parameter.
    actionLink_init: function(select, fn_listeners_array){
	
	$(select).find("div").each(function(i_div){
	    $(this).click(function(){
		
		// 1. instigate listener function if allowed
		if($(this).hasClass("action-link")){
		    fn_listeners_array[i_div]();
		    //2. upon clicking it, unset the link clicked as active
		    widgets.actionLink_unset(select, i_div)
		}
	    });
	});

	//initially, set left one as active.
	widgets.actionLink_unset(select, 1);
    },

    //using "activate_i" = "all" will put both links in a disabled state
    actionLink_unset: function(select, activate_i){
	$(select).find("div").each(function(i){
	    if((i == activate_i)||(activate_i === "all")){
		$(this).removeClass("action-link");
	    }else{
		$(this).addClass("action-link");
	    }
	});
    }

    
};
