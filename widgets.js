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
		var options = param2;
	    }else{
		var action = "unknown option";
	    }
	}else{
	    var action = "initialise";
	    var options = param1;
	}

	   return this.each(function() {
	       //code run on every matched element
	       

	       if (action == "initialise"){// LOGIC to initialise element

		   /*options list:
		   */

		   var $El = $(this);

		   //store custom props in the element
		   $El.data({
		       data_class_key: options.data_class,
		       text_length: options.text_length,
		       U_obj: options.underlying_obj,
		       U_key: options.underlying_key
		   });

		   //this code executes to initialise the element's value, if the full reference is supplied
		   if((options.underlying_obj !== undefined)&&(options.underlying_key !== undefined)){
		       $El.addClass(options.style_class)
			   .val(options.underlying_obj[options.underlying_key]);
		   }


		   // call to initialise it with units etc.
		   $(this).SmartInput("update", {UI_enable: false});

		   //now we add remove old and add new generic listeners...
		   $El.off()
		       .on("focusout", function(){
			   $El.data("U_obj")[$El.data("U_key")] = $(this).val();
			   $(this).SmartInput("update", {UI_enable: false});
			   if(options.cb_focusout != undefined){options.cb_focusout();}//execute callback if defined.
		       })
		       .on("click", function(){
			   if((options.click_filter === undefined)||(options.click_filter())){
			       $(this).SmartInput("update", {UI_enable: true});
			   }
		       })
		       .on("change", function(){
			   //$(this).SmartInput("update", {UI_enable: false}); // maybe good to have, maybe not???? 
			   if(options.cb_change != undefined){options.cb_change();}//execute callback if defined.
		       });




	       }else if(action == "update"){ // LOGIC to update element
		   
		   // this can also be used to update the cell to correctly reflect
		   // new "value_units", without a change in enabled/disabled state...

		   /*    -- options are all optional --
			 Ops = {
			 new_dc_key
			 data_change
			 underlying_obj
			 }
		   */

		   var $El = $(this);
		   var inital_dc_key = $El.data("data_class_key");

		   var data_change = false;
		   if(options !== undefined){
		       var change_dc = (options.new_dc_key != undefined) && (options.new_dc_key != inital_dc_key);
		       data_change = options.data_change === true;

		       //this is to change the data the input box refers to...
		       if(options.underlying_obj !== undefined){
			   //update the reference
			   $El.data({"U_obj": options.underlying_obj});
			   //update the <input value to reflect...
			   data_change = true;//flags it to happen shortly
		       }
		   }
		   $El.data({"data_class_key": change_dc ? options.new_dc_key : inital_dc_key});	//change the data class...
		   var data_props = widgets.data_classes_list[$El.data("data_class_key")];// properties of the input's data class

		   // Worth noting:  Number("sdf") = NaN     (which is different to: Number("") = 0 )!!!
		   // lines below handle both preping the string-with-units back to being to be a pure number, and interpreting
		   // the val of a <input type="number">
		   var val_str_digits_only = $El.val().replace(/[^0-9\.]/g,'');
		   var v_numeric = val_str_digits_only == "" ? NaN : Number(val_str_digits_only);
		   // or, scrap that and reread from underlying data.
		   var o = $El.data("U_obj");
		   var k = $El.data("U_key");
		   
		   if(o !== undefined){ //sometimes, smart-inputs can be created without underlying object being provided 
		       v_numeric = data_change ? o[k] : v_numeric;
		   }

		   v_numeric = Number(Number(v_numeric).toFixed(data_props.decimal_places));//truncate decimal places.


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

		   if(options.UI_enable){//convert to user-editable number only

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

	    }else{
		Error("SmartInput called with an unknown function commanded");
	    }

	});
    }
});
