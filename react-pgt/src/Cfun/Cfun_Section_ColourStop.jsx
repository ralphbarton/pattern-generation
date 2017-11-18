import React from 'react';
//var _ = require('lodash');

import WgBoxie from '../Wg/WgBoxie';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';
import {WgMut2WayActionLink} from '../Wg/WgMutexActionLink';

import WgBGrinsColourPicker from '../Wg/WgBGrinsColourPicker';
import {WgAlphaSwatch} from '../Cpot/Cpot_AtomicComponents.jsx'; // this is now more of a generic component...

class Cfun_Section_ColourStop extends React.PureComponent {

    constructor() {
	super();
	this.updateSelectedStop = this.updateSelectedStop.bind(this);
    }

    updateSelectedStop($chg){
	const stopSel = this.props.UI.stopSelected;
	this.props.UpdateSelectedCfun({
	    stops: {
		[stopSel]: $chg
	    }
	});
    }
    
        
    render() {

	const stopSel = this.props.UI.stopSelected;
	const Stop_i = stopSel !== undefined ? this.props.Cfun_i.stops[stopSel] : null;
	
	return (
	    <WgBoxie className="Cfun_Section_ColourStop" name="Colour Stop">

	      <WgAlphaSwatch
		 type="solid" // this is as opposed to a colour range...
		 colourString={Stop_i.colour}
		 onClick={()=>{
		     this.props.handleUIStateChange("pickerActive", true);
		}}
		/>

		<WgDropDown
		   name="Choose Cpot..."
		   className="chooseCpot"
		   ddStyle="plain">
		  cpot selection jsx...
		</WgDropDown>

		<WgMut2WayActionLink
		   name="Gradation"
		   variableName="isBlock"
		   value={Stop_i.isBlock}
		   actionNames={["smooth", "stripe"]}
		   hofCB={ (k,v) => { return this.updateSelectedStop.bind(null, {isBlock: {$set: v}}); }}
		  />  
		  
		  <WgButton
		     name="Delete"
		     className="deleteStop"
		     buttonStyle={"small"}
		     onClick={ () => {
			 this.props.UpdateSelectedCfun({
			     stops: {$splice: [[stopSel, 1]]}
			 });
		    }}
		    />


	      {this.props.UI.pickerActive &&
		  <WgBGrinsColourPicker
			 color={Stop_i.colour}
			 onChange={ col_tiny => {
			     this.updateSelectedStop({colour: {$set: col_tiny.toRgbString()}});
			 }}
			 UI={this.props.UI.BGrins}
			 hofHandleUIchange_BGrins={this.props.hofSetUI_BGrins}
			 hofHandleShowPicker={ visi => {
			     return this.props.handleUIStateChange.bind(null, "pickerActive", visi);
			 }} // handle click of "OK"
		   />
	      }


	    </WgBoxie>
	);
    }

}

export default Cfun_Section_ColourStop;
