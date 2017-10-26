var _ = require('lodash');

import Plot_RenderManager from './Plot_RenderManager';

var Plot_CacheManager = {

    running: false,
    initiated: false,
    isInitiated: function(){
	return this.initiated;
    },

    
    init: function(args){

	this.setPlotCache = args.setPlotCache;

	Plot_RenderManager.init({
	    onRenderComplete: this.handleRenderComplete.bind(this),
	    onStatsComplete: this.handleStatsComplete.bind(this)
	});
	
	this.initiated = true;
    },

  
    launchRender: function(){

	const renderDims  = this.paneCfg.paneDimsAR || this.paneCfg.paneDims;		
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

	
	const splitMode   = this.paneCfg.splitMode;
	const UIResolution = this.plotUIState.plotResolution;//todo: move "resolution" from UI to per-Plot property
	let moreWorkFound = false;
	
	// 1. decide what to render...

	// Test A: is there NOTHING in the cache for any Plot?
	for(var i = 0; i < this.plotArray.length; i++){

	    const Plot = this.plotArray[i];
	    const Cached4Plot = this.plotCache[Plot.uid];
	    
	    if( !Cached4Plot.Plot ){
		_.assign(renderRequestObj, {
		    Plot:       Plot,
		    resolution: Math.max(40, UIResolution)
		});

		moreWorkFound = true;
		break;

	    }
	}

	const getIntermedResolution = r => {
	    if(r === 1) {return 3;}
	    if(r === 2) {return 5;}
	    if(r === 3) {return 10;}
	    if(r < 10) {return 15;}
	    return r;
	};

	// Test B: is the cached version of the plot is less than the required intermediate resolution
	if(!moreWorkFound){
	    for(i = 0; i < this.plotArray.length; i++){
		const Plot = this.plotArray[i];
		const Cached4Plot = this.plotCache[Plot.uid];
		
		const cachedResolution = Cached4Plot.ImgData[splitMode].resolution;
		const intermedResolution = getIntermedResolution(UIResolution);
		
		if( cachedResolution > intermedResolution ){
		    _.assign(renderRequestObj, {
			Plot:       Plot,
			resolution: intermedResolution
		    });

		    moreWorkFound = true;
		    break;
		}
	    }
	}

	// Test C: is the cached version of the plot is less than the required final resolution
	if(!moreWorkFound){
	    for(i = 0; i < this.plotArray.length; i++){
		const Plot = this.plotArray[i];
		const Cached4Plot = this.plotCache[Plot.uid];
		const cachedResolution = Cached4Plot.ImgData[splitMode].resolution;
		
		if( cachedResolution > UIResolution ){
		    _.assign(renderRequestObj, {
			Plot:       Plot,
			resolution: UIResolution
		    });

		    moreWorkFound = true;
		    break;
		}
	    }
	}
	
	
	// 2. Launch a render-job, in a separate thread...
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
	const duration_ms  = new Date() - msg.requestObject.t_start;

	console.log(`Completed uid:${uid}, res:${msg.requestObject.resolution}`);
	
	this.plotCache = this.setPlotCache({
	    [uid]: {
		windowDims: {$set: this.paneCfg.dims},
		Plot: {$set: msg.requestObject.Plot},
		ImgData: {
		    [splitMode]: {				
			$set: {
			    greyscale:      msg.ImageData_grey,
			    heatmap:        msg.ImageData_heatmap,
			    resolution:     msg.requestObject.resolution,
			    dims:           renderedDims,
			    render_timings: {
				'final': duration_ms,
				'fast':  duration_ms,
				'inProgress': false
			    },
			}
		    }
		}
	    }
	});

    },

    //handler for when worker coughs up the stats...
    handleStatsComplete: function(msg){

	const uid          = msg.requestObject.Plot.uid;
	const splitMode    = msg.requestObject.paneCfg.splitMode;
	
	this.plotCache = this.setPlotCache({
	    [uid]: {
		ImgData: {
		    [splitMode]: {			
			render_stats: {$set: msg.stats_obj}
		    }
		}
	    }
	});
	
	//recursive call...
	this.launchRender();
    },
    

    paneCfg: null,
    plotArray: null,
    plotUIState: null,

    newData: function(data){

	if(!this.initiated){return;}
	this.plotCache = this.setPlotCache({k: {$set: "v"}}); // dummy call is to get the cache
	
	// iterate through the new Plot Array provided.
	for(var i = 0; i < data.plotArray.length; i++){

	    // get the Plot of the same UID in the old Array
	    const newPlot = data.plotArray[i];
	    const uid     = newPlot.uid;
	    const oldPlot = _.find(this.plotArray, {uid: uid} );

	    // if there is change, wipe the cache
	    if(!this.plotCache[uid] || newPlot !== oldPlot){

		// this guarentees a placeholder object is at that UID. Ensure object writing to specific keys works
		this.setPlotCache({
		    [uid]: {$set: {windowDims: null, Plot: null, ImgData: {}}}
		});

	    }
	}

	this.plotCache = this.setPlotCache({k: {$set: "v"}}); // another dummy call. Get the refreshed cache
	
	this.plotArray = data.plotArray;
	this.plotUIState = data.plotUIState;
	this.paneCfg = data.paneCfg;

	// If the cycle had ended, restart it.
	if(!this.running){
	    this.launchRender();
	    this.running = true;
	}
    }
    
};


export default Plot_CacheManager;
