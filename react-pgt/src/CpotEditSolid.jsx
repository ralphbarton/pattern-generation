import React, { Component } from 'react';

//import cpot_util from './CpotUtil';
import tinycolor from 'tinycolor2';

import WgSmartInput from './WgSmartInput';


import {WgAlphaSwatch} from './CpotEdit_ItemSubComponents.jsx';

import './CpotEditSolid.css';

class CpotEditSolid extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    tinycolour: tinycolor(this.props.colourString)
	};
    }

    handleColourChange(key, value){
	let col_hsla = this.state.tinycolour.toHsl();
	col_hsla[key] = value;
	this.setState({
	    tinycolour: tinycolor(col_hsla)
	});
    }
    
    render() {
	const col_opaque = this.state.tinycolour.toHexString();
	const col_hsla = this.state.tinycolour.toHsl();
	return (
	    <div className="editZone solid">
	      <div>
		<div
		   className="colour-sun l"
		   style={{backgroundColor: col_opaque}}
		   />
	      </div>

	      {/* Hue */}
	      <div className="inputContainer">
		Hue:
		<WgSmartInput
		   className="plain-cell"
		   value={col_hsla.h}
		   dataUnit="degrees"
		   onChange={(value)=>{this.handleColourChange("h", value);}}
		  />
	      </div>

	      {/* Saturation */}
	      <div className="inputContainer">
		Saturation:
		<WgSmartInput
		   className="plain-cell"
		   value={col_hsla.s * 100}
		   dataUnit="percent"
		   onChange={(value)=>{this.handleColourChange("s", value/100);}}
		   />
	      </div>

	      {/* Luminosity */}
	      <div className="inputContainer">
		Luminosity:
		<WgSmartInput
		   className="plain-cell"
		   value={col_hsla.l * 100}
		   dataUnit="percent"
		   onChange={(value)=>{this.handleColourChange("l", value/100);}}
		   />
	      </div>

	      {/* Alpha */}
	      <WgAlphaSwatch type="solid" colourString={this.state.tinycolour.toRgbString()} />

	      <div className="inputContainer">
		Alpha:
		<WgSmartInput
		   className="plain-cell"
		   value={col_hsla.a * 100}
		   dataUnit="percent"
		   onChange={(value)=>{this.handleColourChange("a", value/100);}}
		   />
	      </div>

	    </div>
	);
    }
}

export default CpotEditSolid;
