var widgets = {

    value_types_list: {
	text: {
	    type: "text"
	},
	pixels: {
	    type: "number",
	    unit: "px",
	    unit_preceeds: false,
	    min: 0,
	    max: 1500,
	    std_steps: [1, 25, 100]
	},
	percent: {
	    type: "number",
	    unit: "%",
	    unit_preceeds: false,
	    min: 0,
	    max: 100,
	    std_steps: [0.2, 1, 10]
	},
	quantity: {
	    type: "number",
	    unit: "n=",
	    unit_preceeds: true,
	    min: 0,
	    max: 250,
	    std_steps: [1, 2, 5]
	},
    },

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

	//store custom props in the element
	$El.data({
	    value_type: Ops.value_type,
	    text_length: Ops.text_length
	});

	//this code executes to initialise the element
	$El
	    .addClass(Ops.style_class)
	    .val(Ops.underlying_obj[Ops.underlying_key]);

	// call to initiate it with units etc.
	widgets.table_cell_edit(elem, false);

	//now we add the generic listeners...
	$El
	    .on("focusout", function(){
		Ops.underlying_obj[Ops.underlying_key] = $(elem).val();
		widgets.table_cell_edit(elem, false);})
	    .on("click", function(){
		if((Ops.click_filter === undefined)||(Ops.click_filter())){
		    widgets.table_cell_edit(elem, true);
		}
	    })
    },

    // this can also be used to update the cell to correctly reflect
    // new "value_units", without a change in enabled/disabled state...
    table_cell_edit: function(input_elem, enable){

	var $El = $(input_elem);
	// Lord almighty. Look at this: Number("sdf") = NaN yet Number("") = 0
	var val_str_digits_only = $El.val().replace(/[^0-9\.]/g,'');
	var v_numeric = val_str_digits_only == "" ? NaN : Number(val_str_digits_only);
	console.log(v_numeric);
	//this is superflous; provided by <input type="number">
	//;//extract a number with a decimal point from string
	var validate_int = $El.data("unit") != undefined;

	if(enable){//convert to user-editable number only

	    if(validate_int){
		// 1. when enabling, catch old (validated) v_numeric, in case an invalid one is added.
		$El.data({value_on_freeze: v_numeric});

		// 2. (if numeric) change content to value without units...
		$El.val(v_numeric);
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

	}else{//convert to read-only number+unit string
	    if(!$El.data("disable_focusout")){

		// 1. Change display class and readonly attribute - do first because units are text...
		$El.attr('readonly', true).removeClass("ui-enabled").attr('type', 'text');
		if(validate_int){
		    // 2. test for invalid data - this won't happen, because the "numeric" type doesn't allow it
		    if(isNaN(v_numeric)){
			v_numeric = $El.data("value_on_freeze");
		    }
		    // 3. set value to include the units string.
		    var unit = $El.data("unit");
		    $El.val(v_numeric+unit);
		}else{
		    //take action here to potentially truncate the text string to limit value..

		    // todo
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
