import React from 'react';

//import util from '.././plain-js/util';
//import worker_script from './plain-js/worker';
import util from '.././plain-js/util';


class Background_Plot extends React.PureComponent {


    constructor() {
	super();

	const workerURL = process.env.PUBLIC_URL + "/worker/plot_worker.js";


	this.worker = new Worker(workerURL);
	this.worker.onmessage = this.handleWorkerMessage.bind(this);
    }

    // Pass some activity into the other thread
    requestWorkerCalc(formulaString, resolution){
	this.worker.postMessage({
	    width: this.winW,
	    height: this.winH,
	    formula: formulaString,
	    resolution: resolution
	});
    }

    // Respond to activity completed, in other thread
    handleWorkerMessage(m){

	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(m.data, 0, 0);
    }

    

    

    render() {

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}

	//console.log("<Background_Plot> render() called", plotUIState);

	//this update is always important.
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	
	const Plot = util.lookup(this.props.plotArray, "uid", plotUIState.selectedPlotUid);	
	
	// This command will trigger the generation of plot-data
	// it will be slapped onto the canvas when result message is recieced from thread
	this.requestWorkerCalc(Plot.formula, plotUIState.plotResolution);

	
	

	
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
