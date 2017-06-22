import React from 'react';

//import util from '.././plain-js/util';
import worker_script from './plain-js/worker';


class Background_Plot extends React.PureComponent {


    constructor() {
	super();

	const workerURL = process.env.PUBLIC_URL + "/worker/plot_worker.js";


	this.worker = new Worker(workerURL);
	this.worker.onmessage = this.handleWorkerMessage.bind(this);
    }

    // Pass some activity into the other thread
    requestWorkerCalc(){
	this.worker.postMessage({
	    width: this.winW,
	    height: this.winH
	});
    }

    // Respond to activity completed, in other thread
    handleWorkerMessage(m){

	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(m.data, 0, 0);
    }

    
    componentDidUpdate(){
	this.requestWorkerCalc();
	var ctx = this.canvasElement.getContext('2d');
	ctx.fillRect(20, 20, 20, 20);//x,y,w,h
	
    }
    
    render() {
	
//	const plotUIState = this.props.plotUIState;
//	console.log("<Background_Plot> render() called", plotUIState);
	
//	const plotArray = this.props.plotArray;

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
