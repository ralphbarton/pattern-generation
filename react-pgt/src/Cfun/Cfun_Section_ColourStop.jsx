import React from 'react';
//var _ = require('lodash');

import tinycolor from 'tinycolor2'; // remove colour transparency...

import WgBoxie from '../Wg/WgBoxie';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';

import WgBGrinsColourPicker from '../Wg/WgBGrinsColourPicker';


class Cfun_Section_ColourStop extends React.PureComponent {

    
    
    render() {

	const Stop_i = this.props.Stop_i;

	
	return (
	    <WgBoxie className="Cfun_Section_ColourStop" name="Colour Stop">


	      <div>
		
		<div
		   className="colour-sun s"
		   style={{backgroundColor: tinycolor(Stop_i.colour).toHexString()}}
		   onClick={/*this.hofHandleShowPicker(true)*/ null}
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
			     
			     /*
			      // set the underlying object
			      const colStr = col_tiny.toRgbString();
			      this.props.handleEditingCpotSelItemChange(
			      {range: {
			      $set: Cpot_util.range_set(colStr, hslaRange)
			      }}
			      );*/
			     
			 }}
			UI={this.props.UI.BGrins}
			hofHandleUIchange_BGrins={this.props.hofHandleUIchange_BGrins}
			hofHandleShowPicker={this.hofHandleShowPicker} // handle click of "OK"
		   />
	      }


	    </WgBoxie>
	);
    }

}

export default Cfun_Section_ColourStop;
