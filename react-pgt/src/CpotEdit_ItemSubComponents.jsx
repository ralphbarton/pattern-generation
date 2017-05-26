import React, { Component } from 'react';

import cpot_util from './CpotUtil';
import tinycolor from 'tinycolor2';

class WgGradientCell extends Component {

    componentDidMount() {
	//called by React immediately after render()
	const canvas = this.refs.canvas;
	cpot_util.putGradientOnCanvas(canvas, this.props.expandedRange, this.props.gradConf);
    }

    render() {
	return (
	    <canvas
	       className="WgGradientCell"
	       ref="canvas"
	       width={this.props.dim}
	       height={this.props.dim}
	       />
	);
    }
}

function WgColourPill(props) {
    const col =  props.colourString ? tinycolor(props.colourString).toHexString() : props.expandedRange.col_opaque;
    return (
	<div
	   className="WgColourPill"
	   style={{backgroundColor: col}}
	   />
    );
}

function WgAlphaSwatch(props) {

    switch (props.type) {
	
    case "range":
	const R = props.expandedRange;
	const high_alpha = tinycolor({h: R.h2, s: R.s2, l: R.l2, a: R.a3}).toRgbString();
	const low_alpha  = tinycolor({h: R.h2, s: R.s2, l: R.l2, a: R.a1}).toRgbString();
	return (
	    <div className="WgAlphaSwatch">
	      <div className="chequer"/>
	      <div className="swatch n1" style={{backgroundColor: high_alpha}} />
	      <div className="swatch n2" style={{backgroundColor: low_alpha }} />
	    </div>
	);
    default:
	return (
	    <div className="WgAlphaSwatch">
	      <div className="chequer"/>
	      <div className="swatch n" style={{backgroundColor: props.colourString}} />
	    </div>
	);
    }


}

export {WgAlphaSwatch, WgGradientCell, WgColourPill};
