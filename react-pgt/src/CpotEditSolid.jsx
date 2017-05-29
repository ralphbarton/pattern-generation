import React from 'react';

//import cpot_util from './CpotUtil';
import tinycolor from 'tinycolor2';
import update from 'immutability-helper';
import { SketchPicker } from 'react-color';

import WgSmartInput from './WgSmartInput';
import WgButton from './WgButton';

import {WgAlphaSwatch} from './CpotEdit_ItemSubComponents.jsx';

import './CpotEditSolid.css';

class CpotEditSolid extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    hslaObj: tinycolor(props.colourString).toHsl(),
	    pickerActive: false
	};
    }


    componentWillReceiveProps(nextProps){
	this.setState({
	    hslaObj: tinycolor(nextProps.colourString).toHsl()
	});
    }

    
    handleColourChange(key, value){
	let $Updater = {};
	$Updater[key] = {$set: value};
	this.setState({
	    hslaObj: update(this.state.hslaObj, $Updater)
	});
    }

    handleShowPicker(activate){
	this.setState({
	    pickerActive: activate
	});
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
		   onClick={this.handleShowPicker.bind(this, true)}
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
	      
	      {
		  // Show the picker?
		  (() => {
		      switch (this.state.pickerActive) {
		      case true:
			  //the picker
			  return (
			      <div className="BeigeWindow pickerWindow">
				<SketchPicker
				   color={col_w_alph}
				   onChange={(color)=>{
				       this.setState({
					   hslaObj: color.hsl
				       });
				  }}
				  onChangeComplete={(color)=>{
				      this.setState({
					  hslaObj: color.hsl
				      });
				      const colStr = tinycolor(color.hsl).toRgbString();
				      this.props.onPropagateChange(colStr);
				  }}
				  />
				  <div className="mainButtons">
				    <WgButton
				       name="Cancel"
				       buttonStyle={"small"}
				       onClick={this.handleShowPicker.bind(this, false)}
				       enabled={true}
				      />
				      <WgButton
					 name="Choose"
					 buttonStyle={"small"}
					 onClick={this.handleShowPicker.bind(this, false)}
					 enabled={true}
					/>
				  </div>
			      </div>
			  );
		      default:
			  return null;
		      }
		  })()
	      }
	    </div>
	);
    }
}

export default CpotEditSolid;
