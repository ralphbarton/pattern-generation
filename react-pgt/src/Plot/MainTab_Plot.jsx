import React from 'react';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgSpecialButton from '../Wg/WgSpecialButton';
import WgBoxie from '../Wg/WgBoxie';
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgActionLink from '../Wg/WgActionLink';
import WgSmartInput from '../Wg/WgSmartInput';



import Plot_util from './plain-js/Plot_util';

import Plot_Section_Popout from './Plot_Section_Popout';



class MainTab_Plot extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    previewOptionsTabSelected: 0,
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
	    previewActive: {$set: false},
	    colouringFunction: {$set: 0},
	    plotResolution: {$set: 3},
	    pointsQuantity: {$set: 0},
	    pointsProminenceFactor: {$set: 2},
	    hideUnderlyingDensity: {$set: false}
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

	      {/* 1. Formula Bar */}
	      <div className={"formulaBar "+this.rowClassingFn(Plot_i)}>

		<div className="upper">
		  <div className="barTitle">Formula Bar</div>

		  <WgActionLink
		       name={"Syntax & Inbuilt functions"}
		     onClick={()=>{this.setState({showExtraWindow: "syntaxHelp"});}}
		      enabled={true}
		      />

		  {/* Top: some text about evaluation of formula */}
		    <div className="evalBrief">
		      <span className="A">Input: </span>
		      <span className="B">-1 </span>
		      &lt; re{'{'}
		      <span className="C">z</span>		      
		      {'}'} &lt;
		      <span className="B"> +1</span>		      

		      <span className="A"> and </span>
		      <span className="B">-1.29 </span>
		      &lt; im{'{'}
		      <span className="C">z</span>		      
		      {'}'} &lt;
		      <span className="B"> +1.29 </span>		      

		      <span className="C"> ⟹ </span>
		      
		      <span className="A">Output: </span>
		      min = 
		      <span className="B"> -0.924</span>
		      <span className="A"> and </span>
		      max = 
		      <span className="B"> -0.924</span>

		    </div>

		</div>

		
		<span className="text-fxy"> f(x,y) = </span>
		<input className="plain-cell w"
		       value={Plot_i.formula} 		       
		       onChange={event =>{
			   this.handleSelPlotChange({formula: {$set: event.target.value}});
		  }}
		       />
	      </div>


	      {/* 2. Beneath formula bar, 3 main column sections */}
	      
	      {/* 2.1 Table & buttons beneath */}
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



	      
	      {/* 2.2 Histogram */}
	      <WgBoxie className="histogram" name="Histogram" boxieStyle={"small"} >

		<div className="Hblock hist">d3 histogram</div>
		<br/>
		<div className="Hblock conv">mini graph</div>

	      </WgBoxie>



	      {/* 2.3 Third Column */}
	      <div className="thirdColumnZone">		  

		{/* Middle: Zoom Controls */}
		<WgBoxie className="zoomRotate" name="Zoom & Rotate" boxieStyle={"small"}>

		  <div className="sectionLinks1">
		    <WgActionLink
		       name={"Reset Zoom"}
		       onClick={null}
		       enabled={true}
		       />
		    <WgActionLink
		       name={"Square Axes"}
		       onClick={null}
		       enabled={true}
		       />
		    <WgActionLink
		       name={"More"}
		       onClick={()=>{this.setState({showExtraWindow: "ZR-More"});}}
		       enabled={true}
		       />
		  </div>

		  
		  <div className="sectionButtons">

		    <div className="btns-zoom">
		      <div>Zoom:</div>		      
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="Plus"
			 onClick={null}
			 />
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="Minus"
			 onClick={null}
			 />
		    </div>

		    <div className="btns-rotate">
		      <div>Rotate:</div>
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="arrowClockwiseRing"
			 onClick={null}
			 />
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="arrowAnticlockwiseRing"
			 onClick={null}
			 />
		    </div>

		    <div className="btns-translate">
		      <div>Translate:</div>
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="arrowUp"
			 onClick={null}
			 />
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="arrowDown"
			 onClick={null}
			 />
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="arrowLeft"
			 onClick={null}
			 />
		      <WgSpecialButton
			 className="mediumSquare"
			 iconName="arrowRight"
			 onClick={null}
			 />
		    </div>

		  </div>

		  
		  <div className="sectionLinks2">

		    <WgMutexActionLink
		       name="Mouse Zoom:"
		       className="mouseZoom"
		       initalEnabledArray={[false, false]}
		       actions={[
			   {
			       name: "On"
			   },{
			       name: "Off"
			   }
		       ]}
		       />

		    <WgMutexActionLink
		       name="Aspect ratio:"
		       className="aspectRatio"
		       initalEnabledArray={[false, false]}
		       actions={[
			   {
			       name: "lock"
			   },{
			       name: "unlock"
			   }
		       ]}
		       />

		    <WgMutexActionLink
		       name="Zoom:"
		       className="zoomXonlyYonly"
		       initalEnabledArray={[false, false, false]}
		       actions={[
			   {
			       name: "x,y"
			   },{
			       name: "x only"
			   },{
			       name: "y only"
			   }
		       ]}
		       />

		    <WgMutexActionLink
		       name="Steps:"
		       className="stepsSML"
		       initalEnabledArray={[false, false, false]}
		       actions={[
			   {
			       name: "S"
			   },{
			       name: "M"
			   },{
			       name: "L"
			   }
		       ]}
		       />

		    
		  </div>

		</WgBoxie>

		{/* Bottom: Preview options */}
		<WgTabbedBoxie
		   className="previewOptions"
		   tabbedBoxieStyle={"small"}
		   tabSelectedIndex={this.state.previewOptionsTabSelected}
		   // The function below is worth rewriting for every component instance
		   // it sets the specific state variable associated with the tab choice
		   onTabClick={ new_i => {
		       if (new_i === this.state.previewOptionsTabSelected){return;}
		       this.setState({
			   previewOptionsTabSelected: new_i
		       });
		   }}
		  items={
		      [
			  {
			      name: "Preview Options",
			      renderJSX: ()=>{
				  return(
				      <div>

					<div className="inputContainer">
					  Plot Resolution:
					  <WgSmartInput
					     className="plain-cell s"
					     value={27}
					     dataUnit="pixels"
					     max={100}
					     onChange={null}
					    />
					</div>

					<WgMutexActionLink
					   name="Colouring:"
					   className="colouringFunction"
					   initalEnabledArray={[false, false]}
					   actions={[
					       {
						   name: "greyscale"
					       },{
						   name: "heatmap"
					       }
					   ]}
					   />

					<WgButton
					   name="Plot Preview"
					   onClick={null}
					   />
					
				      </div>

				  );
			      }
			  },{
			      name: "Pointset Preview",
			      enabled: this.props.UI.previewActive,
			      renderJSX: ()=>{
				  return(
				      <div>Hello 2</div>
				  );
			      }
			  }
		      ]
		  }
		/>
		
		</div>
		{
		    this.state.showExtraWindow !== null &&
			<Plot_Section_Popout
		    popoutType={this.state.showExtraWindow}
		    handleClose={()=>{this.setState({showExtraWindow: null});}}
			/>
		}
	      
	    </div>

	);
    }
    
}

export default MainTab_Plot;
