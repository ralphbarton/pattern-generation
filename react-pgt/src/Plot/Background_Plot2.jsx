import React from 'react';

//import Pointset_calculate from '../Pointset/plain-js/Pointset_calculate';
//import Pointset_render from '../Pointset/Pointset_render';

class Background_Plot2 extends React.PureComponent {

    imgDataToCanvas(){

	const plotUIState = this.props.plotUIState;
	if(!plotUIState.previewActive){return;}
	
	// extract the correct ImgData from the cache...
	const plotUid = plotUIState.selectionUid;
	const colouringFunction = plotUIState.colouringFunction;



	const uid = 0;
	const ImgData = this.props.PlotImgCache[uid].ImgData.single.greyscale;
	
	const ctx = this.canvasElement.getContext('2d');
	ctx.putImageData(ImgData, 0, 0);
    }

    componentDidUpdate(){
	this.imgDataToCanvas();
    }

    componentDidMount(){
	this.imgDataToCanvas();
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
		   points={this.points}
		   hide={plotUIState.pointsQuantity === 0}
		   colouring={plotUIState.colouringFunction}
		   />
		*/}
	    </div>
	);
    }
    
}


export default Background_Plot2;
