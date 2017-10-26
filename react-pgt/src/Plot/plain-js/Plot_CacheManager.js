var _ = require('lodash');

import Plot_RenderManager from './Plot_RenderManager';

var Plot_CacheManager = {

    running: false,
    isRunning: function(){
	return this.running;
    },
    

    Start: function(args){

	this.setPlotCache = args.setPlotCache;

	// this dummy call is only to get the cache
	this.plotCache = this.setPlotCache({k: {$set: "v"}});
	
	Plot_RenderManager.init({
	    onRenderComplete: this.handleRenderComplete.bind(this),
	    onStatsComplete: this.handleStatsComplete.bind(this)
	});
	
	this.launchRender();
	this.running = true;
    },


    launchRender: function(){

	var moreWorkFound = false;

	const renderDims = this.paneCfg.paneDimsAR || this.paneCfg.paneDims;
	
	const renderRequestObj = {
	    // Required for render
	    useWorker:          true,  // initial v.fast render without worker???
	    colouringFunction:  2,// always generate a heatmap version... // this.plotUIState.colouringFunction
	    width:              renderDims.width,
	    height:             renderDims.height,

	    // (these will be set proper values shortly)
	    Plot:               null,
	    resolution:         null,

	    // Pass over additionally...
	    paneCfg: this.paneCfg,
	    t_start: (new Date())
	};
	
	// 1. decide what to render...
	for(var i = 0; i < this.plotArray.length; i++){

	    const Plot = this.plotArray[i];

	    //Test: is there NOTHING in the cache for that particular Plot...
	    if( !this.plotCache[Plot.uid]){
		moreWorkFound = true;
		
		//set latest values
		_.assign(renderRequestObj, {
		    Plot:       Plot,
		    resolution: 5,// do it fast... //this.plotUIState.plotResolution,
		});

		break;
	    }
	}

	// 2. Command render, in a separate thread...
	if(moreWorkFound){
	    Plot_RenderManager.render(renderRequestObj);	
	}else{
	    console.log("all cached rendering up to date...");
	    this.running = false;
	}
    },


    handleRenderComplete: function(msg){

	const uid          = msg.requestObject.Plot.uid;
	const splitMode    = msg.requestObject.paneCfg.splitMode;
	const renderedDims = msg.requestObject.paneCfg.paneDimsAR;
	
	// this is simply guarentee a placeholder object is at that UID, to ensure object writing to specific keys works
	if( !this.plotCache[uid] ){
	    this.setPlotCache({
		[uid]: {$set: {windowDims: null, Plot: null, ImgData: {}}}
	    });
	}
	
	this.plotCache = this.setPlotCache({
	    [uid]: {
		windowDims: {$set: this.paneCfg.dims},
		Plot: {$set: msg.requestObject.Plot},
		ImgData: {
		    [splitMode]: {				
			$set: {
			    greyscale:      msg.ImageData_grey,
			    heatmap:        msg.ImageData_heatmap,
			    dims:           renderedDims,
			    render_timings: null,
			    render_stats:   null
			}
		    }
		}
	    }
	});

    },

    //handler for when worker coughs up the stats...
    handleStatsComplete: function(msg){
	/*
	if(msg.workerRequestToken !== this.state.workerRequestToken){return;}
	this.props.setPlotUIState({
	    stats_obj: {$set: msg.stats_obj}
	});*/

	//recursive call...
	this.launchRender();
    },
    

    paneCfg: null,
    plotArray: null,
    plotUIState: null,

    newData: function(data){
	this.plotArray = data.plotArray;
	this.plotUIState = data.plotUIState;
	this.paneCfg = data.paneCfg;
    }
    
};


export default Plot_CacheManager;
