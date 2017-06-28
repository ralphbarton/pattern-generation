import React from 'react';

// this is the 'util' module for the overall project
import util from '.././plain-js/util';

import Plot_render from './plain-js/Plot_render2';


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
	console.log("Thread execution complete in: ", ((new Date())-this.t));
    }


    handleFastCanvasRender(){

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}
	const Plot = util.lookup(this.props.plotArray, "uid", plotUIState.selectionUid);
	
	const rendered_image = Plot_render.GenerateImageData(
	    Plot.formula,
	    this.winW,
	    this.winH,
	    12 // - this seems a reasonable crude level of detail for the basic plot
	);
	
	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(rendered_image, 0, 0);
	console.log("Fast render complete in: ", ((new Date())-this.t));
    }

    componentDidUpdate(){
	this.handleFastCanvasRender();
    }

    componentDidMount(){
	this.handleFastCanvasRender();
    }

    
    render() {
	this.t = new Date();

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}

	console.log("<Background_Plot> render() called", plotUIState);

	//this update is always important.
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	
	const Plot = util.lookup(this.props.plotArray, "uid", plotUIState.selectionUid);	
	
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
