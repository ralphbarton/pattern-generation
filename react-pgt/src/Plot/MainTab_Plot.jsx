import React from 'react';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
import WgActionLink from '../Wg/WgActionLink';


import Plot_util from './plain-js/Plot_util';

import Plot_Popout from './Plot_Popout';
import Plot_Section_FormulaBar from './Plot_Section_FormulaBar';

import Plot_Section_Histogram from './Plot_Section_Histogram';
import Plot_Section_ZoomRotateTranslate from './Plot_Section_ZoomRotateTranslate';
import Plot_Section_PreviewOptions from './Plot_Section_PreviewOptions';
import Plot_Section_PointsetPreview from './Plot_Section_PointsetPreview';



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
	    overlayAxesScale: false
	});
    }

    
    rowClassingFn(Plot){
	const isComplex = Plot_util.check_eqn_type(Plot.formula) === "cplx";
	const isInvalid = Plot_util.check_eqn_type(Plot.formula) === "invalid";
	return (isComplex ? "pink" : "") + (isInvalid ? "invalid" : "");
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
		renderCellContents: (plot, i, rowIsSelected)=>{return ("x");}
	    },
	]);
    }

    
    render(){

	if(this.props.UI.selectedRowIndex === undefined){return null;}
	const Plot_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];

	return (

	    <div className="MainTab_Plot">

	      
	      {/* 1.  Formula Bar */}
	      <Plot_Section_FormulaBar
		 Plot_i={Plot_i}
		 handleSelPlotChange={this.props.fn.handleModifySelPGTobj}
		 rowClassingFn={this.rowClassingFn}
		 />


	      
	      {/* 2.  Table, and accompanying controls (i.e. buttons beneath) */}
	      <div className="tableWithButtonsZone">
		<WgTable
		   selectedRowIndex={this.props.UI.selectedRowIndex}
		   onRowSelectedChange={(i)=>{this.props.fn.handleRowSelectedChange(i);}}
		  rowRenderingData={this.props.PGTobjArray}
		  columnsRendering={this.plot_WgTableColumns()}
		  rowClassingFn={this.rowClassingFn}
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
		       enabled={true}
		       />
		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       enabled={true}
		       />
		  </div>
		  
	      </div>



	      
	      {/* 3.  Histogram */}
	      <Plot_Section_Histogram
		 />


	      
	      {/* 4.  Third Column */}
	      <div className="thirdColumnZone">		  

		
		{/* 4.1.  The Zoom + Rotate + Translate controls section... */}
		<Plot_Section_ZoomRotateTranslate
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
		    handleClose={()=>{this.setState({showExtraWindow: null});}}
			/>
		}
	      
	    </div>

	);
    }
    
}

export default MainTab_Plot;
