import React from 'react';
//var _ = require('lodash');

import * as spectrum from 'spectrum-colorpicker';// eslint-disable-line
import $ from "jquery";

import tinycolor from 'tinycolor2';

import {WgMutexActionLink, WgMut2WayActionLink} from '../Wg/WgMutexActionLink';
import {WgButton} from '../Wg/WgButton';


class WgBGrinsColourPicker extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    startColor: this.props.color
	};
    }

    componentDidMount() {
	this.$el = $(this.pickerDiv);
	this.$el.spectrum({
	    appendTo: this.$el,
	    flat: true, // always show full-size, inline block...

	    color: this.props.color,
	    showInput: true, // allow text entry to specify colour
	    showAlpha: true, // allow transparency selection
	    //palette based options...
	    localStorageKey: "spectrum.PGT", // Any Spectrum with the same string will share selection
	    showPalette: true, // "palette" is a fixed provision of colours for the picker to offer
	    palette: [],
	    showSelectionPalette: true, // "selectionPalette" retains some history of user's colour choices.
	    selectionPalette: ["#D0021B",
			       "#F5A623",
			       "#F8E71C",
			       "#8B572A",
			       "#7ED321",
			       "#417505",
			       "#BD10E0",
			       "#9013FE",
			       "#4A90E2",
			       "#50E3C2",
			       "#B8E986",
			       "#000000",
			       "#9B9B9B",
			       "#FFFFFF"],
	    maxSelectionSize: 26,
	    showInitial: true, // show the original (starting) colour alongside the new one
	    showButtons: false, //do not require OK and Cancel buttons
	    preferredFormat: this.props.UI.ColStrFormat, // for the input box...

	    move: this.props.onChange
	});
    }

    componentWillUnmount() {
	this.$el.spectrum("destroy");
    }


    shouldComponentUpdate(nextProps){
	return nextProps.UI  !== this.props.UI;
    }
    
    componentDidUpdate(){
	const $bgrins = this.$el;

	//once the resize animation is complete, the "reflow" command" readjusts click handlers etc. for the new size
	setTimeout(function(){$bgrins.spectrum("reflow");},410);

	//change pref format
	$bgrins.spectrum("option", "preferredFormat", this.props.UI.ColStrFormat ); // for the input box...

	const col = $bgrins.spectrum("get");
	$bgrins.spectrum("set", col);
    }
    
    render(){
	const UI = this.props.UI;
	return (
	    <div className={"WgBGrinsColourPicker BeigeWindow pickerWindow" + (UI.LargeSize ? " large" : "")}>
	      <div className="BGrins-target-div" ref={ el => {this.pickerDiv = el;}}/>

		<WgMut2WayActionLink
		   name=""
		   variableName="LargeSize"
		   actionNames={["Normal", "Large"]}
		   value={UI.LargeSize}
		   hofCB={this.props.hofHandleUIchange_BGrins}
		   />

		<WgMutexActionLink
		   name="Code:"
		   className="ColStrFormat"
		   equityTestingForEnabled={{
		       currentValue: UI.ColStrFormat,
		       representedValuesArray: ["hex3", "rgb", "hsl"]
		   }}
		   actions={[
		       {
			   name: "Hex",
			   cb: this.props.hofHandleUIchange_BGrins("ColStrFormat", "hex3")
		       },{
			   name: "RGB",
			   cb: this.props.hofHandleUIchange_BGrins("ColStrFormat", "rgb")
		       },{
			   name: "HSL",
			   cb: this.props.hofHandleUIchange_BGrins("ColStrFormat", "hsl")
		       }
		   ]}
		   />

		<div className="buttons">
		  <WgButton
		     name="Cancel"
		     buttonStyle={"small"}
		     onClick={()=>{
			 this.props.onChange(tinycolor(this.state.startColor));
			 this.props.hofHandleShowPicker(false)();
		     }}
		     enabled={true}
		     />
		  <WgButton
		     name="Choose"
		     buttonStyle={"small"}
		     onClick={this.props.hofHandleShowPicker(false)}
		     enabled={true}
		     />
	      </div>
	      </div>
	);
    }
}


export default WgBGrinsColourPicker;
