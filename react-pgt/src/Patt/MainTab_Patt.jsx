import React from 'react';
var _ = require('lodash');

import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';

import Patt_util from './plain-js/Patt_util';
import {WgDropDown} from '../Wg/WgDropDown';

import Img_ArrowRight from './../asset/arrow-right-style2.png';

class MainTab_Patt extends React.PureComponent {

    constructor() {
	super();
	this.patt_WgTableColumns          = this.patt_WgTableColumns.bind(this);
	this.includeMotifs_WgTableColumns = this.includeMotifs_WgTableColumns.bind(this);
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

    includeMotifs_WgTableColumns(){
	return ([
	    {
		heading: "Motifs",
		renderCellContents: (patt, i, rowIsSelected)=>{return (
		    <div>Hello</div>
		);}
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
	    <div className="MainTab_Patt">

	    
	      {/* 1. Table & buttons beneath */}
	      <div className="tableWithButtonsZone">
	      <WgTable
		 selectedRowIndex={this.props.UI.selectedRowIndex}
		 onRowSelectedChange={this.props.fn.handleRowSelectedChange.bind(null)}//row index passed as single param
		 rowRenderingData={this.props.PGTobjArray}
		 columnsRendering={this.patt_WgTableColumns()}
		/>

		<div className="mainButtons">

		  <WgButton
		     name="Add"
		     buttonStyle={"small"}
		     onClick={this.props.fn.hofHandleAddPGTobj(Patt_util.newEmptyPattern)}
		     />
		  <WgButton
		     name="Delete"
		     buttonStyle={"small"}
		     onClick={this.props.fn.handleDeleteSelPGTobj}
		     />
		</div>
	      </div>

	      {/* 2. "Middle Column" - shows pattern drive and included motifs */}
	      <div className="middleColumn">

		<WgBoxie className="patternDrive" name="Pattern Drive" >

		  <WgDropDown
		     name="Grid"
		     ddStyle="plain"
		     className="setGrid">
		    grids here...
		  </WgDropDown>

		  <WgDropDown
		     name="Density"
		     ddStyle="plain"
		     className="setPlot">
		    densities here...
		  </WgDropDown>

		  <table className="WgTable">
		    <tbody><tr>
			<td className="col-1">
			  <img src={Img_ArrowRight}
			       alt=""
			       />
			</td>
			<td className="col-2">
			  <span className="none" style={{color: "grey", display: "inline"}}>(none)</span>
			  <span className="title"></span>
			</td>
		      </tr>
		  </tbody></table>
		  
		</WgBoxie>

		<WgBoxie className="includeMotifs" name="Include Motifs" >

		  <WgTable
		     selectedRowIndex={0}
		     onRowSelectedChange={this.props.fn.handleRowSelectedChange.bind(null)}//row index passed as single param
		     rowRenderingData={this.props.PGTobjArray}
		     columnsRendering={this.includeMotifs_WgTableColumns()}
		     />

		</WgBoxie>

	      </div>

	      {/* 1. Table & buttons beneath */}
	      <div className="rightSideSpace">
		<WgBoxie className="motifLinking" name="Motif Linking" >
		  efg
		</WgBoxie>
	      </div>

	    </div>
	);
    }
    
}

import withTabSupport from './../withTabSupport';
export default withTabSupport(MainTab_Patt);
