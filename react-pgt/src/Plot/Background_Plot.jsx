import React from 'react';

import util from '.././plain-js/util';
import worker_script from './plain-js/worker';


class Background_Plot extends React.PureComponent {


    constructor() {
	super();
	this.worker = new Worker(worker_script);
	this.worker.onmessage = this.handleWorkerMessage.bind(this);
    }

    handleWorkerMessage(m){
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(m.data, 0, 0);
	console.log((new Date())-this.t);
    }

    requestWorkerCalc(){
	this.worker.postMessage({
	    width: this.winW,
	    height: this.winH
	});
    }
    
    componentDidUpdate(){
	this.t = new Date();
	this.requestWorkerCalc();
	var ctx = this.canvasElement.getContext('2d');


	ctx.fillRect(20, 20, 20, 20);//x,y,w,h
	
    }
    
    render() {
	
	const plotUIState = this.props.plotUIState;
//	console.log("<Background_Plot> render() called", plotUIState);
	
	const plotArray = this.props.plotArray;

	this.winW = window.innerWidth;
	this.winH = window.innerHeight;


	
	return (
	    <div className="Background_Plot">
	      <canvas
		 className="plot-canvas"
		 width={this.winW}
		 height={this.winH}
		 ref={ (el) => {this.canvasElement = el;}}
		/>


	      {
//		  JSON.stringify(plotUIState, null, 2)
	      }
	    </div>
	);
    }
}


export default Background_Plot;
