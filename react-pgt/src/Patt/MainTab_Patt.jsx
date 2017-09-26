import React from 'react';
var _ = require('lodash');

import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';

import Patt_util from './plain-js/Patt_util';

import Patt_Section_IncludeMotifs from './Patt_Section_IncludeMotifs';
import Patt_Section_PatternDrive from './Patt_Section_PatternDrive';

class MainTab_Patt extends React.PureComponent {

    constructor() {
	super();
	this.patt_WgTableColumns          = this.patt_WgTableColumns.bind(this);
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


		{/* 2.1 Pattern Drive */}
		<Patt_Section_PatternDrive
		   Patt_i={Patt_i}
		   handleModifySelPatt={this.props.fn.handleModifySelPGTobj}
		   />




		{/* 2.2 Include Motifs */}		
		<Patt_Section_IncludeMotifs
		   Patt_i={Patt_i}
		   patt_selectedIndex={this.props.UI.selectedRowIndex}
		   handleModifySelPatt={this.props.fn.handleModifySelPGTobj}
		   MotfArray={this.props.PGTobjARRAYS["motf"]}
		   />


		
	      </div>




	      
	      {/* 3. "Right Side Space" - this has variable contents... */}
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
