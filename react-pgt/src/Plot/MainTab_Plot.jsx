import React from 'react';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
import WgActionLink from '../Wg/WgActionLink';


import Plot_util from './plain-js/Plot_util';

//these two are for Thumbnail generation...
import Plot_RenderManager from './plain-js/Plot_RenderManager';

import Plot_Popout from './Plot_Popout';
import Plot_Section_FormulaBar from './Plot_Section_FormulaBar';

import Plot_Section_Histogram from './Plot_Section_Histogram';
import Plot_Section_ZoomRotateTranslate from './Plot_Section_ZoomRotateTranslate';
import Plot_Section_PreviewOptions from './Plot_Section_PreviewOptions';
import Plot_Section_PointsetPreview from './Plot_Section_PointsetPreview';


class Plot_Thumbnail extends React.PureComponent {

    applyThumbImgData(){
	const thumb_img = Plot_RenderManager.render({
	    Plot: this.props.Plot,
	    width: 55,
	    height: 55,
	    resolution: 1,
	    colouringFunction: this.props.colouringFunction
	});	
	
	var ctx = this.ThumbCanvas.getContext('2d');
	ctx.putImageData(thumb_img, 0, 0);
    }
    
    componentDidUpdate(){
	this.applyThumbImgData();
    }

    componentDidMount(){
	this.applyThumbImgData();
    }
    
    render(){
	return (
	    <canvas
	       className={"plot-thumb uid-" + this.props.Plot.uid}
	       width={55}
	       height={55}
	       ref={ (el) => {this.ThumbCanvas = el;}}
	      />
	);
    }
}



	

class MainTab_Plot extends React.PureComponent {

    constructor() {
	super();
	//the state here is purely UI-display-state
	// than user-settings-state,  held at a higher level, gets different treatment...
	this.state = {
	    previewFeaturesTabSelected: 0,
	    showExtraWindow: null
	    /*
	     'showExtraWindow' - options
	     1 - Syntax & Inbuilt functions
	     2 - Formula Designer
	     3 - Zoom & Rotate -> More
	     */
	};
	
	// not passing a callback means no worker-thread involved here...
	Plot_RenderManager.init();
    }

    componentDidMount(){
	// set state of parent component...
	this.props.fn.defaultUIStateConfiguration({
	    previewActive: false,
	    colouringFunction: 1,
	    plotResolution: 1,
	    pointsQuantity: 0,
	    pointsProminenceFactor: 2,
	    hideUnderlyingDensity: false,
	    showContours: false,
	    quantityContours: 6,
	    overlayAxesScale: false,
	    zoomRT: {
		mouseZoom: false,
		aspectRatioLock: false,
		zoomXonlyYonly: 'xy',
		stepsSML: 'm'
	    },
	    // dummy data here. Can probably scrap it...
	    stats_obj: {
		n_points: "0",
		v_min: "-Infinity",
		v_max: "-Infinity",
		v10pc: "-Infinity",
		v90pc: "-Infinity",
		median: "0.02"
	    },
	    timings_obj: { // use type integer (units are ms)
		inProgress: false,
		fast: 0,
		final: 0
	    }
	});
    }
    
