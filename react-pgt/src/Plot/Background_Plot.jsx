import React from 'react';

import Plot_RenderManager from './plain-js/Plot_RenderManager';

// this is the 'util' module for the overall project
import util from '.././plain-js/util';




class Background_Plot extends React.PureComponent {


    constructor() {
	super();
	this.state = {
	    resolutionChangeOnly: false
	};
	
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
	    resolution: 40, // - this seems a reasonable crude level of detail for the basic plot
	    colouringFunction: plotUIState.colouringFunction
	});
	
	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(rendered_image, 0, 0);
	console.log("Fast render complete in: ", ((new Date())-this.t));
    }

    componentWillReceiveProps(nextProps){
	//setState does not impact upon this.state until sometime later...
	this.setState({
	    // assume that if the resolution changes, it is the only thing that has changed.
	    // this is fair since it is a user updatable value, and the user cannot literally update 2 things in one event
	    resolutionChangeOnly: this.props.plotUIState.plotResolution !== nextProps.plotUIState.plotResolution
	});
    }

    shouldComponentUpdate(nextProps, nextState){

	// only changes to some specific props should bring about re-execution of the render function
	const c1 = this.props.plotUIState.selectionUid      !== nextProps.plotUIState.selectionUid;
	const c2 = this.props.plotUIState.colouringFunction !== nextProps.plotUIState.colouringFunction;
	const c3 = this.props.plotUIState.previewActive     !== nextProps.plotUIState.previewActive;
	const c4 = this.props.plotUIState.plotResolution    !== nextProps.plotUIState.plotResolution;

	console.log("this.state.resolutionChangeOnly", this.state.resolutionChangeOnly);
	return c1 || c2 || c3 || c4;
    }

    componentDidUpdate(){
	//no fast-update when only the resolution changes.
	if(!this.state.resolutionChangeOnly){
	    this.handleFastCanvasRender();
	}
    }

    componentDidMount(){
	this.handleFastCanvasRender();
    }

    
    render() {
	this.t = new Date();

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}


	//TODO:

	//some effort is required to limit occurances of rerender to when acually necessary
	
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
	    resolution: plotUIState.plotResolution,
	    colouringFunction: plotUIState.colouringFunction
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
