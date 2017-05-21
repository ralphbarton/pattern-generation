import React, { Component } from 'react';
import './PaneColourPotsEdit.css';

import update from 'immutability-helper';

import cpot_util from './CpotUtil';

import WgTable from './WgTable';
//import WgButton from './WgButton';
import {WgAlphaSwatch, WgGradientCell, WgColourPill} from './PaneColourPotsEdit_Util.jsx';
//import CpotCellBlock from './CpotCellBlock';

class PaneColourPotsEdit extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    cpot: this.props.cpot,
	    selectedRowIndex: 1
	};
    }

    handleEditingCpotChange(changesObject){
	const cpot_updated = update(this.state.cpot, changesObject);	
	this.setState({
	    cpotArray: cpot_updated
	});
    }
    
    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
    }

    cpotEdit_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (item, i)=>{return (i+1);}
	    },{
		heading: "Prob",
		renderCellContents: (item, i)=>{return (
		    <input className="blue-cell"
			   value={item.prob} 

			   /*
			   need to modify this to set the relevant value in array...
			   this.handleEditingCpotChange({
			     description: {$set: event.target.value}
			 });
			   */
			   onChange={event =>{
			       console.log("prob change...");
		      }}
		      />
		);}
	    },{
		heading: "Item",
		renderCellContents: (item, i)=>{
		    
		    switch (item.type) {
			
		    case "range":
			var xpRange = cpot_util.range_unpack( item.range );
			return (
			    <div className="range">
			      <div className="itemType">range</div>

			      <div className="itemDemo">
				<WgColourPill expandedRange={xpRange} />
				
				<div className="threeCells n1">
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:0, S:"y", L:"x"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:0, L:"y"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:"y", L:0}}/>
				</div>

				<div className="threeCells n2">
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:1, S:"y", L:"x"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:1, L:"y"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:"y", L:1}}/>
				</div>

				<WgAlphaSwatch type="range" expandedRange={xpRange} />
			      </div>
			      
			    </div>
			);
			
		    default:
			return (
			    <div className="solid">
			      <div className="itemType">solid</div>

			      <div className="itemDemo">
				<WgColourPill colourString={item.solid} />
				<WgAlphaSwatch type="solid" colourString={item.solid} />
			      </div>
			    </div>
			);
		    }

		}
	    }
	]);
    }
    
    render() {
	return (
	    <div className="PaneEditColourPots">

	      <input className="plain-cell"
		     value={this.state.cpot.description} 
		     onChange={event => {			 
			 this.handleEditingCpotChange({
			     description: {$set: event.target.value}
			 });
		}}
		/>

	      <WgTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		rowRenderingData={this.state.cpot.contents}
		columnsRendering={this.cpotEdit_WgTableColumns()}
		/>


	    </div>
	);
    }



}
    



export default PaneColourPotsEdit;
