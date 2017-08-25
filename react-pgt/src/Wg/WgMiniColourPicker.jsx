import React from 'react';

import RegisterJcolorPlugin from './jcolor/jcolor.js';
import $ from "jquery";
RegisterJcolorPlugin($);// initialise

import tinycolor from 'tinycolor2'; // for colour interpretation...

class WgMiniColourPicker extends React.PureComponent {

    constructor() {
	super();
	this.initialisePicker = this.initialisePicker.bind(this);

	this.blockRerenderTimeoutID = null;
    }
    
    initialisePicker(){
	this.$el = $(this.pickerDiv);
	const C = tinycolor(this.props.color).toRgb();
	this.$el.colorpicker({
	    color: {r: (C.r/255), g: (C.g/255), b: (C.b/255), a: C.a}
	});

	//link the callback provided via React to the plugin's own colour change event
	this.$el.on('newcolor', (ev, colorpicker) => {

	    // this is a Hacky approach to prevent unwanted re-renders when component triggers change to its own prop!
	    // take action BEFORE the executing the callback which will change state!
	    clearTimeout(this.blockRerenderTimeoutID);
	    this.blockRerenderTimeoutID = setTimeout( ()=>{
		this.blockRerenderTimeoutID = null;
	    }, 100);

	    //this function call may actually itself call re-render before terminating...
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
	return nextProps.color  !== this.props.color && (this.blockRerenderTimeoutID === null);
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
