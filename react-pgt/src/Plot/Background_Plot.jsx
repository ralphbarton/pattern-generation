import React from 'react';

import Plot_RenderManager from './plain-js/Plot_RenderManager';

// this is the 'util' module for the overall project
import util from '.././plain-js/util';

import update from 'immutability-helper';



class Background_Plot extends React.PureComponent {


    constructor(props) {
	super(props);
	this.state = {
	    resolutionChangeOnly: false //the fast (res=40px) render is not executed for resolution change
	};
	
	Plot_RenderManager.init({
	    onRenderComplete: this.handleRenderComplete.bind(this),
	    onStatsComplete: stats_obj => {
		props.setPlotUIState({
		    stats_obj: {$set: stats_obj}
		});
	    }
	});
    }

    // Respond to activity completed, in other thread
    handleRenderComplete(ImgData){

	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(ImgData, 0, 0);

	//record the time taken in "Global state"
	const new_timings_obj = update(this.props.plotUIState.timings_obj, {final: {$set: (new Date() - this.t)}});
	this.props.setPlotUIState({
	    timings_obj: {$set: new_timings_obj}
	});

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

	//record the time taken in "Global state"
	const new_timings_obj = update(this.props.plotUIState.timings_obj, {fast: {$set: (new Date() - this.t)}});
	this.props.setPlotUIState({
	    timings_obj: {$set: new_timings_obj}
	});	
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

	// POSITIVE SELECTION to determine update (i.e. test for specific conditions if update is to occur)
	
	// only changes to some specific props should bring about re-execution of the render function
	const c1 = this.props.plotUIState.selectionUid      !== nextProps.plotUIState.selectionUid;
	const c2 = this.props.plotUIState.colouringFunction !== nextProps.plotUIState.colouringFunction;
	const c3 = this.props.plotUIState.previewActive     !== nextProps.plotUIState.previewActive;
	const c4 = this.props.plotUIState.plotResolution    !== nextProps.plotUIState.plotResolution;
	// since only the selected plot can change anyway, there is no need to narrow down to testing only this.
	const c5 = this.props.plotArray                     !== nextProps.plotArray;
	
	return c1 || c2 || c3 || c4 || c5;
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
	    </div>
	);
    }
}


export default Background_Plot;
