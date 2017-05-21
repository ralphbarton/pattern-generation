import React, { Component } from 'react';
import './PaneColourPotsEdit.css';

import update from 'immutability-helper';

import cpot_util from './CpotUtil';

import WgTable from './WgTable';
//import WgButton from './WgButton';
import WgGradientCell from './WgGradientCell';
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
			       console.log("prob change...")
		      }}
		      />
		);}
	    },{
		heading: "Item",
		renderCellContents: (item, i)=>{
		    if(item.range === undefined){
			return (<span>Solid.</span>);
		    }

		    
		    var expandedRange = cpot_util.range_unpack( item.range );
		    return (
			<span>{
			      [0,1].map((val, i)=>{

				  return (<div key={i} className={"threeCells n"+val}>{
				      [
					  {H:val, S:"y", L:"x"},
					  {H:"x", S:val, L:"y"},
					  {H:"x", S:"y", L:val}
				      ].map((object, j)=>{

					  return(
					      <div key={j}>
						<WgGradientCell
						   dim={25}
						   expandedRange={expandedRange}
						   gradientConfig={object}
						   />
					      </div>
					  );
				      })
				  }</div>);
			      })
			}
			</span>
		    );}
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
