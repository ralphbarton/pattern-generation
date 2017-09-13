import React from 'react';
var _ = require('lodash');

//import RegisterJcolorPlugin from './jcolor/jcolor.js';
import * as spectrum from 'spectrum-colorpicker';
import $ from "jquery";
//RegisterJcolorPlugin($);// initialise

//import tinycolor from 'tinycolor2'; // for colour interpretation...

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
	    showButtons: false //do not require OK and Cancel buttons
//	    preferredFormat: original_format, // for the input box...

	});
    }
    
    componentDidMount() {
	this.initialisePicker();
    }

    componentWillUnmount() {
//	this.$el.colorpicker().destroy();
    }

    shouldComponentUpdate(nextProps){
//	return nextProps.color  !== this.props.color && (this.blockRerenderTimeoutID === null);
    }
    
    componentDidUpdate(){
    }
    
    render(){
	return (
	    <div className="WgBGrinsColourPicker BeigeWindow pickerWindow">
	      <div ref={ el => {this.pickerDiv = el;}}/>
	      hello world
	    </div>
	);
    }
}


export default WgBGrinsColourPicker;
