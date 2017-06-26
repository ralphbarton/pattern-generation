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
	this.handleUIStateChange = this.handleUIStateChange.bind(this);
	this.state = {
	    previewFeaturesTabSelected: 1,
	    /*
	     1 - Syntax & Inbuilt functions
	     2 - Formula Designer
	     3 - Zoom & Rotate -> More
	     */
	    showExtraWindow: null
	};


    }


    /*
     Controlled Component Pattern for 'Plot', as with 'Grid'

     UI State is passed down via:
     this.props.UI

     UI sub-properties are:

     'selectedRowIndex'
     'selectedPlotUid'
     'previewActive'
     'colouringFunction'
     'plotResolution'
     'pointsQuantity'
     'pointsProminenceFactor'
     'hideUnderlyingDensity'
     'showContours'
     'quantityContours'
     'overlayAxesScale'

     State changes are passed back up via:

     this.props.setPlotUIState($chg)

     */    

    // Copy-pasted, shared with Grid
    // An (immutable) change in the selected Grid object
    handleSelPlotChange($change){
	const rIndex = this.props.UI.selectedRowIndex;
	this.props.onPlotChange("update", {index: rIndex, $Updater: $change});
    }


    // pass UI state change up to a parent component. It is not stored here...
    handleUIStateChange(key, value){
	this.props.setPlotUIState({
	    [key]: {$set: value}
	});
	console.log("Maintab", key, value);
    }

    
    componentDidMount(){

	//no action required if a value already set
	if(this.props.UI.selectedRowIndex !== undefined){return;}

	/* This will set some suitable Default values for
	 props (previously undefined) on component mount 
	 the very first rendering prior to this function call is 'sacrificial'
	 */

	const initialSelectedRowIndex = 0;
	const Plot_i = this.props.plotArray[initialSelectedRowIndex];
	
	this.props.setPlotUIState({
	    selectedRowIndex: {$set: initialSelectedRowIndex},
	    selectedPlotUid: {$set: Plot_i.uid},
	    previewActive: {$set: true},
	    colouringFunction: {$set: 1},
	    plotResolution: {$set: 3},
	    pointsQuantity: {$set: 0},
	    pointsProminenceFactor: {$set: 2},
	    hideUnderlyingDensity: {$set: false},
	    showContours: {$set: false},
	    quantityContours: {$set: 6},
	    overlayAxesScale: {$set: false}
	});
    }

    
    // Copy-pasted, shared with Grid / Cpot
    handleRowSelectedChange(index){

	const Plot_i = this.props.plotArray[index];

	//the object is updated to contain both the index and the UID of the plot...
	this.props.setPlotUIState({
	    selectedRowIndex: {$set: index},
	    selectedPlotUid: {$set: Plot_i.uid}
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
			       const $change = {formula: {$set: event.target.value}};
			       this.props.onPlotChange("update", {index: i, $Updater: $change});
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
	const Plot_i = this.props.plotArray[this.props.UI.selectedRowIndex];
	return (

	    <div className="MainTab_Plot">

	      
	      {/* 1.  Formula Bar */}
	      <Plot_Section_FormulaBar
		 Plot_i={Plot_i}
		 handleSelPlotChange={this.handleSelPlotChange}
		 rowClassingFn={this.rowClassingFn}
		 />


	      
	      {/* 2.  Table, and accompanying controls (i.e. buttons beneath) */}
	      <div className="tableWithButtonsZone">
		<WgTable
		   selectedRowIndex={this.props.UI.selectedRowIndex}
		   onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		  rowRenderingData={this.props.plotArray}
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
					 handleUIStateChange={this.handleUIStateChange}
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
					 handleUIStateChange={this.handleUIStateChange}
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
