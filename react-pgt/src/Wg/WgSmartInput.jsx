import React from 'react';


const dataUnitTypes = {
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
    }
};


class WgSmartInput extends React.PureComponent {

    constructor(props) {
	super(props);
	const uType = dataUnitTypes[props.dataUnit];
	this.state = {
	    mouseIsEntered: false,
	    isFocused: false,
	    min: (props.min !== undefined ? props.min : uType.min),
	    max: (props.max !== undefined ? props.max : uType.max),
	    step: (props.step !== undefined ? props.step : uType.std_steps[0]),
	    prevChangeCompleteValue: this.props.value
	};
	console.log("SmartInput Constructor called");
    }

    isEditable(){ return (this.props.editEnabled !== false) && (this.state.mouseIsEntered || this.state.isFocused);}
    
    handleMouse(type, value){
	let adjustment = {};
	adjustment[type] = value;
	this.setState(adjustment);
    }

    handleChangeComplete(){
	//remember how this.props.value is the externally controlled <input> value
	const valueChange = this.props.value !== this.state.prevChangeCompleteValue;
	this.setState({prevChangeCompleteValue: this.props.value});	
	const cb = this.props.onChangeComplete;
	if((cb !== undefined)&&(valueChange)){
	    cb();		  
	}	
    }

    generateUiValue(v_numeric){
	const uType = dataUnitTypes[this.props.dataUnit];
	//truncate to required accuracy...

	// in fact, the required accuracy is rounding to closest step
	const v_numeric1p5 = Math.round(Number(v_numeric)/this.state.step) * this.state.step;
	//due to floating point divide-by-5 is recurring, need to to standard rounding too
	const v_numeric2 = Number(Number(v_numeric1p5).toFixed(uType.decimal_places));
	
	switch (this.isEditable()){
	    
	case true:
	    return v_numeric2;
	    
	default:
	    const UU = uType.unit;
	    //create a string with number & join to it the units
	    return uType.unit_preceeds ? UU+v_numeric2 : v_numeric2+UU;
	    
	}
	//needs to convert input value to show units and type between text and numeric....
    }

    handleInputChange(event){
	const raw_value = event.target.value;
	const val_str_digits_only = raw_value.replace(/[^0-9.-]/g,'');
	const v_numeric1 = val_str_digits_only === "" ? NaN : Number(val_str_digits_only);
	//truncate to required accuracy...
	const uType = dataUnitTypes[this.props.dataUnit];
	const v_numeric2 = Number(Number(v_numeric1).toFixed(uType.decimal_places));
	// Limit to within min & max
	const v_numeric3 = Math.min(Math.max(v_numeric2, this.state.min), this.state.max);
	this.props.onChange(v_numeric3);
    }    

    
    render() {
	const isFocus = (this.props.editEnabled !== false) && this.state.isFocused;
	const inputClasses = this.props.className + (isFocus ? " synthFocus" : "");
	const inputNativeType = this.isEditable()?"number":"text";
	return (
	    <input
	       className={inputClasses}
	       value={this.generateUiValue(this.props.value)} 
	       onChange={(ev)=>{this.handleInputChange(ev);}}
	       onMouseEnter={this.handleMouse.bind(this,"mouseIsEntered", true)}
	      onMouseLeave={()=>{
		  this.handleChangeComplete();
		  this.handleMouse("mouseIsEntered", false);
	      }}
	      onFocus={this.handleMouse.bind(this,"isFocused", true)}
	      onBlur={()=>{
		  this.handleChangeComplete();
		  this.handleMouse("isFocused", false);
	      }}
	       type={inputNativeType}
	       min={this.state.min}
	       max={this.state.max}
	       step={this.state.step}
	       />
	);
    }
}

export default WgSmartInput;