    plot_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (plot, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Formula",
		renderCellContents: (plot, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={plot.formula} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {formula: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    },{
		heading: "Thumb.",
		renderCellContents: (plot, i, rowIsSelected)=>{
		    return (
			<Plot_Thumbnail
			   Plot={plot}
			   colouringFunction={this.props.UI.colouringFunction}		   
			   />
		    );}
	    },
	]);
    }

    
    render(){

	if(this.props.UI.selectedRowIndex === undefined){return null;}
	const Plot_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];
	const formulaCheck = Plot_util.checkPlotFormula(Plot_i);
	const isAdjustable = this.props.UI.previewActive && formulaCheck.determination !== "invalid";

	return (

	    <div className="MainTab_Plot">

	      
	      {/* 1.  Formula Bar */}
	      <Plot_Section_FormulaBar
		 onSyntaxHelpClick={()=>{this.setState({showExtraWindow: "syntaxHelp"});}}
		 Plot_i={Plot_i}
		 handleSelPlotChange={this.props.fn.handleModifySelPGTobj}
		 previewActive={this.props.UI.previewActive}
		 renderingInProgress={this.props.UI.timings_obj.inProgress}
		 stats={this.props.UI.stats_obj}
		 />


	      
	      {/* 2.  Table, and accompanying controls (i.e. buttons beneath) */}
	      <div className="tableWithButtonsZone">
		<WgTable
		   selectedRowIndex={this.props.UI.selectedRowIndex}
		   onRowSelectedChange={this.props.fn.handleRowSelectedChange.bind(null)}//row index passed as single param
		   rowRenderingData={this.props.PGTobjArray}
		   columnsRendering={this.plot_WgTableColumns()}
		   rowClassingFn={Plot_util.checkPlotFormula}
		  />

		  <div className="mainButtons">		  
		    <WgActionLink
		       name={"Formula Designer"}
		       onClick={()=>{this.setState({showExtraWindow: "formulaDesigner"});}}
		      enabled={true}
		      />
		    
		    <WgButton
		       name="Add"
		       buttonStyle={"small"}
		       onClick={this.props.fn.hofHandleAddPGTobj(Plot_util.newPlot)}
		       enabled={true}
		      />
		      
		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       onClick={this.props.fn.handleDeleteSelPGTobj}
		       enabled={this.props.PGTobjArray.length > 1}
		       />
		  </div>
		  
	      </div>



	      
	      {/* 3.  Histogram */}
	      <Plot_Section_Histogram
		 stats={this.props.UI.stats_obj}
		 Plot_i_autoScale={Plot_i.autoScale}
		 isAdjustable={isAdjustable}
		 handleSelPlotChange={this.props.fn.handleModifySelPGTobj} // 'autoScale' is a PGTobj property
		 />


	      
	      {/* 4.  Third Column */}
	      <div className="thirdColumnZone">		  

		
		{/* 4.1.  The Zoom + Rotate + Translate controls section... */}
		<Plot_Section_ZoomRotateTranslate
		   zoomRT_UI={this.props.UI.zoomRT}
		   enable={isAdjustable}
		   setPGTtabUIState={this.props.setPGTtabUIState}
		   Plot_i={Plot_i}
		   handleSelPlotChange={this.props.fn.handleModifySelPGTobj}
		   onClickMore={()=>{this.setState({showExtraWindow: "ZR-More"});}}
		  />

		  
		{/* 4.2.  Preview Features ( = 'preview options' & 'pointset preview'  */}
		<WgTabbedBoxie
		   className="PreviewFeatures"
		   tabbedBoxieStyle={"small"}
		   tabSelectedIndex={this.state.previewFeaturesTabSelected}
		   // The function below is worth rewriting for every component instance
		   // it sets the specific state variable associated with the tab choice
		   onTabClick={ new_i => {
		       if (new_i === this.state.previewFeaturesTabSelected){return;}
		       this.setState({
			   previewFeaturesTabSelected: new_i
		       });
		   }}
		  items={
		      [
			  {
			      name: "Preview Options",
			      renderJSX: ()=>{
				  return(
				      <Plot_Section_PreviewOptions
					 UI={this.props.UI}
					 handleUIStateChange={this.props.fn.handleUIStateChange}
					 validFormulaSelected={formulaCheck.determination !== "invalid"}
					 />
				   );
			      }
			  },{
			      name: "Pointset Preview",
			      enabled: this.props.UI.previewActive,
			      renderJSX: ()=>{
				  return(
				      <Plot_Section_PointsetPreview
					 UI={this.props.UI}
					 handleUIStateChange={this.props.fn.handleUIStateChange}
					 />
				  );
			      }
			  }
		      ]
		  }
		/>
		
		</div>


		{/* 5.  Popout window (it will render conditionally).  */}
		{
		    this.state.showExtraWindow !== null &&
			<Plot_Popout
		    popoutType={this.state.showExtraWindow}
		    Plot={Plot_i}
		    handleClose={()=>{this.setState({showExtraWindow: null});}}
			/>
		}
	      
	    </div>

	);
    }
    
}

export default MainTab_Plot;
