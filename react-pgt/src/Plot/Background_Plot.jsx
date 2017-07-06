import React from 'react';

import Plot_RenderManager from './plain-js/Plot_RenderManager';

// this is the 'util' module for the overall project
import util from '.././plain-js/util';




class Background_Plot extends React.PureComponent {


    constructor() {
	super();
	
	Plot_RenderManager.init({
	    onRenderComplete: this.handleRenderComplete.bind(this),
	    onStatsComplete: obj => {console.log(obj);}
	});
    }

    // Respond to activity completed, in other thread
    handleRenderComplete(ImgData){

	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(ImgData, 0, 0);
	console.log("Thread execution complete in: ", ((new Date())-this.t));
    }


    handleFastCanvasRender(){

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}
	const Plot = util.lookup(this.props.plotArray, "uid", plotUIState.selectionUid);
	
	const rendered_image = Plot_RenderManager.render({
	    useWorker: false,
	    formula: Plot.formula,
	    width: this.winW,
	    height: this.winH,
	    resolution: 40 // - this seems a reasonable crude level of detail for the basic plot
	});
	
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
	Plot_RenderManager.render({
	    useWorker: true,
	    formula: Plot.formula,
	    width: this.winW,
	    height: this.winH,
	    resolution: plotUIState.plotResolution
	});	
	

	
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
