import React from 'react';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgSpecialButton from '../Wg/WgSpecialButton';
import WgBoxie from '../Wg/WgBoxie';
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgActionLink from '../Wg/WgActionLink';


//main.js

import Plot_util from './plain-js/Plot_util';


class MainTab_Plot extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 0,
	    previewActive: false,
	    previewOptionsTabSelected: 0
	};


    }


    // Copy-pasted, shared with Grid
    // An (immutable) change in the selected Grid object
    handleSelPlotChange($change){
	const rIndex = this.state.selectedRowIndex;
	this.props.onPlotChange("update", {index: rIndex, $Updater: $change});
    }

    // Copy-pasted, shared with Grid / Cpot
    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
	/*
	const Grid_i = this.props.gridArray[index];

	//the object is updated to contain both the index and the UID of the grid...
	this.props.setGridUIState({
	    selectedRowIndex: {$set: index},
	    selectedGridUid: {$set: Grid_i.uid}
	});
*/
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
	const rIndex = this.state.selectedRowIndex;
	const Plot_i = this.props.plotArray[rIndex];
	return (

	    <div className="MainTab_Plot">

	      {/* 1. Formula Bar */}
	      <div className={"formulaBar "+this.rowClassingFn(Plot_i)}>

		<div className="upper">
		  <div className="barTitle">Formula Bar</div>

		  <div className="actionsBar">
		    <WgActionLink
		       name={"Syntax Guide"}
		       onClick={()=>{console.log("no action implemented.");}}
		      enabled={true}
		      />

		      <WgActionLink
			 name={"Functions Palette"}
			 onClick={()=>{console.log("no action implemented.");}}
			enabled={true}
			/>

			<WgActionLink
			   name={"Formula Designer"}
			   onClick={()=>{console.log("no action implemented.");}}
			  enabled={true}
			  />

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
		   selectedRowIndex={this.state.selectedRowIndex}
		   onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		  rowRenderingData={this.props.plotArray}
		  columnsRendering={this.plot_WgTableColumns()}
		  rowClassingFn={this.rowClassingFn}
		  />

		  <div className="mainButtons">

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

		{/* Top: some text about evaluation of formula */}
		<span> some text about evaluation of formula </span>		  

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
		       onClick={null}
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
		   onTabClick={ new_i => {
		       if (new_i === this.state.previewOptionsTabSelected){return;}
		       this.setState({
			   previewOptionsTabSelected: new_i
		       });
		   }}
		  items={
		      [
			  {
			      name: "a1",//"Preview Options",
			      renderJSX: ()=>{
				  return(
				      <div>Hello 1</div>
				  );
			      }
			  },{
			      name: "a3",//"Pointset Preview",
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
	      


	      
	    </div>

	);
    }
    
}

export default MainTab_Plot;
