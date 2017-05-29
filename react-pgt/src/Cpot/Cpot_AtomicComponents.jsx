import React from 'react';

import tinycolor from 'tinycolor2';


// this function is plain-js, not React...
function putGradientOnCanvas(canvas, colour_range, gradient_config){
    var ctx = canvas.getContext('2d');
    var size = canvas.width;
    var imageData = ctx.getImageData(0, 0, size, size);
    var pixelData = imageData.data;

    for (var x = 0; x < size; x++){
	for (var y = 0; y < size; y++){
	    //determine colour at x,y
	    const x_frac = x/(size-1);//what fraction of the x-distance along is this pixel?
	    const y_frac = y/(size-1);

	    // for this pixel, to what extent should it be the hue of colour 2?
	    const H_frac = gradient_config.H === "x" ? x_frac : (gradient_config.H === "y" ? y_frac : gradient_config.H);
	    const S_frac = gradient_config.S === "x" ? x_frac : (gradient_config.S === "y" ? y_frac : gradient_config.S);
	    const L_frac = gradient_config.L === "x" ? x_frac : (gradient_config.L === "y" ? y_frac : gradient_config.L);

	    const Hx = (colour_range.h1 + H_frac * colour_range.dh * 2)%360;
	    const Sx = colour_range.s1 + S_frac * colour_range.ds * 2;
	    const Lx = colour_range.l1 + L_frac * colour_range.dl * 2;
	    
	    //draw that pixel
	    const i = (y * size + x) * 4;
	    const Colour = tinycolor( {h: Hx, s: Sx, l: Lx} ).toRgb();

	    pixelData[i]     = Colour.r;
	    pixelData[i + 1] = Colour.g;
	    pixelData[i + 2] = Colour.b;
	    pixelData[i + 3] = 255;//alpha -> fully opaque

	}
    }

    ctx.putImageData(imageData, 0, 0);

};



class WgGradientCell extends React.PureComponent {

    componentDidMount() {
	//called by React immediately after render()
	const canvas = this.refs.canvas;
	putGradientOnCanvas(canvas, this.props.expandedRange, this.props.gradConf);
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
