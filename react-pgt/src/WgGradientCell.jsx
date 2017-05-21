import React, { Component } from 'react';

import cpot_util from './CpotUtil';

class WgGradientCell extends Component {

    componentDidMount() {
	//called by React immediately after render()
	const canvas = this.refs.canvas;

	//move this code into Upper function, so that its called once rather than 6 times...
	var X = cpot_util.range_unpack( this.props.elemRange );

	cpot_util.putGradientOnCanvas(canvas, X, this.props.gradientConfig);
    }

    render() {
	return (
	    <canvas ref="canvas" width={this.props.dim} height={this.props.dim}/>
	);
    }
}


export default WgGradientCell;
