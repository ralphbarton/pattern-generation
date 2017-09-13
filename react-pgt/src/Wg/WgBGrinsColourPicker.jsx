import React from 'react';
//var _ = require('lodash');

import * as spectrum from 'spectrum-colorpicker';// eslint-disable-line
import $ from "jquery";

import {WgButton} from '../Wg/WgButton';

class WgBGrinsColourPicker extends React.PureComponent {

    constructor() {
	super();
	this.initialisePicker = this.initialisePicker.bind(this);
    }
    
    initialisePicker(){
	this.$el = $(this.pickerDiv);
	this.$el.spectrum({
	    appendTo: this.$el,
		flat: true, // always show full-size, inline block...

	    color: "#f00",
	    showInput: true, // allow text entry to specify colour
	    showAlpha: true, // allow transparency selection
	    //palette based options...
	    localStorageKey: "spectrum.ralph-patterns-program", // Any Spectrum with the same string will share selection
	    showPalette: true, // "palette" is a fixed provision of colours for the picker to offer
	    palette: [ ],
	    showSelectionPalette: true, // "selectionPalette" retains some history of user's colour choices.
	    selectionPalette: [ ],
	    maxSelectionSize: 22,
	    showInitial: true, // show the original (starting) colour alongside the new one
	    showButtons: false, //do not require OK and Cancel buttons
//	    preferredFormat: original_format, // for the input box...

	    move: this.props.onChange
	});
    }
    
    componentDidMount() {
	this.initialisePicker();
    }

    componentWillUnmount() {
	this.$el.spectrum("destroy");
    }

    shouldComponentUpdate(nextProps){
//	return nextProps.color  !== this.props.color && (this.blockRerenderTimeoutID === null);
    }
    
    componentDidUpdate(){
	this.initialisePicker();
    }
    
    render(){
	return (
	    <div className="WgBGrinsColourPicker BeigeWindow pickerWindow">
	      <div className="BGrins-target-div" ref={ el => {this.pickerDiv = el;}}/>

		  <WgButton
		     name="Cancel"
		     buttonStyle={"small"}
		     onClick={null}
		     enabled={true}
		     />
		  <WgButton
		     name="Choose"
		     buttonStyle={"small"}
		     onClick={null}
		     enabled={true}
		     />

	      </div>
	);
    }
}


export default WgBGrinsColourPicker;
