import React from 'react';

// generic project widgets

import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
/*
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
import WgActionLink from '../Wg/WgActionLink';
*/


class MainTab_MotfView extends React.PureComponent {

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
	    previewActive: true,
	    colouringFunction: 1,
	    motfResolution: 1,
	    pointsQuantity: 0,
	    pointsProminenceFactor: 2,
	    hideUnderlyingDensity: false,
	    showContours: false,
	    quantityContours: 6,
	    overlayAxesScale: false
	});
    }
    
    motf_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (motf, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Title",
		renderCellContents: (motf, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={motf.name} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {formula: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    },{
		heading: "D.",
		renderCellContents: (motf, i, rowIsSelected)=>{return "2D";}
	    },
	    {
		heading: "Prev.",
		renderCellContents: (motf, i, rowIsSelected)=>{
		    return ("svg");
		}
	    },
	]);
    }

    
    render(){

	if(this.props.UI.selectedRowIndex === undefined){return null;}
//	const Motf_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];

	return (

	    <div className="MainTab_MotfView">
	      	      
	      {/* 1.  Table, and accompanying controls (i.e. buttons beneath) */}
	      <div className="tableWithButtonsZone">
		<WgTable
		   selectedRowIndex={this.props.UI.selectedRowIndex}
		   onRowSelectedChange={(i)=>{this.props.fn.handleRowSelectedChange(i);}}
		  rowRenderingData={this.props.PGTobjArray}
		  columnsRendering={this.motf_WgTableColumns()}
		  rowClassingFn={this.rowClassingFn}
		  />

		  <div className="mainButtons">		  
		    
		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       enabled={true}
		       />
		    <WgButton
		       name="Add"
		       buttonStyle={"small"}
		       enabled={true}
		       />
		    <WgButton
		       name="Dupl."
		       buttonStyle={"small"}
		       enabled={true}
		       />
		    <WgButton
		       name="Edit"
		       buttonStyle={"small"}
		       enabled={true}
		       />

		  </div>
		  
	      </div>



	      
	      {/* 3.  Just add more stuff here... */}
	      
	    </div>

	);
    }
    
}

export default MainTab_MotfView;
