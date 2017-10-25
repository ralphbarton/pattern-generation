var _ = require('lodash');

import Plot_RenderManager from './Plot_RenderManager';

var Plot_CacheManager = {

    running: false,
    isRunning: function(){
	return this.running;
    },


    


    Start: function(args){

	this.setCache = args.setPlotCache;

	Plot_RenderManager.init({
	    onRenderComplete: this.handleRenderComplete.bind(this),
	    onStatsComplete: this.handleStatsComplete.bind(this)
	});


	
	// start the recursive chain...
	_.assign(this.render_specification, {
	    plot_index: 0,
	    resolution_pass: 0
	});

	console.log("Plot_CacheManager.Start()");
	this.launchRender();
	this.running = true;
    },


    render_specification: {
	// fixed
	useWorker:          true,  // initial v.fast render without worker???
	workerRequestToken: 99, // does this server a purpose
	intermediateRender: false, /////////////////////SURELY this needs to be removed as a function??
	colouringFunction:  2,// always generate a heatmap version... // this.plotUIState.colouringFunction

	// varying
	Plot:               null,
	width:              null,
	height:             null,
	resolution:         null,

	// other
	plot_index:         null,
	resolution_pass:    null,
	splitMode:          null
    },
    
    launchRender: function(){

	var moreWorkFound = false;
	const cache = this.cacheCurrent;
	
	// 1. decide what to render...
	for(var i = 0; i<this.plotArray.length; i++){

	    const Plot = this.plotArray[i];

	    //Test: is there NOTHING in the cache for that particular Plot...
	    if( !cache || !cache["plot"][Plot.uid]){

		//set latest values
		_.assign(this.render_specification, {
		    Plot:       Plot,
		    width:      this.paneCfg.paneDims.width,
		    height:     this.paneCfg.paneDims.height,
		    resolution: 5,// do it fast... //this.plotUIState.plotResolution,
		    splitMode:  this.paneCfg.splitMode
		});
		moreWorkFound = true;
		break;
	    }
	}

	// 2. Command render, in a separate thread...
	if(moreWorkFound){
	    Plot_RenderManager.render(this.render_specification);	
	}else{
	    console.log("all cached rendering up to date...");
	    this.running = false;
	}
    },


    handleRenderComplete: function(msg){

	const uid       = this.render_specification.Plot.uid;
	const splitMode = this.render_specification.splitMode;

	const cache = this.cacheCurrent || {plot: null};
	
	if( !cache || !cache["plot"] || !cache["plot"][uid]){
	    //create new fields
	    console.log("storing cache data for a previously un-cached render...", uid);
	    this.cacheCurrent = this.setCache({
		[uid]: {
		    $set: {
			render_specification: this.render_specification, // this is not quite right...
			ImgData: {
			    [splitMode]: {				
				greyscale: msg.ImageData_grey,
				heatmap:   msg.ImageData_heatmap
			    }
			}
		    }
		}
	    });

	}else{
	    //update without overwrite
	    console.log("cache update commanded...");
	    this.cacheCurrent = this.setCache({
		[uid]: {
		    render_specification: {$set: this.render_specification}, // this is not quite right...
		    ImgData: {
			[splitMode]: {
			    $set: {
				greyscale: msg.ImageData_grey,
				heatmap:   msg.ImageData_heatmap
			    }
			}
		    }
		}
	    });
	}

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
