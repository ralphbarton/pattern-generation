import React from 'react';

import RegisterJcolorPlugin from './jcolor/jcolor.js';
import $ from "jquery";
RegisterJcolorPlugin($);// initialise

import tinycolor from 'tinycolor2'; // for colour interpretation...

class WgMiniColourPicker extends React.PureComponent {

    constructor() {
	super();
	this.initialisePicker = this.initialisePicker.bind(this);
    }
    
    initialisePicker(){
	this.$el = $(this.pickerDiv);
	const C = tinycolor(this.props.color).toRgb();
	this.$el.colorpicker({
	    color: {r: (C.r/255), g: (C.g/255), b: (C.b/255), a: C.a}
	});

	//link the callback provided via React to the plugin's own colour change event
	this.$el.on('newcolor', (ev, colorpicker) => {
	    this.props.onMove(colorpicker.toCssString());
	});
    }
    
    componentDidMount() {
	this.initialisePicker();
    }

    componentWillUnmount() {
	this.$el.colorpicker().destroy();
    }

    shouldComponentUpdate(nextProps){
	return nextProps.color  !== this.props.color;
    }
    
    componentDidUpdate(){
	this.$el.colorpicker().destroy();	
	this.initialisePicker();
    }
    
    render(){	
	return (
	    <div className={"WgMiniColourPicker " + (this.props.className||"")}
	       ref={ el => {this.pickerDiv = el;}}
	      />
	);
    }
}


export default WgMiniColourPicker;
