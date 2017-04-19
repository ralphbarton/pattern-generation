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
	    std_steps: [1, 10, 100],
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
	dimentionless: {
	    type: "number",
	    unit: "",
	    unit_preceeds: false,
	    min: (-10000),//Infinity
	    max: 10000,//Infinity
	    std_steps: [0.1, 1, 100],
	    decimal_places: 2
	},

    },

    SmartInput_step: 0,
    
    
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


/*

  ways of calling:

  1. create...
  $("#selection").SmartInput({ initialisation_object });

  1. update...
  $("#selection").SmartInput( "update", {update_object} });

*/

jQuery.fn.extend({
    SmartInput: function(param1, param2) {

	//code runs once
	if(typeof(param1) == "string"){

	    if(param1 == "update"){
		var action = "update";
		var options = param2 || {};
	    }else{
		var action = "unknown option";
	    }
	}else{
	    var action = "initialise";
	    var options = param1 || {};
	}

	return this.each(function() {
	    //code run on every matched element


	    

	    if (action == "initialise"){// LOGIC to initialise element

		/*options list:
		  data_class
		  data_class_override
		  ----{min, max, steps}
		  step_index
		  text_length
		  underlying_obj
		  underlying_key
		  cb_focusout
		  cb_change
		  cb_init
		  click_filter
		  underlying_from_DOM_onChange
		*/

		//store custom props in the element
		$(this).data({
		    data_class_key: options.data_class,
		    data_class_override: options.data_class_override,
		    step_index: 0,//default at zero
		    text_length: options.text_length,
		    U_obj: options.underlying_obj,
		    U_key: options.underlying_key
		});

		//this code executes to initialise the element's value, if the full reference is supplied
		if((options.underlying_obj !== undefined)&&(options.underlying_key !== undefined)){
		    $(this).val(options.underlying_obj[options.underlying_key]);
		}


		// call to initialise it with units etc.
		$(this).SmartInput("update", {UI_enable: false});


		//now we add remove old and add new generic listeners...
		$(this).off()
		    .on("focusout", function(){
			$(this).SmartInput("update",{
			    UI_enable: false,
			    true_focusout: true			
			});
			if(options.cb_focusout != undefined){options.cb_focusout(this);}//execute callback if defined.
		    })
		    .on("click", function(){
			if((options.click_filter === undefined)||(options.click_filter())){
			    $(this).SmartInput("update", {UI_enable: true});
			}

			// CTRL + click => increase (/cycle) the step size...
			if(global.keys.CTRL){
			    // call to cycle the step_index
			    $(this).SmartInput("update", {step_index_cycle: true});
			}

		    })
		    .on("change", function(){
			if(options.underlying_from_DOM_onChange){
			    $(this).SmartInput("update", {change_underlying_from_DOM: true});
			}
			if(options.cb_change != undefined){options.cb_change();}//execute callback if defined.
		    });


		//the INITIALISATION callback may be applied to the element.
		if(options.cb_init != undefined){options.cb_init(this);}//execute callback if defined.


	    }else if(action == "update"){ // LOGIC to update element
		
		// this can also be used to update the cell to correctly reflect
		// new "value_units", without a change in enabled/disabled state...

		/*    -- options are all optional --
		      new_dc_key
		      data_change
		      step_index
		      step_index_cycle
		      underlying_obj
		      change_underlying_from_DOM
		      UI_enable
		      true_focusout
		*/

		if(options.new_dc_key != undefined){//if a new data class is supplied...
		    $(this).data({"data_class_key": options.new_dc_key});
		}

		//this is to change the data the input box refers to...
		if(options.underlying_obj !== undefined){
		    //update the reference
		    $(this).data({"U_obj": options.underlying_obj});
		}

		// (1) Extract object (2) apply updates to it (3) re-store it away.
		if(options.data_class_override != undefined){
		    var ovr = $(this).data("data_class_override");
		    ovr.min = options.data_class_override.min || ovr.min;
		    ovr.max = options.data_class_override.max || ovr.max;
		    ovr.steps = options.data_class_override.steps || ovr.steps;
		    $(this).data({"data_class_override": ovr});
		}

		if(options.step_index != undefined){//if a new step index is supplied...
		    $(this).data({"step_index": options.step_index});
		}
		  
		if(options.step_index_cycle != undefined){//if a new step index is supplied...
		    var step_i = $(this).data("step_index");
		    step_i = (step_i+1)%3;
		    $(this).data({"step_index": step_i});
		}
		
		
		// properties class for input data
		var data_props = widgets.data_classes_list[$(this).data("data_class_key")];

		if(data_props.type == "number"){
		    // Worth noting:  Number("sdf") = NaN     (which is different to: Number("") = 0 )!!!
		    // lines below handle prepping the string-with-units back to being a pure number and interpreting
		    // the val of a <input type="number">
		    var val_str_digits_only = $(this).val().replace(/[^0-9\.-]/g,'');
		    var v_numeric = val_str_digits_only == "" ? NaN : Number(val_str_digits_only);

		    // or, scrap that and reread from underlying data.
		    var o = $(this).data("U_obj");
		    var k = $(this).data("U_key");
		    
		    if(o !== undefined){ //sometimes, smart-inputs can be created without underlying object being provided 
			var data_change = options.data_change === true || options.underlying_obj !== undefined;
			v_numeric = data_change ? o[k] : v_numeric;
		    }

		    // this is only to truncate number decimal places and keep data type number and not String
		    v_numeric = Number(Number(v_numeric).toFixed(data_props.decimal_places));
		    


		    // Determine if overrides are in place to change numeric min/max...
		    var ovr = $(this).data("data_class_override");
		    var step_i = $(this).data("step_index");

		    var numeric_min = data_props.min;
		    var numeric_max = data_props.max;
		    var numeric_step = data_props.std_steps[step_i];		    

		    if(ovr){
			numeric_min = ovr.min || numeric_min;
			numeric_max = ovr.max || numeric_max;
			numeric_step = (ovr.steps || data_props.std_steps)[step_i];
		    }

		    // 1. apply min & max to actual number
		    v_numeric = Math.min(Math.max(v_numeric, numeric_min), numeric_max);
		    
		    // 2. apply min & max to input element
		    $(this).attr('min', numeric_min)
			.attr('max', numeric_max)
			.attr('step', numeric_step); //choose the smallest step, since smaller steps are banned
		}

		/*
		// this is an example for the properties in "data_props"
		{
		type: "number",
		unit: "n=",
		unit_preceeds: true,
		min: 0, //dynamic
		max: 1500, //dynamic
		std_steps: [1, 2, 5],
		decimal_places: 0
		},
		*/

		if(options.change_underlying_from_DOM === true){
		    $(this).data("U_obj")[$(this).data("U_key")] = v_numeric;		       

		}else if(options.UI_enable === true){//convert to user-editable number only

		    if(data_props.type == "number"){
			// 1. when enabling, catch old (validated) v_numeric, in case an invalid one is added.
			$(this).data({value_on_freeze: v_numeric});

			// 2. (if numeric) change content to value without units...
			$(this).val(v_numeric);
			$(this).attr('type', 'number');
		    }

		    // 3. Change display class and readonly attribute
		    $(this).attr('readonly', false).addClass("ui-enabled");

		    // 4. Prevent a focusout event for a few ms
		    // please add a comment here explaining why it may be desireable to do this...
		    $(this).data({disable_focusout: true});	    
		    $element = $(this);
		    setTimeout(
			function(){
			    $element.data({disable_focusout: false});
			},
			20
		    );

		}else{//convert to read-only number+unit string
		    if(!$(this).data("disable_focusout")){
			// 1. Change display class and readonly attribute - do first because units are text...
			$(this).attr('readonly', true).removeClass("ui-enabled").attr('type', 'text');
			if(data_props.type == "number"){
			    // 2. test for invalid data - this won't happen, because the "numeric" type doesn't allow it
			    if(isNaN(v_numeric)){
				v_numeric = $(this).data("value_on_freeze");
			    }
			    // 3. set value to include the units string.
			    var UU = data_props.unit
			    var value_str = data_props.unit_preceeds ? UU+v_numeric : v_numeric+UU;
			    $(this).val(value_str);

			    if(options.true_focusout === true){
				// write value into underlying data
				$(this).data("U_obj")[$(this).data("U_key")] = v_numeric;
			    }
			}else{
			    //limit text length...
			    $(this).val(
				//todo - toast if name truncation actually does occur.
				$(this).val().substring(0, $(this).data("text_length"))
			    );
			    //I think this next line (3 lines) is necessary...
			    if(options.true_focusout === true){
				$(this).data("U_obj")[$(this).data("U_key")] = $(this).val();
			    }
			}
		    }
		}

	    }else{
		Error("SmartInput called with an unknown function commanded");
	    }

	});
    }
});
