import React from 'react';

//import Pointset_calculate from '../Pointset/plain-js/Pointset_calculate';
//import Pointset_render from '../Pointset/Pointset_render';

class Background_Plot2 extends React.PureComponent {

    imgDataToCanvas(){

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return;}
	
	// get UI variables relating to what should be shown...
	const plotUid = plotUIState.selectionUid;
	const colour = plotUIState.colouringFunction === 2 ? "heatmap" : "greyscale";

	// extract the correct ImgData from the cache...
	const Cached4Plot = this.props.PlotImgCache[plotUid];
	const ImgData = Cached4Plot.ImgData.single[colour];
	
	const ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(ImgData, 0, 0);
    }

    componentDidUpdate(){
	this.imgDataToCanvas();
    }

    componentDidMount(){
	this.imgDataToCanvas();
    }


    shouldComponentUpdate(nextProps){

	const plotUid = this.props.plotUIState.selectionUid;

	// don't respond to changes in 'props.dims'. Impacts of this will be secondary
	// don't respond to changes in 'props.plotArray'. Impacts of this will be secondary
	const c1 = nextProps.plotUIState  !== this.props.plotUIState;
	const c2 = nextProps.PlotImgCache[plotUid] !== this.props.PlotImgCache[plotUid];

	// the cache may contain a blank...
	const c3 = nextProps.PlotImgCache[plotUid].Plot !== null;
	
	return (c1 || c2) && c3;
    }
    
    render() {

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return null;}

	//this update is always important.
	const paneW = this.props.dims.width;
	const paneH = this.props.dims.height;

	
	return (
	    <div className="Background_Plot">
	      <canvas
		 className={"plot-canvas" + (plotUIState.hideUnderlyingDensity ? " hide" : "")}
		 width={paneW}
		 height={paneH}
		 ref={ (el) => {this.canvasElement = el;}}
		 style={{background: "#dd9944"}}
		/>
		{/*
		<Pointset_render
'		   points={this.points}
		   hide={plotUIState.pointsQuantity === 0}
		   colouring={plotUIState.colouringFunction}
		   />
		*/}
	    </div>
	);
    }
    
}


export default Background_Plot2;
