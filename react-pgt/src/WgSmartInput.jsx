import React, { Component } from 'react';
import './WgSmartInput.css';


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


class WgSmartInput extends Component {

    constructor() {
	super();
	this.state = {
	    mouseIsEntered: false,
	    isFocused: false
	};
	console.log("SmartInput Constructor called");
    }

    isEditable(){ return this.props.editEnabled && (this.state.mouseIsEntered || this.state.isFocused);}
    
    handleMouse(type, value){
	let adjustment = {};
	adjustment[type] = value;
	this.setState(adjustment);
	console.log(this.state);

	
//	const value2 = this.refs.input.value;
//	console.log(value2);
//	console.log(this.refs.input.type);
    }


    generateUiValue(v_numeric){
	switch (this.isEditable()){
	    
	case true:
	    // strip units and return pure number
//	    const ui_value = this.refs.input.value;
	    return v_numeric;
	    
	default:
	    const uType = dataUnitTypes[this.props.dataUnit];
	    const UU = uType.unit;
	    //parse number and join to it the units
	    return uType.unit_preceeds ? UU+v_numeric : v_numeric+UU;
	    
	}
	//needs to convert input value to show units and type between text and numeric....
    }

    
    render() {
	const inputClasses = this.props.className + (this.isEditable() ? " synthFocus" : "");
	const inputNativeType = this.isEditable()?"number":"text";
	return (
	    <input
	       className={inputClasses}
	       value={this.generateUiValue(this.props.value)} 
	       onChange={this.props.onChange}
	       onMouseEnter={this.handleMouse.bind(this,"mouseIsEntered", true)}
	       onMouseLeave={this.handleMouse.bind(this,"mouseIsEntered", false)}
	       onFocus={this.handleMouse.bind(this,"isFocused", true)}
	       onBlur={this.handleMouse.bind(this,"isFocused", false)}
	       type={inputNativeType}//"text"//this does get changed dynamically
	       ref="input"
	       />
	);
    }
}

export default WgSmartInput;
