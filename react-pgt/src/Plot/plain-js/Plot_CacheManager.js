var _ = require('lodash');

import Plot_RenderManager from './Plot_RenderManager';

var Plot_CacheManager = {

    
    isRunning: function(){

    },


    plot_index: null,
    resolution_pass: null,

    Start: function(args){

	this.setCache = args.setPlotCache;
	this.plot_index = 0;
	this.resolution_pass = 0;

	Plot_RenderManager.init({
	    onRenderComplete: this.handleRenderComplete.bind(this),
	    onStatsComplete: this.handleStatsComplete.bind(this)
	});
	



	
    },
    
    launchRender: function(){

	/*
	Plot_RenderManager.render({
	    useWorker: true,
	    workerRequestToken: (this.state.workerRequestToken), //deleted the +1, used if State not yet updated
	    Plot: Plot,
	    width: this.winW,
	    height: this.winH,
	    intermediateRender: true,
	    resolution: plotUIState.plotResolution,
	    colouringFunction: plotUIState.colouringFunction
	});*/
	
    },


    handleRenderComplete: function(msg){

    },

    //handler for when worker coughs up the stats...
    handleStatsComplete: function(msg){
	if(msg.workerRequestToken !== this.state.workerRequestToken){return;}
	this.props.setPlotUIState({
	    stats_obj: {$set: msg.stats_obj}
	});
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
