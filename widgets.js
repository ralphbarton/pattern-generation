var widgets = {

    data_classes_list: {
	text: {
	    type: "text"
	},
	pixels: {
	    type: "number",
	    unit: "px",
	    unit_preceeds: false,
	    min: 0, //dynamic
	    max: 1500, //dynamic
	    std_steps: [1, 25, 100],
	    decimal_places: 0
	},
	percent: {
	    type: "number",
	    unit: "%",
	    unit_preceeds: false,
	    min: 0,
	    max: 100,
	    std_steps: [0.2, 1, 10],
	    decimal_places: 1
	},
	degrees: {
	    type: "number",
	    unit: "°",
	    unit_preceeds: false,
	    min: 0,
	    max: 90,
	    std_steps: [0.5, 1, 5],
	    decimal_places: 1
	},
	quantity: {
	    type: "number",
	    unit: "n=",
	    unit_preceeds: true,
	    min: 0,
	    max: 250,
	    std_steps: [1, 2, 5],
	    decimal_places: 0
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
	    data_class_key: Ops.data_class,
	    text_length: Ops.text_length,
	    U_obj: Ops.underlying_obj,
	    U_key: Ops.underlying_key
	});

	//this code executes to initialise the element's value, if the full reference is supplied
	if((Ops.underlying_obj !== undefined)&&(Ops.underlying_key !== undefined)){
	    $El.addClass(Ops.style_class)
		.val(Ops.underlying_obj[Ops.underlying_key]);
	}

	// call to initiate it with units etc.
	widgets.input_cell_update(elem, false);

	//now we add remove old and add new generic listeners...
	$El.off()
	    .on("focusout", function(){
		$El.data("U_obj")[$El.data("U_key")] = $(elem).val();
		widgets.input_cell_update(elem, false);
		if(Ops.cb_focusout != undefined){Ops.cb_focusout();}//execute callback if defined.
	    })
	    .on("click", function(){
		if((Ops.click_filter === undefined)||(Ops.click_filter())){
		    widgets.input_cell_update(elem, true);
		}
	    })
	    .on("change", function(){
		//widgets.input_cell_update(elem, false);    // maybe good to have, maybe not???? 
		if(Ops.cb_change != undefined){Ops.cb_change();}//execute callback if defined.
	    });
    },

    // this can also be used to update the cell to correctly reflect
    // new "value_units", without a change in enabled/disabled state...
    input_cell_update: function(input_elem, enable, Ops){

	var $El = $(input_elem);
	var inital_dc_key = $El.data("data_class_key");

	var data_change = false;
	if(Ops !== undefined){
	    var change_dc = (Ops.new_dc_key != undefined) && (Ops.new_dc_key != inital_dc_key);
	    data_change = Ops.data_change === true;

	    //this is to change the data the input box refers to...
	    if(Ops.underlying_obj !== undefined){
		//update the reference
		$El.data({"U_obj": Ops.underlying_obj});
		//update the <input value to reflect...
		data_change = true;//flags it to happen shortly
	    }
	}
	$El.data({"data_class_key": change_dc ? Ops.new_dc_key : inital_dc_key});	//change the data class...
	var data_props = this.data_classes_list[$El.data("data_class_key")];// properties of the input's data class

	// Worth noting:  Number("sdf") = NaN     (which is different to: Number("") = 0 )!!!
	// lines below handle both preping the string-with-units back to being to be a pure number, and interpreting
	// the val of a <input type="number">
	var val_str_digits_only = $El.val().replace(/[^0-9\.]/g,'');
	var v_numeric = val_str_digits_only == "" ? NaN : Number(val_str_digits_only);
	// or, scrap that and reread from underlying data.
	var o = $El.data("U_obj");
	var k = $El.data("U_key");
	v_numeric = data_change ? o[k] : v_numeric;

	//manage actual data conversion, because of class change.
	if(change_dc){

	}

	v_numeric = Number(v_numeric.toFixed(data_props.decimal_places));//truncate decimal places.


/*
// these are the properties that must be respected...
	quantity: {
	    type: "number",
	    unit: "n=",
	    unit_preceeds: true,
	    min: 0, //dynamic
	    max: 1500, //dynamic
	    std_steps: [1, 2, 5],
	    decimal_places: 0
	},
*/

	if(enable){//convert to user-editable number only

	    if(data_props.type == "number"){
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
		if(data_props.type == "number"){
		    // 2. test for invalid data - this won't happen, because the "numeric" type doesn't allow it
		    if(isNaN(v_numeric)){
			v_numeric = $El.data("value_on_freeze");
		    }
		    // 3. set value to include the units string.
		    var UU = data_props.unit
		    var value_str = data_props.unit_preceeds ? UU+v_numeric : v_numeric+UU;
		    $El.val(value_str);
		}else{
		    //limit text length...
		    $El.val(
			//todo - toast if name truncation actually does occur.
			$El.val().substring(0, $El.data("text_length"))
		    );
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
