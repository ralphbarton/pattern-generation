import React from 'react';
var _ = require('lodash');

import Draggable from 'react-draggable';

// generic project widgets

import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';
import WgBoxie from '../Wg/WgBoxie';

import Cfun_util from './plain-js/Cfun_util';


import imgUpArrow   from './asset/Arrow_up.png';


class MainTab_Cfun extends React.PureComponent {

    componentDidMount(){
	// this function call sets "UI.selectedRowIndex" (needed for table) - even if an empty object is passed
	this.props.fn.defaultUIStateConfiguration({
	    /* previewActive: true */
	});
    }
    
    cfun_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (cfun, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Description",
		renderCellContents: (cfun, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={cfun.name} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {name: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    },
	    {
		heading: "Preview",
		renderCellContents: (cfun, i, rowIsSelected)=>{
		    return (
			<div className="chequer">
			  <div className="prev" style={Cfun_util.cssGradient(cfun)}/>
			</div>
		    );
		}
	    }
	]);
    }

    
    render() {

	if(this.props.UI.selectedRowIndex === undefined){return null;}
	const Cfun_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];

	return (

	    <div className="MainTab_Cfun">
	      
	      {/* Column 1:  Table, buttons beneath, and 1× boxie) */}
	      <div className="column1">
		<div className="tableWithButtonsZone">
		  <WgTable
		     selectedRowIndex={this.props.UI.selectedRowIndex}
		     onRowSelectedChange={(i)=>{this.props.fn.handleRowSelectedChange(i);}}
		     rowRenderingData={this.props.PGTobjArray}
		     columnsRendering={this.cfun_WgTableColumns()}
		     rowClassingFn={this.rowClassingFn}
		    />

		    <div className="mainButtons">		  
		      
		      <WgButton
			 name="Delete"
			 buttonStyle={"small"}
			 onClick={this.props.fn.handleDeleteSelPGTobj}
			 enabled={this.props.PGTobjArray.length > 1}
			 />
		      <WgButton
			 name="Add"
			 buttonStyle={"small"}
			 onClick={this.props.fn.hofHandleAddPGTobj(Cfun_util.newRandomCfun)}
			 enabled={true}
			 />
		      <WgButton
			 name="Dupl."
			 buttonStyle={"small"}
			 onClick={this.props.fn.handleDuplicateSelPGTobj}
			 />

		    </div>
		    
		</div>
	      </div>
		

	      {/* Column 2:  main interface */}
	      <div className="column2">

		{/* 2.1  Upper Controls */}
		<div className="upperControls">

		  <WgDropDown
		     name={false?"Opacity Separated":"Opacity Combined"}
		     className="opacitySeparated"
		     ddStyle="plain">
		    Content within Popout goes here...
		  </WgDropDown>

		  <WgDropDown
		     name="Gradation"
		     className="gradation"
		     ddStyle="plain">
		    Content within Popout goes here...
		  </WgDropDown>

		  <WgDropDown
		     name="Add Repetition..."
		     className="addRepetition"
		     ddStyle="plain">
		    Content within Popout goes here...
		  </WgDropDown>
		  
		</div>


		{/* 2.2  Interactive Cfun */}
		<div className="interactiveCfun">
		  <div className="chequer">
		    <div className="strip" style={Cfun_util.cssGradient(Cfun_i)}/>
		  </div>

		  <div className="stopsContainer">
		    {
			[1,2,3,4].map( J=>{
			return (
			    <Draggable
			       key={J}
			       bounds={{left: 0, top: 0, right: 400, bottom: 0}}
			       >
			      <div>
				<img src={imgUpArrow}
				     //prevents firefox drag effect
				     onMouseDown={(event) => {if(event.preventDefault) {event.preventDefault();}}}
				  alt=""/>
			      </div>
			    </Draggable>

			);
			})
		    }

		  </div>

		</div>

		
		{/* 2.3  Colour-Stop controls */}		
		<WgBoxie className="colourStop" name="Colour Stop">
		  Colour sun and other stuff here
		</WgBoxie>

	      </div>
	      
	    </div>

	);
    }
    
}

import withTabSupport from './../HOC/withTabSupport';
export default withTabSupport(MainTab_Cfun);
