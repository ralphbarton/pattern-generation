import React from 'react';
//var _ = require('lodash');

import tinycolor from 'tinycolor2'; // remove colour transparency...

import WgBoxie from '../Wg/WgBoxie';
import {WgButton} from '../Wg/WgButton';
//import {WgDropDown} from '../Wg/WgDropDown';

import WgBGrinsColourPicker from '../Wg/WgBGrinsColourPicker';


class Cfun_Section_ColourStop extends React.PureComponent {

        
    render() {

	const stopSel = this.props.UI.stopSelected;
	const Stop_i = stopSel !== undefined ? this.props.Cfun_i.stops[stopSel] : null;
	
	return (
	    <WgBoxie className="Cfun_Section_ColourStop" name="Colour Stop">

	      <div>
		
		<div
		   className="colour-sun s"
		   style={{backgroundColor: tinycolor(Stop_i.colour).toHexString()}}
		   onClick={()=>{
		       this.props.handleUIStateChange("pickerActive", true);
		   }}
		   />

		<WgButton
		   name="Delete"
		   buttonStyle={"small"}
		   onClick={/*this.props.fn.handleDeleteSelPGTobj*/null}
		   />

	      </div>


	      {this.props.UI.pickerActive &&
		  <WgBGrinsColourPicker
			 color={Stop_i.colour}
			 onChange={ col_tiny => {
			     this.props.UpdateSelectedCfun({
				 stops: {
				     [stopSel]: {colour: {$set: col_tiny.toRgbString()}}
				 }
			     });
			 }}
			 UI={this.props.UI.BGrins}
			 hofHandleUIchange_BGrins={this.props.hofSetUI_BGrins}
			 hofHandleShowPicker={ ()=>{
			     return this.props.handleUIStateChange.bind(null, "pickerActive");
			 }} // handle click of "OK"
		   />
	      }


	    </WgBoxie>
	);
    }

}

export default Cfun_Section_ColourStop;
