import React from 'react';

import Plot_RenderManager from './plain-js/Plot_RenderManager';

// this is the 'util' module for the overall project
import util from '.././plain-js/util';


class Background_Plot extends React.PureComponent {


    constructor(props) {
	super(props);
	this.state = {
	    resolutionChangeOnly: false, //the fast (res=40px) render is not executed for resolution change
	    workerRequestToken: 0
	};
	
	Plot_RenderManager.init({
	    onRenderComplete: this.handleRenderComplete.bind(this),
	    onStatsComplete: this.handleStatsComplete.bind(this)
	});
    }

    // When the worker delivers the full-detail image data of the render,
    // this hander slaps it onto the canvas element, accessible via a React ref.
    handleRenderComplete(msg){

	if(msg.workerRequestToken !== this.state.workerRequestToken){
	    this.t = new Date(); // up till this moment, worker has been doing something stale. Reset timer
	    return;
	}

	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(msg.ImgData, 0, 0);

	//record time taken in "Global state"
	if(msg.finalPass){
	    const duration_ms = new Date() - this.t;
	    this.props.setPlotUIState({
		timings_obj: {
		    final: {$set: duration_ms},
		    inProgress: {$set: false}
		}
	    });
	}else{
	    this.t = new Date(); // up till this moment, worker has been doing intermediate pass only. Reset timer
	}



	// Put the Scale-Limit values just used into the Plot object
	const rIndex = this.props.plotUIState.selectedRowIndex;
	this.props.onPlotArrayChange("update", {index: rIndex, $Updater: {
	    lastRenderScale:{
		Lo: {$set: msg.RenderScale.val_saturateLo},
		Hi: {$set: msg.RenderScale.val_saturateHi}
	    }
	}});


    }

    //handler for when worker coughs up the stats...
    handleStatsComplete(msg){
	if(msg.workerRequestToken !== this.state.workerRequestToken){return;}
	this.props.setPlotUIState({
	    stats_obj: {$set: msg.stats_obj}
	});
    }


    handleFastCanvasRender(){

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}
	const Plot = util.lookup(this.props.plotArray, "uid", plotUIState.selectionUid);
	
	const ImgData = Plot_RenderManager.render({
	    useWorker: false,
	    Plot: Plot,
	    width: this.winW,
	    height: this.winH,
	    resolution: 40, // - this seems a reasonable crude level of detail for the basic plot
	    colouringFunction: plotUIState.colouringFunction
	}).ImgData;
	
	//put the returned data onto the canvas element...
	var ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(ImgData, 0, 0);

	//record time taken in "Global state"
	const duration_ms = new Date() - this.t;
	this.props.setPlotUIState({
	    timings_obj: {fast: {$set: duration_ms}}
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

	// test for change in the specific Plot on display.
	const Uid = this.props.plotUIState.selectionUid;
	const thisPlot = util.lookup(this.props.plotArray, "uid", Uid);	
	const nextPlot = util.lookup(nextProps.plotArray,  "uid", Uid);	

	// The test is: the Plot has changed, but with some specific exclusigions
	// 1. the change is not its 'lastRenderScale' property (this property must be allowed to change without re-render)
	// 2. the change is not that the plots 'autoScale' property has just been turned off (test this for explicitly set false)
	const autoScaleTurnOff = nextPlot.autoScale === false && thisPlot.autoScale !== false;
	const c5 = (thisPlot !== nextPlot) && (thisPlot.lastRenderScale === nextPlot.lastRenderScale) && (!autoScaleTurnOff);
	
	const componentUpdate = c1 || c2 || c3 || c4 || c5;
	if(componentUpdate && nextProps.plotUIState.previewActive){
	    this.props.setPlotUIState({
		timings_obj: {
		    inProgress: {$set: true}
		}
	    });
	    this.props.setPlotUIState({
		stats_obj: {$set: {
		    n_points: "calculating...",
		    v_min: "...",
		    v_max: "...",
		    v10pc: "...",
		    v90pc: "...",
		    median: "..."
		}}
	    });
		
	    // increment 'workerRequestToken': a new render has been commanded...
	    this.setState( {workerRequestToken: this.state.workerRequestToken + 1} );
	}
	
	return componentUpdate;
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

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}

	//this update is always important.
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	
	const Plot = util.lookup(this.props.plotArray, "uid", plotUIState.selectionUid);	
	
	// Trigger generation of the Final quality of plot-data
	// it will be slapped onto the canvas when result message is recieced from thread
	this.t = new Date();
	Plot_RenderManager.render({
	    useWorker: true,
	    workerRequestToken: (this.state.workerRequestToken+1),//messy. State will not yet have updated
	    Plot: Plot,
	    width: this.winW,
	    height: this.winH,
	    intermediateRender: true,
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
