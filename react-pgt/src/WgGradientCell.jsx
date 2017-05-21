import React, { Component } from 'react';

import cpot_util from './CpotUtil';

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
	       height={this.props.dim}/>
	);
    }
}


export default WgGradientCell;
