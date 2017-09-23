import React from 'react';
var _ = require('lodash');

import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';

class MainTab_Patt extends React.PureComponent {

    constructor() {
	super();
	this.patt_WgTableColumns = this.patt_WgTableColumns.bind(this);
    }


    patt_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (patt, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Title",
		renderCellContents: (patt, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={patt.name} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {name: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    }
	]);
    }

    componentDidMount(){
	//this function here will initialise "selectedRowIndex" to a default value...
	this.props.fn.defaultUIStateConfiguration({
	    dummyState: 1
	});
    }

    render() {
	
	if(this.props.UI.selectedRowIndex === undefined){return null;}
	const Patt_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];
	
	return (
	    <div className="MainTab_Grid">

	    
	      {/* 1. Table & buttons beneath */}
	      <div className="tableWithButtonsZone">
	      <WgTable
		 selectedRowIndex={this.props.UI.selectedRowIndex}
		 onRowSelectedChange={this.props.fn.handleRowSelectedChange.bind(null)}//row index passed as single param
		 rowRenderingData={this.props.PGTobjArray}
		 columnsRendering={this.patt_WgTableColumns()}
		/>

	      {null/*
		<div className="mainButtons">

		  <WgButton
		     name="Add"
		     buttonStyle={"small"}
		     onClick={this.props.fn.hofHandleAddPGTobj(Grid_util.newRandomRectGrid.bind(2))}
		     enabled={true}
		     />
		  <WgButton
		     name="Delete"
		     buttonStyle={"small"}
		     onClick={this.props.fn.handleDeleteSelPGTobj}
		     // we cannot support zero grids in the list. Causes problems
		     enabled={this.props.PGTobjArray.length > 1}
		     />
		  <WgButton
		     name="Advanced Grid"
		     buttonStyle={"small"}
		     onClick={ function(){console.log("hi");}}
		     enabled={true}
		     />

		</div>*/}
	      </div>

	    </div>
	);
    }
    
}

import withTabSupport from './../withTabSupport';
export default withTabSupport(MainTab_Patt);
