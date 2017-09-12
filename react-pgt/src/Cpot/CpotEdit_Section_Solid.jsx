import React from 'react';

import tinycolor from 'tinycolor2';
import update from 'immutability-helper';

import WgSmartInput from '../Wg/WgSmartInput';


import {WgAlphaSwatch} from './Cpot_AtomicComponents.jsx';

import CpotEdit_Section_ColPickPopout from './CpotEdit_Section_ColPickPopout';


class CpotEdit_Section_Solid extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    hslaObj: tinycolor(props.colourString).toHsl(),
	    pickerActive: false
	};
	this.hofHandleShowPicker = this.hofHandleShowPicker.bind(this);
    }


    componentWillReceiveProps(nextProps){
	this.setState({
	    hslaObj: tinycolor(nextProps.colourString).toHsl()
	});
    }

    
    handleColourChange(key, value){
	this.setState({
	    hslaObj: update(this.state.hslaObj, {
		[key]: {$set: value}
	    })
	});
    }

    hofHandleShowPicker(activate){
	const TS = this;
	return function(){
	    TS.setState({
		pickerActive: activate
	    });
	};
    }
    
    render() {
	const col_opaque = tinycolor(this.state.hslaObj).toHexString();
	const col_w_alph = tinycolor(this.state.hslaObj).toRgbString();
	return (
	    <div className="editZone solid">
	      <div>
		<div
		   className="colour-sun l"
		   style={{backgroundColor: col_opaque}}
		   onClick={this.hofHandleShowPicker(true)}
		   />
	      </div>

	      {/* Hue */}
	      <div className="inputContainer">
		Hue:
		<WgSmartInput
		   className="plain-cell"
		   value={this.state.hslaObj.h}
		   dataUnit="degrees"
		   max={360}
		   onChange={(value)=>{this.handleColourChange("h", value);}}
		  onChangeComplete={()=>{this.props.onPropagateChange(col_w_alph);}}
		  />
	      </div>

	      {/* Saturation */}
	      <div className="inputContainer">
		Saturation:
		<WgSmartInput
		   className="plain-cell"
		   value={this.state.hslaObj.s * 100}
		   dataUnit="percent"
		   onChange={(value)=>{this.handleColourChange("s", value/100);}}
		  onChangeComplete={()=>{this.props.onPropagateChange(col_w_alph);}}
		  />
	      </div>

	      {/* Luminosity */}
	      <div className="inputContainer">
		Luminosity:
		<WgSmartInput
		   className="plain-cell"
		   value={this.state.hslaObj.l * 100}
		   dataUnit="percent"
		   onChange={(value)=>{this.handleColourChange("l", value/100);}}
		  onChangeComplete={()=>{this.props.onPropagateChange(col_w_alph);}}
		  />
	      </div>

	      {/* Alpha */}
	      <WgAlphaSwatch type="solid" colourString={col_w_alph} />


	      <div className="inputContainer">
		Alpha:
		<WgSmartInput
		   className="plain-cell"
		   value={this.state.hslaObj.a * 100}
		   dataUnit="percent"
		   onChange={(value)=>{this.handleColourChange("a", value/100);}}
		  onChangeComplete={()=>{this.props.onPropagateChange(col_w_alph);}}
		  />
	      </div>
	      

	      <CpotEdit_Section_ColPickPopout
		 active={this.state.pickerActive}
		 color={col_w_alph}
		 onChange={ color => {
		     this.setState({
			 hslaObj: color.hsl
		     });
  		 }}
		 onChangeComplete={ color => {
		     this.setState({
			 hslaObj: color.hsl
		     });
		     const colStr = tinycolor(color.hsl).toRgbString();
		     this.props.onPropagateChange(colStr);
		 }}
		 hofHandleShowPicker={this.hofHandleShowPicker}
		/>
	    </div>
	);
    }
}

export default CpotEdit_Section_Solid;
