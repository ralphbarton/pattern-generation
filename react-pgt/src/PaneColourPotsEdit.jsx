import React, { Component } from 'react';
import './PaneColourPotsEdit.css';

import update from 'immutability-helper';

import cpot_util from './CpotUtil';

import WgTable from './WgTable';
import WgButton from './WgButton';
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
	    cpot: cpot_updated
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
		renderCellContents: (item, rIndex)=>{return (rIndex+1);}
	    },{
		heading: "Prob",
		renderCellContents: (item, rIndex)=>{return (
		    <input className="blue-cell"
			   value={item.prob} 

	
			   //need to modify this to set the relevant value in array...
	
			   onChange={event =>{
			       // This ought to be a SmartInput. I don't want to be parsing ints, everywhere....
			       //
			       const user_prob = parseInt(event.target.value, 10);
			       const updatedItem = update(item, {prob: {$set: user_prob}});
			       this.handleEditingCpotChange({
				   contents: {$splice: [[rIndex, 1, updatedItem]]}
			       });
		      }}
		      />
		);}
	    },{
		heading: "Item",
		renderCellContents: (item, rIndex)=>{
		    
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
		     value={this.state.cpot.name} 
		     onChange={event => {			 
			 this.handleEditingCpotChange({
			     name: {$set: event.target.value}
			 });
		}}
		/>

	      <WgTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		rowRenderingData={this.state.cpot.contents}
		columnsRendering={this.cpotEdit_WgTableColumns()}
		/>


		<div className="mainButtons">
		  <WgButton
		     name="Cancel"
		     onClick={this.props.onCloseEditingMode.bind()}
		     enabled={true}
		     />
		  <WgButton
		     name="Done"
		     onClick={()=>{
			 this.props.onSaveEdits(this.state.cpot);
			 this.props.onCloseEditingMode();
		    }}
		     enabled={true}
		     />
		</div>		



	    </div>
	);
    }



}
    



export default PaneColourPotsEdit;
