import React from 'react';
var _ = require('lodash');

// Wg (widgets)
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';

// specific code import
import Cfun_util from './plain-js/Cfun_util';

// Components of the cfun tab...
import Cfun_Section_UpperControls from './Cfun_Section_UpperControls';
import Cfun_Section_InteractiveStrip from './Cfun_Section_InteractiveStrip';
import Cfun_Section_ColourStop from './Cfun_Section_ColourStop';
//import Cfun_Section_Repetition from './Cfun_Section_Repetition';


class MainTab_Cfun extends React.PureComponent {

    constructor() {
	super();
	this.hofSetUI_BGrins = this.hofSetUI_BGrins.bind(this);
    }
    
    componentDidMount(){
	// this function call sets "UI.selectedRowIndex" (needed for table) - even if an empty object is passed
	this.props.fn.defaultUIStateConfiguration({
	    stopSelected: undefined,
	    pickerActive: false,
	    BGrins: {
		LargeSize: false,
		ColStrFormat: "hex3" /* values: "hex3", "rgb", "hsl" */
	    }
	});
	
    }

    hofSetUI_BGrins(subkey, value){
	const TS = this;
	return function (){
	    TS.props.setPGTtabUIState({
		BGrins: {[subkey]: {$set: value}}
	    });
	};
    };

    componentWillReceiveProps(nextProps){
	const rowSelectedChg = nextProps.UI.selectedRowIndex !== this.props.UI.selectedRowIndex;
	if(rowSelectedChg){
	    this.props.fn.handleUIStateChange("stopSelected", undefined);
	}
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
		<Cfun_Section_UpperControls
		   UpdateSelectedCfun={this.props.fn.handleModifySelPGTobj}
		   Cfun_i={Cfun_i}
		   />

		{/* 2.2  Interactive Cfun */}
		<Cfun_Section_InteractiveStrip
		   Cfun_i={Cfun_i}
		   UpdateSelectedCfun={this.props.fn.handleModifySelPGTobj}
		   UI={this.props.UI}
		   handleUIStateChange={this.props.fn.handleUIStateChange}
		   />


		
		{/* 2.3 Beneath "Interactive Cfun".... Colour-Stop controls - or somthing else...... */}
		{ this.props.UI.stopSelected !== undefined &&
		    <Cfun_Section_ColourStop
			   Cfun_i={Cfun_i}
			   UpdateSelectedCfun={this.props.fn.handleModifySelPGTobj}
			   UI={this.props.UI}
			   handleUIStateChange={this.props.fn.handleUIStateChange}
			   hofSetUI_BGrins={this.hofSetUI_BGrins}
			   />
		}

		
	      </div>
	      
	    </div>

	);
    }
    
}

import withTabSupport from './../HOC/withTabSupport';
export default withTabSupport(MainTab_Cfun);
